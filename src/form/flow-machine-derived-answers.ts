import type { AnswerData } from "flow-machine";

import type { LageInfoByJahr } from "~/components/AdresseForm/types";
import { parseAdresse } from "~/utils";

import { AnswerMachine, flowMachine } from "./flow-machine-runtime";
import { vertragsdatumToMietspiegelJahrMapping } from "./mappings/vertragsdatum";

export function buildVertragsdatum(answers: AnswerMachine) {
  const unterschrieben = answers.getWithOptionAlias("Unterschrieben");
  const vertragsdatum = answers.getWithOptionAlias("Vertragsdatum");

  if (unterschrieben == "Nein") {
    return ">2026";
  }

  return vertragsdatum;
}

export function buildLageInfo(answers: AnswerMachine) {
  const vertragsdatum = buildVertragsdatum(answers);

  const mietspieglJahr =
    vertragsdatum && vertragsdatumToMietspiegelJahrMapping[vertragsdatum];

  const addresse = answers.get(["Adresse"]);
  const lage =
    (addresse && typeof addresse == "string" && parseAdresse(addresse).lage) ||
    null;

  if (!mietspieglJahr || !lage) return null;

  const lageJahr: keyof LageInfoByJahr =
    mietspieglJahr in lage ? (mietspieglJahr as keyof LageInfoByJahr) : "2026";

  return lage[lageJahr] ?? null;
}

export function buildBaujahr(answers: AnswerMachine) {
  const baujahrSpanne = answers.getWithOptionAlias("Baujahr vor 1991");
  const baujahr = answers.getWithOptionAlias("Baujahr ab 1991");

  if (baujahrSpanne == "1991-") {
    return baujahr;
  }

  const constructionYearBoundaries = baujahrSpanne?.split("-");
  return constructionYearBoundaries?.[0] !== ""
    ? constructionYearBoundaries?.[0]
    : constructionYearBoundaries?.[1];
}

export function applyDerivedAnswers(state: AnswerData): AnswerData {
  const bareAnswers = flowMachine.answers(state);
  const vertragsdatum = buildVertragsdatum(bareAnswers);
  const lageInfo = buildLageInfo(bareAnswers);
  const baujahr = buildBaujahr(bareAnswers);

  const baujahrFromState = bareAnswers.get(["Baujahr"]);
  return {
    ...bareAnswers.state,
    Ost: lageInfo?.ost ?? bareAnswers.get(["Ost"]) ?? null,
    Wohnlage:
      lageInfo?.wohnlage ?? bareAnswers.getWithOptionAlias("Wohnlage") ?? null,
    Baujahr:
      (baujahr ? Number(baujahr) : null) ??
      (typeof baujahrFromState === "number" ? baujahrFromState : null),
    Vertragsdatum:
      vertragsdatum ?? bareAnswers.getWithOptionAlias("Vertragsdatum") ?? null,
  };
}
