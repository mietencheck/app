import { createClient, type SanityClient } from "@sanity/client";

const client: SanityClient = createClient({
  projectId: "te770b4o",
  dataset: "production",
  useCdn: false,
  apiVersion: "2025-01-01",
});

export default client;
