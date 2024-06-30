import sentryPlugin from "@cloudflare/pages-plugin-sentry";

export const onRequest = sentryPlugin({
  dsn: "https://5b3bf3b18d522ae4cf0452ab3816141a@o4507089363075072.ingest.de.sentry.io/4507089364320336",
});
