import { useLocation } from "@swan-io/chicane";
import { useEffect, useMemo, useRef } from "react";

import { useAnswers, useSchnelltestSteps } from "~/form/flow-machine";

import { Layout } from "./Layout";
import { Questions } from "./questions";
import { Result } from "./result";
import { DetailsRouter } from "./router";
import { Summary } from "./summary";

export default function DetailsPage() {
  const route = DetailsRouter.useRoute(["Summary", "Questions", "Result"]);

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
            return <Summary />;

          case "Questions":
            return <Questions />;

          case "Result":
            return <Result />;

          default:
            route satisfies never;
        }
      })()}
    </Layout>
  );
}
