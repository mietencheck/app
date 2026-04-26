import { CalculationContext } from "~/calculation/types";
import { vertragsdatumToMietspiegelJahrMapping } from "~/form/mappings/vertragsdatum";
import {
  MerkmalGruppenStateList,
  SondermerkmalStateList,
} from "~/form/utils/mapMerkmalStateToMerkmalGruppen";
import { preisspannenByMietspiegeljahr } from "~/mietspiegel/preisspannen";
import { sondermerkmaleModifierByMietspiegeljahr } from "~/mietspiegel/sondermerkmale";
import { Mietspiegeljahr, Wohnlage } from "~/mietspiegel/types";
import {
  getSelectedWohnflaecheSpanne,
  getWohnflaecheSpanneOptions,
} from "~/utils/wohnflaecheSpanne";

import { BeratungRecord, MerkmaleByGruppe } from "./types";

export {
  getSelectedWohnflaecheSpanne,
  getWohnflaecheSpanneOptions,
} from "~/utils/wohnflaecheSpanne";

export const vertragsdatumOptions = Object.entries(
  vertragsdatumToMietspiegelJahrMapping,
)
  .filter(([, mietspiegeljahr]) => mietspiegeljahr !== undefined)
  .map(([vertragsdatum]) => vertragsdatum) as BeratungRecord["vertragsdatum"][];

export const wohnlageOptions: { value: Wohnlage; label: string }[] = [
  { value: "einfach", label: "Einfach" },
  { value: "mittel", label: "Mittel" },
  { value: "gut", label: "Gut" },
];

export function getMietspiegeljahrFromVertragsdatum(
  vertragsdatum: BeratungRecord["vertragsdatum"],
): Mietspiegeljahr {
  return vertragsdatumToMietspiegelJahrMapping[vertragsdatum] ?? "2024";
}

export function getBaujahrSpanneOptions(mietspiegeljahr?: Mietspiegeljahr) {
  if (!mietspiegeljahr) return [];
  return Object.keys(preisspannenByMietspiegeljahr[mietspiegeljahr]);
}

export function getSondermerkmalOptions(mietspiegeljahr?: Mietspiegeljahr) {
  if (!mietspiegeljahr) return [];
  const modifierByYear = sondermerkmaleModifierByMietspiegeljahr as Partial<
    Record<Mietspiegeljahr, Record<string, unknown>>
  >;
  return Object.keys(modifierByYear[mietspiegeljahr] ?? {});
}

/**
 * Maps a `BeratungRecord` plus the user-edited `merkmale` UI state to
 * the domain `CalculationContext` consumed by `src/calculation/*`. Beratung
 * always evaluates a "Miete" check.
 */
export function recordToCalculationContext(
  record: BeratungRecord,
  merkmale: MerkmaleByGruppe,
): CalculationContext | undefined {
  const mietspiegeljahr = getMietspiegeljahrFromVertragsdatum(
    record.vertragsdatum,
  );
  const wohnflaecheSpanneOptions = getWohnflaecheSpanneOptions(
    mietspiegeljahr,
    record.baujahrSpanne,
    record.wohnlage,
  );
  const wohnflaecheSpanne = getSelectedWohnflaecheSpanne(
    record.wohnflaeche,
    wohnflaecheSpanneOptions,
  );
  if (!wohnflaecheSpanne) {
    return undefined;
  }

  return {
    typ: "Miete",
    mietspiegeljahr,
    baujahrSpanne: record.baujahrSpanne,
    wohnlage: record.wohnlage,
    wohnflaeche: record.wohnflaeche,
    wohnflaecheSpanne,
    ausstattung: {
      sammelheizung: record.ausstattung.sammelheizung,
      bad: record.ausstattung.bad,
    },
    merkmale: merkmale as unknown as MerkmalGruppenStateList,
    sondermerkmale: record.sondermerkmale as unknown as SondermerkmalStateList,
  };
}
