import { createClient, type SanityClient } from "@sanity/client";

const viteEnv = import.meta.env;
const nodeEnv = typeof process !== "undefined" ? process.env : undefined;

const projectId =
  viteEnv?.VITE_SANITY_PROJECT_ID ??
  nodeEnv?.VITE_SANITY_PROJECT_ID ??
  "te770b4o";
const dataset =
  viteEnv?.VITE_SANITY_DATASET ?? nodeEnv?.VITE_SANITY_DATASET ?? "production";

const client: SanityClient = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: "2025-01-01",
});

export { projectId, dataset };
export default client;
