import { getWohnflaeche } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";

import { getWorstBestOrtsueblicheVergleichsmiete } from "./ortsueblicheVergleichsmiete";

export function getWorstBestZulaessigeHoechstmiete(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { worst: number; best: number } | undefined {
  const wohnflaeche = getWohnflaeche(answers, visibleQuestionAliases);
  const ortsueblicheVergleichsmiete = getWorstBestOrtsueblicheVergleichsmiete(
    answers,
    visibleQuestionAliases,
  );

  if (!wohnflaeche || !ortsueblicheVergleichsmiete) {
    return undefined;
  }

  return {
    worst: Number(
      (ortsueblicheVergleichsmiete.worst * wohnflaeche * 1.1).toFixed(2),
    ),
    best: Number(
      (ortsueblicheVergleichsmiete.best * wohnflaeche * 1.1).toFixed(2),
    ),
  };
}
