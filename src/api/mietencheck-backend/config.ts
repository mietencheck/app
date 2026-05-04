/**
 * Base URL for the Mietencheck Nest backend (no trailing slash).
 *
 * - If `VITE_MIETENCHECK_API_BASE_URL` is set, the browser calls that origin
 *   (Nest must allow CORS for the site).
 * - Otherwise use same-origin `/api-mietencheck` so the Cloudflare Worker
 *   (`src/worker.ts`) can proxy to `MIETENCHECK_API_ORIGIN` with no CORS in
 *   the browser.
 */
export function getMietencheckApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_MIETENCHECK_API_BASE_URL;
  if (typeof fromEnv === "string" && fromEnv.trim().length > 0) {
    return fromEnv.replace(/\/$/, "");
  }
  return "/api-mietencheck";
}
