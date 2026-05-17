import { getWorstBestPreisspanne } from "./calculation/preisspanne";
import { getWorstBestZulaessigeHoechstmiete } from "./calculation/zulaessigeHoechstmiete";
import { answersToCalculationContext } from "./form/calculation-context";
import { evaluateFlowMachine } from "./form/flow-machine-evaluation";
import { FinalAnswers } from "./form/flow-machine-runtime";

interface Env {
  ASSETS?: Fetcher;
  DB?: D1Database;
  /** Optional; defaults to local Nest in dev. Used to proxy `/api-mietencheck/*`. */
  MIETENCHECK_API_ORIGIN?: string;
}

const MIETENCHECK_PROXY_PREFIX = "/api-mietencheck";
const CANONICAL_HOST = "mietencheck.de";

function redirectWwwToCanonical(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.hostname !== `www.${CANONICAL_HOST}`) {
    return null;
  }

  url.hostname = CANONICAL_HOST;
  url.protocol = "https:";
  return Response.redirect(url.toString(), 301);
}

function mietencheckBackendPath(pathname: string): string {
  if (!pathname.startsWith(MIETENCHECK_PROXY_PREFIX)) {
    return pathname;
  }
  const rest = pathname.slice(MIETENCHECK_PROXY_PREFIX.length);
  if (rest === "" || rest === "/") {
    return "/";
  }
  return rest.startsWith("/") ? rest : `/${rest}`;
}

/**
 * Dev apps call `/api-mietencheck` (same origin). Vite `server.proxy` does not run
 * when requests go through Miniflare — forward here to the Nest backend.
 */
async function proxyMietencheckBackend(request: Request, env: Env) {
  const incoming = new URL(request.url);
  const origin =
    env.MIETENCHECK_API_ORIGIN?.replace(/\/$/, "") ?? "http://127.0.0.1:3000";

  const path = mietencheckBackendPath(incoming.pathname);
  const targetUrl = new URL(path + incoming.search, `${origin}/`);

  const headers = new Headers(request.headers);
  headers.delete("host");

  return fetch(targetUrl, {
    method: request.method,
    headers,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? request.body
        : undefined,
  });
}

interface SessionRow {
  form_data: string;
}

interface ZulaessigeHoechstmieteRequestBody {
  answers: FinalAnswers;
  visibleQuestionAliases: string[];
}

interface FlowMachineRequestBody {
  answers?: Record<string, unknown>;
}

const HTML_ACCEPT_RE = /\btext\/html\b/i;

const methodNotAllowed = () => new Response(null, { status: 405 });
const databaseUnavailable = () =>
  json(
    { error: "Session storage is unavailable in this environment" },
    { status: 503 },
  );

const json = (value: unknown, init: ResponseInit = {}) => {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return new Response(JSON.stringify(value), {
    ...init,
    headers,
  });
};

const isHtmlNavigationRequest = (request: Request) =>
  request.method === "GET" &&
  HTML_ACCEPT_RE.test(request.headers.get("accept") ?? "");

async function handleCreateSession(request: Request, env: Env) {
  if (request.method !== "POST") {
    return methodNotAllowed();
  }

  if (!env.DB) {
    return databaseUnavailable();
  }

  let hash = crypto.randomUUID();
  while (
    await env.DB.prepare("SELECT 1 FROM sessions WHERE hash = ?")
      .bind(hash)
      .first()
  ) {
    hash = crypto.randomUUID();
  }

  await env.DB.prepare("INSERT INTO sessions (hash, form_data) VALUES (?, ?)")
    .bind(hash, await request.text())
    .run();

  return new Response(hash);
}

async function handleSessionByHash(request: Request, env: Env, hash: string) {
  if (!env.DB) {
    return databaseUnavailable();
  }

  if (request.method === "GET") {
    const row = await env.DB.prepare(
      "SELECT form_data FROM sessions WHERE hash = ?",
    )
      .bind(hash)
      .first<SessionRow>();

    if (!row) {
      return new Response(null, { status: 404 });
    }

    return new Response(row.form_data, {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (request.method === "PUT") {
    await env.DB.prepare("UPDATE sessions SET form_data = ? WHERE hash = ?")
      .bind(await request.text(), hash)
      .run();

    return new Response(null, { status: 204 });
  }

  return methodNotAllowed();
}

async function handleZulaessigeHoechstmiete(request: Request) {
  if (request.method !== "POST") {
    return methodNotAllowed();
  }

  try {
    const { answers, visibleQuestionAliases } =
      (await request.json()) as ZulaessigeHoechstmieteRequestBody;

    const ctx = answersToCalculationContext(
      answers,
      new Set(visibleQuestionAliases),
    );
    const result = ctx ? getWorstBestZulaessigeHoechstmiete(ctx) : undefined;

    return json(result ?? null);
  } catch {
    return json({ error: "Invalid request data" }, { status: 400 });
  }
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

async function handleFlowMachine(request: Request) {
  if (request.method !== "POST") {
    return methodNotAllowed();
  }

  try {
    const body = (await request.json()) as
      | FlowMachineRequestBody
      | Record<string, unknown>;
    const submittedAnswers =
      isObjectRecord(body) && isObjectRecord(body.answers)
        ? body.answers
        : isObjectRecord(body)
          ? body
          : null;

    if (!submittedAnswers) {
      return json({ error: "Invalid request data" }, { status: 400 });
    }

    const evaluation = evaluateFlowMachine(submittedAnswers);
    const ctx = answersToCalculationContext(
      evaluation.answers as FinalAnswers,
      new Set(evaluation.visibleQuestionAliases),
    );
    const preisspanne = ctx ? getWorstBestPreisspanne(ctx) : undefined;

    return json({
      ...evaluation,
      preisspanne: preisspanne ?? null,
    });
  } catch {
    return json({ error: "Invalid request data" }, { status: 400 });
  }
}

async function handleSentryEnvelope(request: Request) {
  if (request.method !== "POST" || !request.body) {
    return methodNotAllowed();
  }

  const [header, body] = request.body.tee();
  const firstLine = (await new Response(header).text()).split("\n", 1)[0];
  const event = JSON.parse(firstLine) as { dsn: string };
  const dsn = new URL(event.dsn);
  const headers = new Headers(request.headers);
  const connectingIp = request.headers.get("CF-Connecting-IP");

  if (connectingIp) {
    headers.set("X-Forwarded-For", connectingIp);
  }

  return fetch(`https://${dsn.host}/api${dsn.pathname}/envelope/`, {
    method: "POST",
    body,
    headers,
  });
}

async function serveAsset(request: Request, env: Env) {
  if (!env.ASSETS) {
    return fetch(request);
  }

  const response = await env.ASSETS.fetch(request);
  if (response.status !== 404 || !isHtmlNavigationRequest(request)) {
    return response;
  }

  const url = new URL(request.url);
  url.pathname = "/";
  url.search = "";

  return env.ASSETS.fetch(new Request(url, request));
}

export default {
  async fetch(request, env) {
    const wwwRedirect = redirectWwwToCanonical(request);
    if (wwwRedirect) {
      return wwwRedirect;
    }

    const { pathname } = new URL(request.url);

    if (pathname === "/sessions") {
      return handleCreateSession(request, env);
    }

    const sessionMatch = pathname.match(/^\/sessions\/([^/]+)$/);
    if (sessionMatch) {
      return handleSessionByHash(
        request,
        env,
        decodeURIComponent(sessionMatch[1]),
      );
    }

    if (pathname === "/zulaessige-hoechstmiete") {
      return handleZulaessigeHoechstmiete(request);
    }

    if (pathname === "/api/miete") {
      return handleFlowMachine(request);
    }

    if (pathname === "/sentry") {
      return handleSentryEnvelope(request);
    }

    if (
      pathname === MIETENCHECK_PROXY_PREFIX ||
      pathname.startsWith(`${MIETENCHECK_PROXY_PREFIX}/`)
    ) {
      return proxyMietencheckBackend(request, env);
    }

    return serveAsset(request, env);
  },
} satisfies ExportedHandler<Env>;
