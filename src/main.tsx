import * as Sentry from "@sentry/react";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { Providers } from "./provider";

import "./globals.css";

Sentry.init({
  tunnel: "/sentry",
  dsn: "https://5b3bf3b18d522ae4cf0452ab3816141a@o4507089363075072.ingest.de.sentry.io/4507089364320336",
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV !== "development",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
);
