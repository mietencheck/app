import { getWohnflaeche } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";

import { getWorstBestOrtsueblicheVergleichsmiete } from "./ortsueblicheVergleichsmiete";

export function getLowestHighestZulaessigeHoechstmiete(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { lowest: number; highest: number } | undefined {
  const wohnflaeche = getWohnflaeche(answers, visibleQuestionAliases);
  const ortsueblicheVergleichsmiete = getWorstBestOrtsueblicheVergleichsmiete(
    answers,
    visibleQuestionAliases,
  );

  if (!wohnflaeche || !ortsueblicheVergleichsmiete) {
    return undefined;
  }

  return {
    lowest: Number(
      (ortsueblicheVergleichsmiete.best * wohnflaeche * 1.1).toFixed(2),
    ),
    highest: Number(
      (ortsueblicheVergleichsmiete.worst * wohnflaeche * 1.1).toFixed(2),
    ),
  };
}
