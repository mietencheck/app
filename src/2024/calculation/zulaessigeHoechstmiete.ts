import { FinalAnswers } from "~/form/flow-machine";

import { getLowestHighestOrtsueblicheVergleichsmiete } from "./ortsueblicheVergleichsmiete";

export function getLowestHighestZulaessigeHoechstmiete(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { lowest: number; highest: number } | undefined {
  const ortsueblicheVergleichsmiete =
    getLowestHighestOrtsueblicheVergleichsmiete(
      answers,
      visibleQuestionAliases,
    );

  if (!ortsueblicheVergleichsmiete) {
    return undefined;
  }

  return {
    lowest: Math.round(ortsueblicheVergleichsmiete.lowest * 1.1 * 100) / 100,
    highest: Math.round(ortsueblicheVergleichsmiete.highest * 1.1 * 100) / 100,
  };
}
