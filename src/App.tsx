import * as Sentry from "@sentry/react";
import React, { Suspense, useCallback, useEffect, useMemo } from "react";
import { Dialog } from "react-aria-components";

import { DatenschutzPage } from "~/pages/datenschutz";
import { ImpressumPage } from "~/pages/impressum";
import LandingPage from "~/pages/landing";
import { SchnelltestPage } from "~/pages/schnelltest";
import { UeberUnsPage } from "~/pages/ueber-uns";

// import { BlogIndexContent } from "./pages/blog/BlogIndex.ssg";
// import { BlogPostContent } from "./pages/blog/BlogPost.ssg";
import { AppRouter } from "./router";
import { ContinueSessionModal, SESSION_PARAM, useSyncAnswers } from "./session";

const DetailsPage = React.lazy(() => import("~/pages/details"));

function parseJSONOrUseDirectly(value: unknown) {
  try {
    return JSON.parse(value as string);
  } catch {
    return value;
  }
}

function useLocalStorageInSentryContext() {
  const updateSentryContext = useCallback(() => {
    Sentry.setContext(
      "localStorage",
      Object.fromEntries(
        Object.entries(localStorage).map(([key, value]) => [
          key,
          parseJSONOrUseDirectly(value),
        ]),
      ),
    );
  }, []);
  useEffect(() => {
    updateSentryContext();
    window.addEventListener("storage", updateSentryContext);
    return () => window.removeEventListener("storage", updateSentryContext);
  }, [updateSentryContext]);
}

function Router() {
  const route = AppRouter.useRoute([
    "Landing",
    "UeberUns",
    "Datenschutz",
    "Impressum",
    "Schnelltest",
    "Details",
    "Error",
  ]);

  if (!route) return <div>Route not found: {window.location.pathname}</div>;
  switch (route.name) {
    case "Landing":
      return <LandingPage />;
    case "Schnelltest":
      return <SchnelltestPage />;
    case "Details":
      return <DetailsPage />;
    case "UeberUns":
      return <UeberUnsPage />;
    case "Datenschutz":
      return <DatenschutzPage />;
    case "Impressum":
      return <ImpressumPage />;
    case "Error":
      throw new Error("in der Hose");
    default:
      route satisfies never;
  }
}

export function App() {
  useSyncAnswers();

  useLocalStorageInSentryContext();

  const sessionHashInURL = useMemo(
    () =>
      typeof window === "undefined"
        ? null
        : new URLSearchParams(window.location.search).get(SESSION_PARAM),
    [],
  );

  if (sessionHashInURL) {
    return (
      <Dialog>
        <ContinueSessionModal hash={sessionHashInURL} />
      </Dialog>
    );
  }

  return (
    <Suspense>
      <Router />
    </Suspense>
  );
}
