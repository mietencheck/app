/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional. If set, the browser calls this Nest origin (CORS required).
   * If omitted, requests use same-origin `/api-mietencheck` (Cloudflare Worker proxy).
   */
  readonly VITE_MIETENCHECK_API_BASE_URL?: string;
  readonly VITE_SANITY_PROJECT_ID?: string;
  readonly VITE_SANITY_DATASET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
