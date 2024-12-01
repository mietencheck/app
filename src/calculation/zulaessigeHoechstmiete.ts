import { getWohnflaeche } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";

import { getLowestHighestOrtsueblicheVergleichsmiete } from "./ortsueblicheVergleichsmiete";

export function getLowestHighestZulaessigeHoechstmiete(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { lowest: number; highest: number } | undefined {
  const wohnflaeche = getWohnflaeche(answers, visibleQuestionAliases);
  const ortsueblicheVergleichsmiete =
    getLowestHighestOrtsueblicheVergleichsmiete(
      answers,
      visibleQuestionAliases,
    );

  if (!wohnflaeche || !ortsueblicheVergleichsmiete) {
    return undefined;
  }

  return {
    lowest: Number(
      (ortsueblicheVergleichsmiete.lowest * wohnflaeche * 1.1).toFixed(2),
    ),
    highest: Number(
      (ortsueblicheVergleichsmiete.highest * wohnflaeche * 1.1).toFixed(2),
    ),
  };
}
