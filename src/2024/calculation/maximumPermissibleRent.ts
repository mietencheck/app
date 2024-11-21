import { getLowestHighestRentBracket } from "~/2024/calculation/rentBracket";
import { FinalAnswers } from "~/form/flow-machine";

import { getLowestHighestFeatureGroupsModifier } from "./featureGroups";

export function getLowestHighestMaximumPermissibleRent(
  answers: FinalAnswers,
): { lowest: number; highest: number } | null {
  const lowestHighestRentIndexBracket = getLowestHighestRentBracket(answers);
  const lowestHighestFeatureGroupsModifier =
    getLowestHighestFeatureGroupsModifier(answers);

  return {
    lowest: 0,
    highest: 0,
  };
}
