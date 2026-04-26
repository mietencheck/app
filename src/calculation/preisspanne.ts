import { preisspannenByMietspiegeljahr } from "~/mietspiegel/preisspannen";
import { Preisspanne } from "~/mietspiegel/types";

import { getWorstBestAusstattungsAbzug } from "./ausstattungsAbzug";
import { CalculationContext } from "./types";

/**
 *  Calculates the worst and best applicable Preisspanne ('rent bracket') for the given calculation context.
 */
export function getWorstBestPreisspanne(
  ctx: CalculationContext,
): { worst: Preisspanne; best: Preisspanne } | undefined {
  const { mietspiegeljahr, baujahrSpanne, wohnlage, wohnflaecheSpanne } = ctx;
  const worstBestAusstattungsAbzug = getWorstBestAusstattungsAbzug(ctx);

  if (!worstBestAusstattungsAbzug) {
    return undefined;
  }

  // No idea if there's a better way to do this, TS is a mystery to me
  const preisspannen =
    preisspannenByMietspiegeljahr[
      mietspiegeljahr as keyof typeof preisspannenByMietspiegeljahr
    ];
  const preisspannenForBaujahrSpanne =
    preisspannen[
      baujahrSpanne as keyof (typeof preisspannenByMietspiegeljahr)[typeof mietspiegeljahr]
    ];
  const preisspannenForWohnlage = preisspannenForBaujahrSpanne[wohnlage];
  const preisspannenForWohnflaeche =
    preisspannenForWohnlage[
      wohnflaecheSpanne as keyof typeof preisspannenForWohnlage
    ];

  const preisspanne = preisspannenForWohnflaeche;
  if (!preisspanne) {
    return undefined;
  }

  const { best: bestAusstattungsAbzug, worst: worstAusstattungsAbzug } =
    worstBestAusstattungsAbzug;

  return {
    best: [
      Number((preisspanne[0] - bestAusstattungsAbzug).toFixed(2)),
      Number((preisspanne[1] - bestAusstattungsAbzug).toFixed(2)),
      Number((preisspanne[2] - bestAusstattungsAbzug).toFixed(2)),
    ],
    worst: [
      Number((preisspanne[0] - worstAusstattungsAbzug).toFixed(2)),
      Number((preisspanne[1] - worstAusstattungsAbzug).toFixed(2)),
      Number((preisspanne[2] - worstAusstattungsAbzug).toFixed(2)),
    ],
  };
}
