import {
  getAusstattung,
  getBaujahrSpanne,
  getMerkmalStatesByGruppe,
  getSondermerkmalStates,
  getWohnflaeche,
  getWohnlage,
} from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";
import { evaluateFlowMachine } from "~/form/flow-machine-evaluation";
import { VERTRAGSDATUM_KEYS } from "~/form/mappings/vertragsdatum";
import type { BeratungRecord, MerkmaleByGruppe } from "~/pages/beratung/types";

/**
 * Turns flow-machine answers into the {@link BeratungRecord} we
 * persist and send with `POST /mieten-flow`.
 */
export function evaluationAnswersToBeratungRecord(
  evaluationAnswers: Record<string, unknown>,
): { record: BeratungRecord } | null {
  const evaluation = evaluateFlowMachine(evaluationAnswers);
  const answers = evaluation.answers as FinalAnswers;
  const visible = new Set(evaluation.visibleQuestionAliases);

  const vd = answers["Vertragsdatum"];
  if (typeof vd !== "string" || !VERTRAGSDATUM_KEYS.has(vd)) {
    return null;
  }

  const baujahrSpanne = getBaujahrSpanne(answers, visible);
  const wohnlage = getWohnlage(answers, visible);
  const wohnflaeche = getWohnflaeche(answers, visible);

  if (
    !baujahrSpanne ||
    !wohnlage ||
    wohnflaeche === undefined ||
    Number.isNaN(wohnflaeche)
  ) {
    return null;
  }

  const rawAus = getAusstattung(answers, visible);
  const ausstattung = {
    sammelheizung: (rawAus.sammelheizung === "Ja" ? "Ja" : "Nein") as
      | "Ja"
      | "Nein",
    bad: (rawAus.bad === "Ja" ? "Ja" : "Nein") as "Ja" | "Nein",
  };
  const merkmale = getMerkmalStatesByGruppe(
    answers,
    visible,
  ) as unknown as MerkmaleByGruppe;
  const sonderRaw = getSondermerkmalStates(answers, visible);

  const record: BeratungRecord = {
    typ: "Miete",
    vertragsdatum: vd as BeratungRecord["vertragsdatum"],
    wohnflaeche,
    baujahrSpanne,
    wohnlage,
    ausstattung,
    merkmale,
    sondermerkmale: (sonderRaw ?? {}) as BeratungRecord["sondermerkmale"],
  };

  return { record };
}
