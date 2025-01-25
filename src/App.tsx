import * as Sentry from "@sentry/react";
import React, { Suspense, useCallback, useEffect, useMemo } from "react";
import { Dialog } from "react-aria-components";

import LandingPage from "~/pages/landing";
import { DatenschutzPage } from "~/pages/landing/datenschutz";
import { ImpressumPage } from "~/pages/landing/impressum";
import { UeberUnsPage } from "~/pages/landing/ueber-uns";
import { SchnelltestPage } from "~/pages/schnelltest";

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

  if (!route) return null;
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
