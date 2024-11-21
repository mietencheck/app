import { getLowestHighestPriceRange } from "~/2024/calculation/priceRange";
import { FinalAnswers } from "~/form/flow-machine";

export function getLowestHighestMaximumPermissibleRent(
  answers: FinalAnswers,
): { lowest: number; highest: number } | null {
  const lowestHighestPriceRange = getLowestHighestPriceRange(answers);

  return {
    lowest: 0,
    highest: 0,
  };
}
