import { getWorstBestPreisspanne } from "~/calculation/preisspanne";
import { FinalAnswers } from "~/form/flow-machine";

import { getWorstBestSondermerkmalAufschlag } from "./sondermerkmale";
import { getWorstBestSpanneneinordnungInPercent } from "./spanneneinordnung";

/**
 * Calculates the Vergleichsmiete for a given Preisspanne, Spanneneinordnung and
 * Sondermerkmal Abzug.
 *
 * ### Rules
 * - If `spanneneinordnung` is > 0, the Spanneneinordnung is wohnwerterhöhend.
 * - If `sondermerkmalAufschlag` is > 0, the value must be deducted from the average
 *   in the Preisspanne. The new average is allowed to exceed the lower and upper
 *   threshold of the original preisspanne. [TODO]
 */
const calcOrtsueblicheVergleichsmiete = (
  preisspanne: [number, number, number],
  spanneneinordnung: number,
  sondermerkmalAufschlag: number,
): number => {
  const [avg, lower, upper] = preisspanne;

  if (spanneneinordnung >= 0) {
    const spanneneinordnungAufschlag = (upper - avg) * spanneneinordnung;

    if (avg + sondermerkmalAufschlag > upper) {
      return Number((avg + sondermerkmalAufschlag).toFixed(2));
    } else if (
      avg + sondermerkmalAufschlag + spanneneinordnungAufschlag >
      upper
    ) {
      return Number(upper.toFixed(2));
    } else {
      return Number(
        (avg + sondermerkmalAufschlag + spanneneinordnungAufschlag).toFixed(2),
      );
    }
  } else {
    const spanneneinordnungAbzug = (avg - lower) * spanneneinordnung;

    return Number(
      (avg + sondermerkmalAufschlag + spanneneinordnungAbzug).toFixed(2),
    );
  }
};

export function getWorstBestOrtsueblicheVergleichsmiete(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { worst: number; best: number } | undefined {
  const preisspanne = getWorstBestPreisspanne(answers, visibleQuestionAliases);
  const spanneneinordnung = getWorstBestSpanneneinordnungInPercent(
    answers,
    visibleQuestionAliases,
  );
  const sondermerkmalAufschlag = getWorstBestSondermerkmalAufschlag(
    answers,
    visibleQuestionAliases,
  );

  if (!preisspanne) {
    return undefined;
  }

  return {
    best: calcOrtsueblicheVergleichsmiete(
      preisspanne.best,
      spanneneinordnung.best,
      sondermerkmalAufschlag.best,
    ),
    worst: calcOrtsueblicheVergleichsmiete(
      preisspanne.worst,
      spanneneinordnung.worst,
      sondermerkmalAufschlag.worst,
    ),
  };
}
