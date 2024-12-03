import {
  getAusstattung,
  getBaujahrSpanne,
  getMietspiegeljahr,
  getWohnflaecheSpanne,
  getWohnlage,
} from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";
import { ausstattungsAbzuegeByYear } from "~/mietspiegel/ausstattungsAbzuege";
import { preisspannenByMietspiegeljahr } from "~/mietspiegel/preisspannen";
import { Preisspanne } from "~/mietspiegel/types";

/**
 * Calculates the lowest and highest possible Ausstattungsabzug ('facility discount') based on the provided answers.
 *
 * @param {FinalAnswers} answers - The answers object containing user input data.
 * @returns  {{ highestDiscount: number; lowestDiscount: number } | undefined} - The lowest and highest discounts in Euro, or undefined if the calculation cannot be performed.
 */
export function getWorstBestAusstattungsAbzug(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { worst: number; best: number } | undefined {
  const mietspiegelJahr = getMietspiegeljahr(answers, visibleQuestionAliases);
  const baujahrSpanne = getBaujahrSpanne(answers, visibleQuestionAliases);
  const ausstattung = getAusstattung(answers, visibleQuestionAliases);

  if (
    !mietspiegelJahr ||
    !baujahrSpanne ||
    !ausstattung.sammelheizung ||
    !ausstattung.bad
  ) {
    return undefined;
  }

  const ausstattungsAbzuege =
    ausstattungsAbzuegeByYear[
      mietspiegelJahr as keyof typeof ausstattungsAbzuegeByYear
    ][
      baujahrSpanne as keyof (typeof ausstattungsAbzuegeByYear)[typeof mietspiegelJahr]
    ];

  if (!ausstattungsAbzuege) {
    return {
      best: 0,
      worst: 0,
    };
  }

  const isChecked = (m: "Ja" | "Nein" | "Nicht sicher") => m == "Nein";
  const isMaybeOrChecked = (m: "Ja" | "Nein" | "Nicht sicher") =>
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

/**
 *  Calculates the lowest and highest applicable Preisspanne ('rent bracket') based on the provided answers.
 *
 * @param {FinalAnswers} answers - The answers object containing user input data.
 * @returns {{ lowest: Preisspanne; highest: Preisspanne  } | undefined} - The the highest and lowest Preisspanne, each represented as a tuple of three numbers (average value, lower threshold, upper threshold), or undefined if the calculation.
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
  const highestLowestAusstattungsAbzug = getWorstBestAusstattungsAbzug(
    answers,
    visibleQuestionAliases,
  );

  if (
    !mietspiegeljahr ||
    !baujahrSpanne ||
    !wohnlage ||
    !wohnflaecheSpanne ||
    !highestLowestAusstattungsAbzug
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
    highestLowestAusstattungsAbzug;

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
