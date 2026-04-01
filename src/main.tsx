import * as Sentry from "@sentry/react";
import { ViteReactSSG } from "vite-react-ssg";

import routes from "./routes";

import "./globals.css";

Sentry.init({
  tunnel: "/sentry",
  dsn: "https://5b3bf3b18d522ae4cf0452ab3816141a@o4507089363075072.ingest.de.sentry.io/4507089364320336",
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV !== "development",
});

export const createRoot = ViteReactSSG({ routes });
