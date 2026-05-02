/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Mietencheck Nest backend (no trailing slash). Omit in dev to use the Vite proxy at `/api-mietencheck`. */
  readonly VITE_MIETENCHECK_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
