import { getLowestHighestPreisspanne } from "~/2024/calculation/preisspanne";
import { FinalAnswers } from "~/form/flow-machine";

import { getLowestHighestSpanneneinordnung } from "./spanneneinordnung";

export function getLowestHighestZulaessigeHoechstmiete(
  answers: FinalAnswers,
): { lowest: number; highest: number } | null {
  const lowestHighestPreisspanne = getLowestHighestPreisspanne(answers);
  const lowestHighestSpanneneinordnung = getLowestHighestSpanneneinordnung();

  return {
    lowest: 0,
    highest: 0,
  };
}
