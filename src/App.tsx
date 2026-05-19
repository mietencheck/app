import * as Sentry from "@sentry/react";
import React, { Suspense, useCallback, useEffect, useMemo } from "react";
import { Dialog } from "react-aria-components";

import { RequireAuth } from "~/auth/RequireAuth";
import { BeratungListPage } from "~/pages/beratung";
import { BeratungDetailPage } from "~/pages/beratung/[id]";
import { DatenschutzPage } from "~/pages/datenschutz";
import { EintragenPage } from "~/pages/eintragen";
import { ImpressumPage } from "~/pages/impressum";
import LandingPage from "~/pages/landing";
import { LoginPage } from "~/pages/login";
import { SchnelltestPage } from "~/pages/schnelltest";

// import { BlogIndexContent } from "./pages/blog/BlogIndex.ssg";
// import { BlogPostContent } from "./pages/blog/BlogPost.ssg";
import { AppRouter } from "./router";
import {
  ContinueSessionDialog,
  SESSION_PARAM,
  useSyncAnswers,
} from "./session";

const DetailsPage = React.lazy(() => import("~/pages/fragebogen"));

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
    "BeratungDetail",
    "Beratung",
    "Landing",
    "Login",
    "Eintragen",
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
    case "Login":
      return <LoginPage />;
    case "Eintragen":
      return <EintragenPage />;
    case "Schnelltest":
      return <SchnelltestPage />;
    case "Details":
      return <DetailsPage />;
    case "Beratung":
      return (
        <RequireAuth>
          <BeratungListPage />
        </RequireAuth>
      );
    case "BeratungDetail":
      return (
        <RequireAuth>
          <BeratungDetailPage mietenFlowId={route.params.id} />
        </RequireAuth>
      );
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
        <ContinueSessionDialog hash={sessionHashInURL} />
      </Dialog>
    );
  }

  return (
    <Suspense>
      <Router />
    </Suspense>
  );
}
