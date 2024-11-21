import {
  getAusstattung,
  getBaujahrSpanne,
  getMietspiegelJahr,
  getWohnflaecheSpanne,
  getWohnlage,
} from "~/2024/form/api";
import {
  ausstattungsAbzuegeByYear,
  mietspiegeltabelleByJahr,
  Preisspanne,
} from "~/2024/mietspiegel/mietspiegeltabelle";
import { FinalAnswers } from "~/form/flow-machine";

/**
 * Calculates the lowest and highest possible facility discounts ('Ausstattungsabzug').
 *
 * @param {FinalAnswers} answers - The answers object containing user input data.
 * @returns  {{ highestDiscount: number; lowestDiscount: number } | undefined} - The lowest and highest discounts in Euro, or undefined if the calculation cannot be performed.
 */
export function getLowestHighestAusstattungsAbzug(
  answers: FinalAnswers,
): { highestDiscount: number; lowestDiscount: number } | undefined {
  const mietspiegelJahr = getMietspiegelJahr(answers);
  const baujahrSpanne = getBaujahrSpanne(answers);
  const ausstattung = getAusstattung(answers);

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
      highestDiscount: 0,
      lowestDiscount: 0,
    };
  }

  const isChecked = (m: "Ja" | "Nein" | "Nicht sicher") => m == "Ja";
  const isMaybeOrChecked = (m: "Ja" | "Nein" | "Nicht sicher") =>
    m == "Ja" || m == "Nicht sicher";

  const highestDiscount =
    isMaybeOrChecked(ausstattung.sammelheizung) &&
    isMaybeOrChecked(ausstattung.bad)
      ? ausstattungsAbzuege["!SH && !Bad"]
      : isMaybeOrChecked(ausstattung.sammelheizung) ||
          isMaybeOrChecked(ausstattung.bad)
        ? ausstattungsAbzuege["!SH || !Bad"]
        : 0;
  const lowestDiscount =
    isChecked(ausstattung.sammelheizung) && isChecked(ausstattung.bad)
      ? ausstattungsAbzuege["!SH && !Bad"]
      : isChecked(ausstattung.sammelheizung) || isChecked(ausstattung.bad)
        ? ausstattungsAbzuege["!SH || !Bad"]
        : 0;

  return {
    highestDiscount: highestDiscount,
    lowestDiscount: lowestDiscount,
  };
}

/**
 *  Calculates the lowest and highest applicable bracket from rent index based on the provided answers.
 *
 * @param {FinalAnswers} answers - The answers object containing user input data.
 * @returns {{ lowest: Mietspiegeltabelle; highest: Mietspiegeltabelle  } | undefined} - The the highest and lowest rent bracket, each represented as a tuple of three numbers (average value, lower threshold, upper threshold), or undefined if the calculation.
 */
export function getLowestHighestPreisspanne(
  answers: FinalAnswers,
): { lowest: Preisspanne; highest: Preisspanne } | undefined {
  const mietspiegelJahr = getMietspiegelJahr(answers);
  const baujahrSpanne = getBaujahrSpanne(answers);
  const wohnflaecheSpanne = getWohnflaecheSpanne(answers);
  const wohnlage = getWohnlage(answers);
  const highestLowestAusstattungsAbzug =
    getLowestHighestAusstattungsAbzug(answers);

  if (
    !mietspiegelJahr ||
    !baujahrSpanne ||
    !wohnlage ||
    !wohnflaecheSpanne ||
    !highestLowestAusstattungsAbzug
  ) {
    return undefined;
  }

  // No idea if there's a better way to do this, TS is a mystery to me
  const mietspiegeltabelle =
    mietspiegeltabelleByJahr[
      mietspiegelJahr as keyof typeof mietspiegeltabelleByJahr
    ];
  const mietspiegeltabelleForBaujahrSpanne =
    mietspiegeltabelle[
      baujahrSpanne as keyof (typeof mietspiegeltabelleByJahr)[typeof mietspiegelJahr]
    ];
  const mietspiegeltabelleForWohnlage =
    mietspiegeltabelleForBaujahrSpanne[wohnlage];
  const mietspiegeltabelleForWohnflaeche =
    mietspiegeltabelleForWohnlage[
      wohnflaecheSpanne as keyof typeof mietspiegeltabelleForWohnlage
    ];

  const preisspanne = mietspiegeltabelleForWohnflaeche;
  if (!preisspanne) {
    return undefined;
  }

  const { highestDiscount, lowestDiscount } = highestLowestAusstattungsAbzug;
  return {
    lowest: [
      Math.round((preisspanne[0] - highestDiscount) * 100) / 100,
      Math.round((preisspanne[1] - highestDiscount) * 100) / 100,
      Math.round((preisspanne[2] - highestDiscount) * 100) / 100,
    ],
    highest: [
      Math.round((preisspanne[0] - lowestDiscount) * 100) / 100,
      Math.round((preisspanne[1] - lowestDiscount) * 100) / 100,
      Math.round((preisspanne[2] - lowestDiscount) * 100) / 100,
    ],
  };
}
