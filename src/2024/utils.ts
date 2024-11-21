import { useMemo } from "react";

import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";

import { getLowestHighestMaximumPermissibleRent as getHighestLowestMaximumPermissibleRent } from "./calculation/maximumPermissibleRent";

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
