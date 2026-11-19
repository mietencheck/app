import {
  getAusstattungAnswers,
  getBaujahrSpanne,
  getMerkmalStatesByGruppe,
  getSondermerkmalStates,
  getWohnflaeche,
  getWohnlage,
} from "~/form/api";
import { evaluateFlowMachine } from "~/form/flow-machine-evaluation";
import type { FinalAnswers } from "~/form/flow-machine-runtime";
import { VERTRAGSDATUM_KEYS } from "~/form/mappings/vertragsdatum";
import type { BeratungRecord, MerkmaleByGruppe } from "~/pages/beratung/types";

/**
 * Turns flow-machine answers into the {@link BeratungRecord} we
 * persist and send with `POST /mieten-flow`.
 */
export function answersToBeratungRecord(
  storedAnswers: Record<string, unknown>,
): BeratungRecord | null {
  const evaluation = evaluateFlowMachine(storedAnswers);
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

  const merkmale = getMerkmalStatesByGruppe(
    answers,
    visible,
  ) as unknown as MerkmaleByGruppe;
  const sonderRaw = getSondermerkmalStates(answers, visible);

  return {
    typ: "Miete",
    vertragsdatum: vd as BeratungRecord["vertragsdatum"],
    wohnflaeche,
    baujahrSpanne,
    wohnlage,
    ausstattung: getAusstattungAnswers(answers, visible),
    merkmale,
    sondermerkmale: (sonderRaw ?? {}) as BeratungRecord["sondermerkmale"],
  };
}
