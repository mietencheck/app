import { getSondermerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";

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

  return {
    lowest: 0,
    highest: 0,
  };
}
