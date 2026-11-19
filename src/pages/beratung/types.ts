import type { AusstattungState } from "~/calculation/types";
import { vertragsdatumToMietspiegelJahrMapping } from "~/form/mappings/vertragsdatum";
import { Wohnlage } from "~/mietspiegel/types";

export type MerkmalState = "checked" | "unchecked" | "maybe";

export type SubgroupKey = "Wohnwerterhoehend" | "Wohnwertmindernd";

export type MerkmaleByGruppe = Record<
  string,
  Record<SubgroupKey, Record<string, MerkmalState>>
>;

export type WorstBest = { worst: number; best: number };

export type BeratungRecord = {
  typ: "Miete" | "Mieterhöhung";
  vertragsdatum: keyof typeof vertragsdatumToMietspiegelJahrMapping;
  wohnflaeche: number;
  baujahrSpanne: string;
  wohnlage: Wohnlage;
  ausstattung: {
    sammelheizung: AusstattungState | null;
    bad: AusstattungState | null;
  };
  merkmale: MerkmaleByGruppe;
  sondermerkmale: Record<string, MerkmalState>;
};
