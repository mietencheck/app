import { useMemo } from "react";

import { getLowestHighestZulaessigeHoechstmiete } from "~/2024/calculation/zulaessigeHoechstmiete";
import {
  useAnswers,
  useVisibleQuestionAliases,
} from "~/2024/form/flow-machine";

export function useLowestHighestZulaessigeHoechstmiete() {
  const answers = useAnswers();
  const visibleQuestionAlises = useVisibleQuestionAliases();

  return useMemo(
    () =>
      getLowestHighestZulaessigeHoechstmiete(
        answers.getAliasedState(),
        visibleQuestionAlises,
      ) ?? {
        highest: 0,
        lowest: 0,
      },
    [answers, visibleQuestionAlises],
  );
}
