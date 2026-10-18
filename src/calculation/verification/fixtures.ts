import { MerkmalGruppenStateList } from "~/form/utils/mapMerkmalStateToMerkmalGruppen";
import { Mietspiegeljahr, Sondermerkmal, Wohnlage } from "~/mietspiegel/types";

import { CalculationContext } from "../types";
import { ReferenceRow } from "./reference-calculation";
import data2015 from "./reference/2015.json";
import data2017 from "./reference/2017.json";
import data2019 from "./reference/2019.json";
import data2021 from "./reference/2021.json";
import data2023 from "./reference/2023.json";
import data2024 from "./reference/2024.json";
import data2026 from "./reference/2026.json";

export const mietspiegelReferences = [
  data2015,
  data2017,
  data2019,
  data2021,
  data2023,
  data2024,
  data2026,
];
export const merkmalsgruppenNames = [
  "Bad",
  "Küche",
  "Wohnung",
  "Gebäude",
  "Umfeld",
] as const;

export function wohnflaechenSpannenKey(row: ReferenceRow): string {
  return `${row.minWohnflaeche || ""}-${row.maxWohnflaecheExclusive ?? ""}` ===
    "-"
    ? "0-"
    : `${row.minWohnflaeche || ""}-${row.maxWohnflaecheExclusive ?? ""}`;
}

/** Synthetic Merkmalsgruppe representatives isolate arithmetic from questionnaire mapping. */
export function contextFor(
  mietspiegeljahr: string,
  row: ReferenceRow,
  merkmalsgruppen: readonly number[] = [0, 0, 0, 0, 0],
  sondermerkmale: string[] = [],
): CalculationContext {
  const merkmale = Object.fromEntries(
    merkmalsgruppenNames.map((merkmalsgruppe, i) => [
      merkmalsgruppe,
      {
        Wohnwerterhoehend:
          merkmalsgruppen[i] > 0 ? { wohnwerterhoehend: "checked" } : {},
        Wohnwertmindernd:
          merkmalsgruppen[i] < 0 ? { wohnwertmindernd: "checked" } : {},
      },
    ]),
  ) as MerkmalGruppenStateList;
  return {
    typ: "Miete",
    mietspiegeljahr: mietspiegeljahr as Mietspiegeljahr,
    baujahrSpanne: row.baujahrSpanne,
    wohnlage: row.wohnlage as Wohnlage,
    wohnflaeche: Math.max(row.minWohnflaeche, 20),
    wohnflaecheSpanne: wohnflaechenSpannenKey(row),
    ausstattung: { sammelheizung: "Ja", bad: "Ja" },
    merkmale,
    sondermerkmale: Object.fromEntries(
      sondermerkmale.map((name) => [name, "checked"]),
    ) as Record<Sondermerkmal, "checked">,
  };
}

export const merkmalsgruppenCombinations = Array.from(
  { length: 243 },
  (_, index) =>
    merkmalsgruppenNames.map(
      (_, position) => (Math.floor(index / 3 ** position) % 3) - 1,
    ),
);
