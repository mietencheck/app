import { getLowestHighestRentIndexBracket } from "~/2024/calculation/rentIndexBracket";
import { FinalAnswers } from "~/form/flow-machine";

export function getLowestHighestMaximumPermissibleRent(
  answers: FinalAnswers,
): { lowest: number; highest: number } | null {
  const lowestHighestRentIndexBracket =
    getLowestHighestRentIndexBracket(answers);

  return {
    lowest: 0,
    highest: 0,
  };
}
