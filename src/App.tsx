import * as Sentry from "@sentry/react";
import React, { Suspense, useCallback, useEffect, useMemo } from "react";
import { Dialog } from "react-aria-components";

import { BeratungPage } from "~/pages/beratung";
import LandingPage from "~/pages/landing";
import { DatenschutzPage } from "~/pages/landing/datenschutz";
import { ImpressumPage } from "~/pages/landing/impressum";
import { UeberUnsPage } from "~/pages/landing/ueber-uns";
import { SchnelltestPage } from "~/pages/schnelltest";

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
    "Beratung",
    "Error",
    // "Blog",
    // "BlogPost",
  ]);

  if (!route) return <div>Route not found: {window.location.pathname}</div>;
  switch (route.name) {
    case "Landing":
      return <LandingPage />;
    case "Schnelltest":
      return <SchnelltestPage />;
    case "Details":
      return <DetailsPage />;
    case "Beratung":
      return <BeratungPage />;
    case "UeberUns":
      return <UeberUnsPage />;
    case "Datenschutz":
      return <DatenschutzPage />;
    case "Impressum":
      return <ImpressumPage />;
    case "Error":
      throw new Error("in der Hose");
    // case "Blog":
    //   return (
    //     <Suspense
    //       fallback={<div className="p-10 text-center">Lade Blog...</div>}
    //     >
    //       <BlogIndexContent />
    //     </Suspense>
    //   );
    // case "BlogPost":
    //   return (
    //     <Suspense
    //       fallback={<div className="p-10 text-center">Lade Artikel...</div>}
    //     >
    //       <BlogPostContent />
    //     </Suspense>
    //   );
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
