import { getTyp, getWohnflaeche } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";

import { getWorstBestOrtsueblicheVergleichsmiete } from "./ortsueblicheVergleichsmiete";

export function getWorstBestZulaessigeHoechstmiete(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { worst: number; best: number } | undefined {
  const typ = getTyp(answers, visibleQuestionAliases);
  const wohnflaeche = getWohnflaeche(answers, visibleQuestionAliases);
  const ortsueblicheVergleichsmiete = getWorstBestOrtsueblicheVergleichsmiete(
    answers,
    visibleQuestionAliases,
  );

  if (!typ || !wohnflaeche || !ortsueblicheVergleichsmiete) {
    return undefined;
  }

  if (typ == "Miete") {
    return {
      worst: Number(
        (ortsueblicheVergleichsmiete.worst * wohnflaeche * 1.1).toFixed(2),
      ),
      best: Number(
        (ortsueblicheVergleichsmiete.best * wohnflaeche * 1.1).toFixed(2),
      ),
    };
  } else {
    return {
      worst: Number(
        (ortsueblicheVergleichsmiete.worst * wohnflaeche).toFixed(2),
      ),
      best: Number((ortsueblicheVergleichsmiete.best * wohnflaeche).toFixed(2)),
    };
  }
}
