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
    sammelheizung: "Ja" | "Nein";
    bad: "Ja" | "Nein";
  };
  merkmale: MerkmaleByGruppe;
  sondermerkmale: Record<string, MerkmalState>;
};
