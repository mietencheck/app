import { useMemo } from "react";

import { getLowestHighestMaximumPermissibleRent as getHighestLowestMaximumPermissibleRent } from "~/2024/calculation/maximumPermissibleRent";
import {
  useAnswers,
  useVisibleQuestionAliases,
} from "~/2024/form/flow-machine";

export function useHighestLowestMaximumPermissibleRent() {
  const answers = useAnswers();
  const visibleQuestionAlises = useVisibleQuestionAliases();

  return useMemo(
    () =>
      getHighestLowestMaximumPermissibleRent(answers.getAliasedState()) ?? {
        highest: 0,
        lowest: 0,
      },
    [answers, visibleQuestionAlises],
  );
}
