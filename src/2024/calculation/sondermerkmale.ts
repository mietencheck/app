import { FinalAnswers } from "~/2024/form/flow-machine";

import { getSondermerkmalStates } from "../form/api";

export function getLowestHighestSondermerkmalAbzug(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): {
  lowest: number;
  highest: number;
} {
  const sondermerkmalStates = getSondermerkmalStates(
    answers,
    visibleQuestionAliases,
  );

  console.log(sondermerkmalStates);

  return {
    lowest: 0,
    highest: 0,
  };
}
