/** Base URL for the Mietencheck Nest backend (no trailing slash). */
export function getMietencheckApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_MIETENCHECK_API_BASE_URL;
  if (typeof fromEnv === "string" && fromEnv.trim().length > 0) {
    return fromEnv.replace(/\/$/, "");
  }
  if (import.meta.env.DEV) {
    return "/api-mietencheck";
  }
  throw new Error(
    "VITE_MIETENCHECK_API_BASE_URL must be set for production builds",
  );
}
