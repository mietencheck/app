import { getMietencheckApiBaseUrl } from "./config";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message?: string,
  ) {
    super(message ?? `HTTP ${status}`);
    this.name = "ApiError";
  }
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export type MietencheckRequestOptions = RequestInit & {
  token?: string | null;
};

export async function mietencheckRequest(
  path: string,
  init: MietencheckRequestOptions = {},
): Promise<Response> {
  const base = getMietencheckApiBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers);
  if (init.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const { token, ...rest } = init;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, { ...rest, headers });
}

export async function mietencheckJson<T>(
  path: string,
  init: MietencheckRequestOptions = {},
): Promise<T> {
  const res = await mietencheckRequest(path, init);
  const body = await parseBody(res);
  if (!res.ok) {
    throw new ApiError(res.status, body);
  }
  return body as T;
}
