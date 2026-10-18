import { getWorstBestPreisspanne } from "~/calculation/preisspanne";
import { getWorstBestSondermerkmalModifier } from "~/calculation/sondermerkmale";
import { getWorstBestSpanneneinordnungInPercent } from "~/calculation/spanneneinordnung";

import { CalculationContext } from "./types";

export const calcMerkmalsgruppenValueInEuro = (
  preisspanne: [number, number, number],
  spanneneinordnung: number,
  sondermerkmalAufschlag: number,
): number => {
  const [average, lowerLimit, upperLimit] = preisspanne;
  const specialBase = average + sondermerkmalAufschlag;
  // 2015 section 11.3, step 3: once special features alone exceed either
  // endpoint, no orientation adjustment may be applied in either direction.
  if (specialBase < lowerLimit || specialBase > upperLimit) return 0;
  if (spanneneinordnung >= 0) {
    const spanneneinordnungAufschlag =
      (upperLimit - average) * spanneneinordnung;
    const maxAllowedSpanneneinordnungAufschlag =
      upperLimit - average - sondermerkmalAufschlag;

    return Math.min(
      spanneneinordnungAufschlag,
      maxAllowedSpanneneinordnungAufschlag,
    );
  } else {
    return Math.max(
      (average - lowerLimit) * spanneneinordnung,
      lowerLimit - specialBase,
    );
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
  const [average] = preisspanne;
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
  ctx: CalculationContext,
): { worst: number; best: number } | undefined {
  const preisspanne = getWorstBestPreisspanne(ctx);
  const spanneneinordnung = getWorstBestSpanneneinordnungInPercent(ctx);
  const sondermerkmalModifier = getWorstBestSondermerkmalModifier(ctx);

  if (!preisspanne) {
    return undefined;
  }
  return {
    best: calcOrtsueblicheVergleichsmiete(
      preisspanne.best,
      spanneneinordnung.best,
      sondermerkmalModifier.best,
    ),
    worst: calcOrtsueblicheVergleichsmiete(
      preisspanne.worst,
      spanneneinordnung.worst,
      sondermerkmalModifier.worst,
    ),
  };
}
