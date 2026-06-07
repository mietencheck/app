import { ausstattungsAbzuegeByYear } from "~/mietspiegel/ausstattungsAbzuege";

import { AusstattungState, CalculationContext } from "./types";

/**
 * Calculates the worst and best possible Ausstattungsabzug ('facility discount') for the given calculation context.
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

  const isChecked = (m: AusstattungState) => m == "Nein";
  const isMaybeOrChecked = (m: AusstattungState) =>
    m == "Nein" || m == "Nicht sicher";

  const best =
    isMaybeOrChecked(ausstattung.sammelheizung) &&
    isMaybeOrChecked(ausstattung.bad)
      ? ausstattungsAbzuege["!SH && !Bad"]
      : isMaybeOrChecked(ausstattung.sammelheizung) ||
          isMaybeOrChecked(ausstattung.bad)
        ? ausstattungsAbzuege["!SH || !Bad"]
        : 0;
  const worst =
    isChecked(ausstattung.sammelheizung) && isChecked(ausstattung.bad)
      ? ausstattungsAbzuege["!SH && !Bad"]
      : isChecked(ausstattung.sammelheizung) || isChecked(ausstattung.bad)
        ? ausstattungsAbzuege["!SH || !Bad"]
        : 0;

  return {
    best: best,
    worst: worst,
  };
}
