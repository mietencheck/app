import { getWorstBestPreisspanne } from "~/calculation/preisspanne";
import { FinalAnswers } from "~/form/flow-machine";

import { getWorstBestSondermerkmalAufschlag } from "./sondermerkmale";
import { getWorstBestSpanneneinordnungInPercent } from "./spanneneinordnung";

export const calcMerkmalsgruppenValueInEuro = (
  preisspanne: [number, number, number],
  spanneneinordnung: number,
  sondermerkmalAufschlag: number,
): number => {
  const [average, lowerLimit, upperLimit] = preisspanne;
  if (spanneneinordnung >= 0) {
    // sondermerkmalAufschlag exceeds the upper limit of the Preisspanne, merkmalgruppeAufschlag must be ignored.
    if (average + sondermerkmalAufschlag > upperLimit) {
      return 0;
    }

    const spanneneinordnungAufschlag =
      (upperLimit - average) * spanneneinordnung;
    const maxAllowedSpanneneinordnungAufschlag =
      upperLimit - average - sondermerkmalAufschlag;

    return Math.min(
      spanneneinordnungAufschlag,
      maxAllowedSpanneneinordnungAufschlag,
    );
  } else {
    return (average - lowerLimit) * spanneneinordnung;
  }
};

/**
 * Calculates the Vergleichsmiete for a given Preisspanne, Spanneneinordnung and
 * Sondermerkmal Abzug.
 */
const calcOrtsueblicheVergleichsmiete = (
  preisspanne: [number, number, number],
  spanneneinordnung: number,
  sondermerkmalAufschlag: number,
): number => {
  const [average, _] = preisspanne;
  const merkmalsgruppenValue = calcMerkmalsgruppenValueInEuro(
    preisspanne,
    spanneneinordnung,
    sondermerkmalAufschlag,
  );

  return Number(
    (average + merkmalsgruppenValue + sondermerkmalAufschlag).toFixed(2),
  );
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
