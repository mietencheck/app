import { getTyp } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";

import { useIsCompleted } from "../utils";
import { ResultMiete } from "./miete";
import { ResultMieterhoehung } from "./mieterhoehung";

export function Result() {
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAlises = useVisibleQuestionAliases();

  const typ = getTyp(answers, visibleQuestionAlises);
  const isCompleted = useIsCompleted();

  const l = useLocalizeField();

  if (!isCompleted && location.hash !== "#debug") {
    return (
      <>
        <div className="flex flex-col gap-6">
          <h2 className="heading-24">
            {l("Fragebogen nicht vollständig ausgefüllt Titel")}
          </h2>

          <div className="text-gray-11">
            {l("Fragebogen nicht vollständig ausgefüllt Text")}
          </div>
        </div>
      </>
    );
  }

  if (typ == "Miete") {
    return <ResultMiete />;
  } else {
    return <ResultMieterhoehung />;
  }
}
