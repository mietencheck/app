import { VERTRAGSDATUM_KEYS } from "~/form/mappings/vertragsdatum";

import type { BeratungRecord, MerkmaleByGruppe } from "./types";

const WOHNLAGE_VALUES = new Set(["einfach", "mittel", "gut"]);

/**
 * Parses API `flowData` when it is a persisted {@link BeratungRecord} (JSON).
 * Beratung does not run the questionnaire / flow machine — only this shape.
 */
export function parseStoredFlowDataAsBeratungRecord(
  flowData: Record<string, unknown>,
): BeratungRecord | null {
  if (
    typeof flowData.vertragsdatum !== "string" ||
    !VERTRAGSDATUM_KEYS.has(flowData.vertragsdatum)
  ) {
    return null;
  }
  if (
    typeof flowData.wohnflaeche !== "number" ||
    Number.isNaN(flowData.wohnflaeche)
  ) {
    return null;
  }
  if (
    typeof flowData.baujahrSpanne !== "string" ||
    flowData.baujahrSpanne.length === 0
  ) {
    return null;
  }
  if (
    typeof flowData.wohnlage !== "string" ||
    !WOHNLAGE_VALUES.has(flowData.wohnlage)
  ) {
    return null;
  }
  const aus = flowData.ausstattung;
  if (!aus || typeof aus !== "object") return null;
  const ac = aus as Record<string, unknown>;
  if (ac.sammelheizung !== "Ja" && ac.sammelheizung !== "Nein") {
    return null;
  }
  if (ac.bad !== "Ja" && ac.bad !== "Nein") return null;
  if (!flowData.merkmale || typeof flowData.merkmale !== "object") {
    return null;
  }
  const sonder = flowData.sondermerkmale;
  if (sonder != null && typeof sonder !== "object") return null;

  return {
    typ: "Miete",
    vertragsdatum: flowData.vertragsdatum as BeratungRecord["vertragsdatum"],
    wohnflaeche: flowData.wohnflaeche,
    baujahrSpanne: flowData.baujahrSpanne,
    wohnlage: flowData.wohnlage as BeratungRecord["wohnlage"],
    ausstattung: {
      sammelheizung: ac.sammelheizung as "Ja" | "Nein",
      bad: ac.bad as "Ja" | "Nein",
    },
    merkmale: flowData.merkmale as MerkmaleByGruppe,
    sondermerkmale: (sonder ?? {}) as BeratungRecord["sondermerkmale"],
  };
}
