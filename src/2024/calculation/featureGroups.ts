import { FinalAnswers } from "~/2024/form/flow-machine";

export function getLowestHighestFeatureGroupsModifier(answers: FinalAnswers): {
  highest: number;
  lowest: number;
} {
  return {
    highest: 0,
    lowest: 0,
  };
}
