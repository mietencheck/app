import { multiplyMoney } from "./money";
import { getWorstBestOrtsueblicheVergleichsmiete } from "./ortsueblicheVergleichsmiete";
import { CalculationContext } from "./types";

export function getWorstBestZulaessigeHoechstmiete(
  ctx: CalculationContext,
): { worst: number; best: number } | undefined {
  const { typ, wohnflaeche } = ctx;
  if (!Number.isFinite(wohnflaeche) || wohnflaeche <= 0) {
    return undefined;
  }
  const vergleichsmiete = getWorstBestOrtsueblicheVergleichsmiete(ctx);
  if (!vergleichsmiete) return undefined;
  const factor = typ === "Miete" ? 1.1 : 1;
  const result = {
    worst: multiplyMoney(vergleichsmiete.worst, wohnflaeche, factor),
    best: multiplyMoney(vergleichsmiete.best, wohnflaeche, factor),
  };
  return Number.isFinite(result.best) && Number.isFinite(result.worst)
    ? result
    : undefined;
}
