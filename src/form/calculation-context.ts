import { CalculationContext } from "~/calculation/types";

import {
  getAusstattung,
  getBaujahrSpanne,
  getMerkmalStatesByGruppe,
  getMietspiegeljahr,
  getSondermerkmalStates,
  getTyp,
  getWohnflaeche,
  getWohnflaecheSpanne,
  getWohnlage,
} from "./api";
import { FinalAnswers } from "./flow-machine";

/**
 * Maps form answers (`FinalAnswers`) to the domain `CalculationContext` consumed
 * by `src/calculation/*`. Returns `undefined` while answers are incomplete.
 */
export function answersToCalculationContext(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): CalculationContext | undefined {
  const typ = getTyp(answers, visibleQuestionAliases) as
    | "Miete"
    | "Mieterhöhung"
    | undefined;
  const mietspiegeljahr = getMietspiegeljahr(answers);
  const baujahrSpanne = getBaujahrSpanne(answers, visibleQuestionAliases);
  const wohnlage = getWohnlage(answers, visibleQuestionAliases);
  const wohnflaeche = getWohnflaeche(answers, visibleQuestionAliases);
  const wohnflaecheSpanne = getWohnflaecheSpanne(
    answers,
    visibleQuestionAliases,
  );
  const ausstattung = getAusstattung(answers, visibleQuestionAliases);
  const merkmale = getMerkmalStatesByGruppe(answers, visibleQuestionAliases);
  const sondermerkmale = getSondermerkmalStates(
    answers,
    visibleQuestionAliases,
  );

  if (
    !typ ||
    !mietspiegeljahr ||
    !baujahrSpanne ||
    !wohnlage ||
    wohnflaeche === undefined ||
    Number.isNaN(wohnflaeche) ||
    !wohnflaecheSpanne
  ) {
    return undefined;
  }

  return {
    typ,
    mietspiegeljahr,
    baujahrSpanne,
    wohnlage,
    wohnflaeche,
    wohnflaecheSpanne,
    ausstattung,
    merkmale,
    sondermerkmale,
  };
}
