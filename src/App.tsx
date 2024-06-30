import * as Sentry from "@sentry/react";
import React, { Suspense, useCallback, useEffect, useMemo } from "react";
import { Dialog } from "react-aria-components";

import LandingPage from "./landing";
import { DatenschutzPage } from "./landing/datenschutz";
import { ImpressumPage } from "./landing/impressum";
import { UeberUnsPage } from "./landing/ueber-uns";
import { AppRouter } from "./router";
import { ContinueSessionModal, SESSION_PARAM, useSyncAnswers } from "./session";
import { VorspeisePage } from "./vorspeise";

const DetailsPage = React.lazy(() => import("./details"));
const PDFs = React.lazy(() => import("./pdf"));

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
    "Starter",
    "Details",
    "PDFs",
    "Error",
  ]);

  if (!route) return null;
  switch (route.name) {
    case "Landing":
      return <LandingPage />;
    case "Starter":
      return <VorspeisePage />;
    case "Details":
      return <DetailsPage />;
    case "PDFs":
      return <PDFs />;
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
    () => new URLSearchParams(location.search).get(SESSION_PARAM),
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
