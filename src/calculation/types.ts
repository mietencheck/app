import {
  MerkmalGruppenStateList,
  SondermerkmalStateList,
} from "~/form/utils/mapMerkmalStateToMerkmalGruppen";
import { Mietspiegeljahr, Wohnlage } from "~/mietspiegel/types";

export type AusstattungState = "Ja" | "Nein" | "Nicht sicher";

/**
 * Domain inputs required by the calculation core.
 * A `CalculationContext` exists only when all required inputs are already
 * derived. During form fill-in, adapters may return `undefined` until the
 * answers are complete enough for calculation.
 */
export type CalculationContext = {
  typ: "Miete" | "Mieterhöhung";
  mietspiegeljahr: Mietspiegeljahr;
  baujahrSpanne: string;
  wohnlage: Wohnlage;
  wohnflaeche: number;
  wohnflaecheSpanne: string;
  ausstattung: { sammelheizung: AusstattungState; bad: AusstattungState };
  merkmale: MerkmalGruppenStateList;
  sondermerkmale?: SondermerkmalStateList;
};
