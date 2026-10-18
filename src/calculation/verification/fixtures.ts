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

export const editions = [
  data2015,
  data2017,
  data2019,
  data2021,
  data2023,
  data2024,
  data2026,
];
export const groupNames = [
  "Bad",
  "Küche",
  "Wohnung",
  "Gebäude",
  "Umfeld",
] as const;

export function areaKey(row: ReferenceRow): string {
  return `${row.minArea || ""}-${row.maxArea ?? ""}` === "-"
    ? "0-"
    : `${row.minArea || ""}-${row.maxArea ?? ""}`;
}

/** Synthetic group representatives isolate arithmetic from questionnaire mapping. */
export function contextFor(
  edition: string,
  row: ReferenceRow,
  groups: readonly number[] = [0, 0, 0, 0, 0],
  specialFeatures: string[] = [],
): CalculationContext {
  const merkmale = Object.fromEntries(
    groupNames.map((group, i) => [
      group,
      {
        Wohnwerterhoehend: groups[i] > 0 ? { positive: "checked" } : {},
        Wohnwertmindernd: groups[i] < 0 ? { negative: "checked" } : {},
      },
    ]),
  ) as MerkmalGruppenStateList;
  return {
    typ: "Miete",
    mietspiegeljahr: edition as Mietspiegeljahr,
    baujahrSpanne: row.period,
    wohnlage: row.location as Wohnlage,
    wohnflaeche: Math.max(row.minArea, 20),
    wohnflaecheSpanne: areaKey(row),
    ausstattung: { sammelheizung: "Ja", bad: "Ja" },
    merkmale,
    sondermerkmale: Object.fromEntries(
      specialFeatures.map((name) => [name, "checked"]),
    ) as Record<Sondermerkmal, "checked">,
  };
}

export const groupCombinations = Array.from({ length: 243 }, (_, index) =>
  groupNames.map((_, position) => (Math.floor(index / 3 ** position) % 3) - 1),
);
