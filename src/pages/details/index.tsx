import { useLocation } from "@swan-io/chicane";
import { useEffect, useMemo, useRef } from "react";

import { useAnswers, useSchnelltestSteps } from "~/form/flow-machine";

import { DetailPage } from "./detail";
import { Layout } from "./Layout";
import { ResultPage } from "./result";
import { DetailsRouter } from "./router";
import { SummaryPage } from "./summary/index";

export default function DetailsPage() {
  const route = DetailsRouter.useRoute(["Summary", "FormPage", "Result"]);

  const location = useLocation();

  const answers = useAnswers();
  const schnelltestSteps = useSchnelltestSteps();
  const isDoneWithStart = useMemo(
    () =>
      schnelltestSteps.every(
        (s) =>
          s.type != "Question" || answers.get([s.alias || s.id]) !== undefined,
      ),
    [answers, schnelltestSteps],
  );

  useEffect(() => {
    if (!isDoneWithStart) {
      window.location.href = "/";
    }
  }, [answers, isDoneWithStart, schnelltestSteps]);

  const prevLocationRef = useRef(location.path);
  useEffect(() => {
    if (prevLocationRef.current !== location.path) {
      window.scrollTo({ top: 0 });
    }
  }, [location.path, route]);

  useEffect(() => {
    if (location.path.length == 1 && location.path[0] == "details") {
      DetailsRouter.push("Summary");
    }
  }, [location.path]);

  if (!route) return null;
  return (
    <Layout>
      {(() => {
        switch (route.name) {
          case "Summary":
            return <SummaryPage />;

          case "FormPage":
            return <DetailPage />;

          case "Result":
            return <ResultPage />;

          default:
            route satisfies never;
        }
      })()}
    </Layout>
  );
}
