import { ausstattungsAbzuegeByYear } from "~/mietspiegel/ausstattungsAbzuege";

import { AusstattungState, CalculationContext } from "./types";

/**
 * Calculates the worst and best possible Ausstattungsabzug for the given calculation context.
 */
export function getWorstBestAusstattungsAbzug(
  ctx: CalculationContext,
): { worst: number; best: number } | undefined {
  const { mietspiegeljahr, baujahrSpanne, ausstattung } = ctx;

  const yearAbzuege = ausstattungsAbzuegeByYear[mietspiegeljahr];
  const ausstattungsAbzuege =
    yearAbzuege?.[baujahrSpanne as keyof typeof yearAbzuege];

  if (!ausstattungsAbzuege) {
    return {
      best: 0,
      worst: 0,
    };
  }

  const possibilities = (state: AusstattungState): boolean[] =>
    state === "Nicht sicher" ? [true, false] : [state === "Ja"];
  const possibleAusstattungsAbzuege = possibilities(
    ausstattung.sammelheizung,
  ).flatMap((hasSammelheizung) =>
    possibilities(ausstattung.bad).map((hasBad) =>
      !hasSammelheizung && !hasBad
        ? ausstattungsAbzuege["!SH && !Bad"]
        : !hasSammelheizung || !hasBad
          ? ausstattungsAbzuege["!SH || !Bad"]
          : 0,
    ),
  );
  // Ausstattungsabzüge are not necessarily monotonic: see the 2017 pre-1919 footnote.
  return {
    best: Math.max(...possibleAusstattungsAbzuege),
    worst: Math.min(...possibleAusstattungsAbzuege),
  };
}
