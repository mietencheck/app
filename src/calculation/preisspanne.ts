import {
  getBaujahrSpanne,
  getMietspiegeljahr,
  getWohnflaecheSpanne,
  getWohnlage,
} from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";
import { preisspannenByMietspiegeljahr } from "~/mietspiegel/preisspannen";
import { Preisspanne } from "~/mietspiegel/types";

import { getWorstBestAusstattungsAbzug } from "./ausstattungsAbzug";

/**
 *  Calculates the worst and best applicable Preisspanne ('rent bracket') based on the provided answers.
 */
export function getWorstBestPreisspanne(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { worst: Preisspanne; best: Preisspanne } | undefined {
  const mietspiegeljahr = getMietspiegeljahr(answers, visibleQuestionAliases);
  const baujahrSpanne = getBaujahrSpanne(answers, visibleQuestionAliases);
  const wohnflaecheSpanne = getWohnflaecheSpanne(
    answers,
    visibleQuestionAliases,
  );
  const wohnlage = getWohnlage(answers, visibleQuestionAliases);
  const worstBestAusstattungsAbzug = getWorstBestAusstattungsAbzug(
    answers,
    visibleQuestionAliases,
  );

  if (
    !mietspiegeljahr ||
    !baujahrSpanne ||
    !wohnlage ||
    !wohnflaecheSpanne ||
    !worstBestAusstattungsAbzug
  ) {
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
