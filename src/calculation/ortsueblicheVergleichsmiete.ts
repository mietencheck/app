import { getLowestHighestPreisspanne } from "~/calculation/preisspanne";
import { FinalAnswers } from "~/form/flow-machine";

import { getLowestHighestSondermerkmalAbzugTotal } from "./sondermerkmale";
import { getWorstBestSpanneneinordnungInPercent } from "./spanneneinordnung";

const calcOrtsueblicheVergleichsmiete = (
  preisspanne: [number, number, number],
  spanneneinordnung: number,
  sondermerkmalAbzug: number,
): number => {
  const [avg, lower, upper] = preisspanne;
  if (spanneneinordnung >= 0) {
    return Number(
      (avg - sondermerkmalAbzug + (upper - avg) * spanneneinordnung).toFixed(2),
    );
  } else {
    return Number(
      (avg - sondermerkmalAbzug + (avg - lower) * spanneneinordnung).toFixed(2),
    );
  }
};

export function getLowestHighestOrtsueblicheVergleichsmiete(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { lowest: number; highest: number } | undefined {
  const preisspanne = getLowestHighestPreisspanne(
    answers,
    visibleQuestionAliases,
  );
  const spanneneinordnung = getWorstBestSpanneneinordnungInPercent(
    answers,
    visibleQuestionAliases,
  );
  const sondermerkmalAbzug = getLowestHighestSondermerkmalAbzugTotal(
    answers,
    visibleQuestionAliases,
  );

  if (!preisspanne) {
    return undefined;
  }

  return {
    lowest: calcOrtsueblicheVergleichsmiete(
      preisspanne.lowest,
      spanneneinordnung.worst,
      sondermerkmalAbzug.highest,
    ),
    highest: calcOrtsueblicheVergleichsmiete(
      preisspanne.highest,
      spanneneinordnung.best,
      sondermerkmalAbzug.lowest,
    ),
  };
}
