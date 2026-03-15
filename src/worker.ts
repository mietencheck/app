import { getWorstBestZulaessigeHoechstmiete } from "./calculation/zulaessigeHoechstmiete";
import type { FinalAnswers } from "./form/flow-machine";

interface Env {
  ASSETS: Fetcher;
  DB?: D1Database;
}

interface SessionRow {
  form_data: string;
}

interface ZulaessigeHoechstmieteRequestBody {
  answers: FinalAnswers;
  visibleQuestionAliases: string[];
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

    const result = getWorstBestZulaessigeHoechstmiete(
      answers,
      new Set(visibleQuestionAliases),
    );

    return json(result ?? "foo");
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

    if (pathname === "/sentry") {
      return handleSentryEnvelope(request);
    }

    return serveAsset(request, env);
  },
} satisfies ExportedHandler<Env>;
