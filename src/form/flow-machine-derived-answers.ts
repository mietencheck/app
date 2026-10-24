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

  if (!(mietspieglJahr in lage)) return null;

  return lage[mietspieglJahr as keyof LageInfoByJahr] ?? null;
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
  const hasAddress = Boolean(bareAnswers.get(["Adresse"]));

  const baujahrFromState = bareAnswers.get(["Baujahr"]);
  return {
    ...bareAnswers.state,
    // An address with no classification for the selected edition must not
    // retain derived location fields from an earlier address/edition. Explicit
    // fields remain supported for API clients that submit no address at all.
    Ost:
      lageInfo?.ost ?? (hasAddress ? null : (bareAnswers.get(["Ost"]) ?? null)),
    Wohnlage:
      lageInfo?.wohnlage ??
      (hasAddress
        ? null
        : (bareAnswers.getWithOptionAlias("Wohnlage") ?? null)),
    Baujahr:
      (baujahr ? Number(baujahr) : null) ??
      (typeof baujahrFromState === "number" ? baujahrFromState : null),
    Vertragsdatum:
      vertragsdatum ?? bareAnswers.getWithOptionAlias("Vertragsdatum") ?? null,
  };
}
