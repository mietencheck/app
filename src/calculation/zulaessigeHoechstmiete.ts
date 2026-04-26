import { getWorstBestOrtsueblicheVergleichsmiete } from "./ortsueblicheVergleichsmiete";
import { CalculationContext } from "./types";

export function getWorstBestZulaessigeHoechstmiete(
  ctx: CalculationContext,
): { worst: number; best: number } | undefined {
  const { typ, wohnflaeche } = ctx;
  const ortsueblicheVergleichsmiete =
    getWorstBestOrtsueblicheVergleichsmiete(ctx);

  if (!wohnflaeche || !ortsueblicheVergleichsmiete) {
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
