import { describe, expect, test } from "vitest";

import { getWorstBestAusstattungsAbzug } from "../ausstattungsAbzug";
import { getWorstBestOrtsueblicheVergleichsmiete } from "../ortsueblicheVergleichsmiete";
import { AusstattungState } from "../types";
import {
  contextFor,
  merkmalsgruppenNames,
  mietspiegelReferences,
} from "./fixtures";
import { referenceVergleichsmietePerQmInCent } from "./reference-calculation";
import rules from "./reference/rules.json";

const ausstattungsStates: AusstattungState[] = ["Ja", "Nein", "Nicht sicher"];

describe("Ausstattung uncertainty resolves all reachable Ausstattungsabzüge", () => {
  for (const rule of rules.ausstattungsAbzuege.filter(
    (rule) => rule.ausstattungsAbzugWithoutSammelheizungAndBadInCent !== null,
  )) {
    test(`${rule.mietspiegeljahr}/${rule.baujahrSpanne}: all nine answer combinations`, () => {
      const row = mietspiegelReferences
        .find(
          (mietspiegel) => mietspiegel.mietspiegeljahr === rule.mietspiegeljahr,
        )!
        .rows.find((row) => row.baujahrSpanne === rule.baujahrSpanne)!;
      for (const sammelheizung of ausstattungsStates) {
        for (const bad of ausstattungsStates) {
          const possibleAusstattungsAbzuege: number[] = [];
          for (const h of ["Ja", "Nein"]) {
            for (const b of ["Ja", "Nein"]) {
              if (
                (sammelheizung !== "Nicht sicher" && sammelheizung !== h) ||
                (bad !== "Nicht sicher" && bad !== b)
              )
                continue;
              possibleAusstattungsAbzuege.push(
                h === "Ja" && b === "Ja"
                  ? 0
                  : h === "Nein" && b === "Nein"
                    ? rule.ausstattungsAbzugWithoutSammelheizungAndBadInCent!
                    : rule.ausstattungsAbzugForOneMissingMerkmalInCent,
              );
            }
          }
          const ctx = contextFor(rule.mietspiegeljahr, row);
          ctx.ausstattung = { sammelheizung, bad };
          expect(
            getWorstBestAusstattungsAbzug(ctx),
            `${sammelheizung}/${bad}`,
          ).toEqual({
            best: Math.max(...possibleAusstattungsAbzuege) / 100,
            worst: Math.min(...possibleAusstattungsAbzuege) / 100,
          });
        }
      }
    });
  }
});

// Each scenario describes facts at the calculation-context boundary. Questionnaire
// correlations and exclusions are exercised separately by integration cases.
const scenarios = [
  { wohnwerterhoehend: "unchecked", wohnwertmindernd: "unchecked" },
  { wohnwerterhoehend: "checked", wohnwertmindernd: "unchecked" },
  { wohnwerterhoehend: "unchecked", wohnwertmindernd: "checked" },
  { wohnwerterhoehend: "checked", wohnwertmindernd: "checked" },
  { wohnwerterhoehend: "maybe", wohnwertmindernd: "unchecked" },
  { wohnwerterhoehend: "unchecked", wohnwertmindernd: "maybe" },
  { wohnwerterhoehend: "maybe", wohnwertmindernd: "checked" },
  { wohnwerterhoehend: "checked", wohnwertmindernd: "maybe" },
  { wohnwerterhoehend: "maybe", wohnwertmindernd: "maybe" },
] as const;

for (const mietspiegel of mietspiegelReferences) {
  test(`${mietspiegel.mietspiegeljahr}: seeded uncertain Merkmalsgruppen match enumerated concrete resolutions`, () => {
    let seed = 17012026;
    const next = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0);
    const rows = mietspiegel.rows.filter(
      (row) => row.mittelwertInCent !== null,
    );
    for (let sample = 0; sample < 64; sample++) {
      const row = rows[next() % rows.length];
      const ctx = contextFor(mietspiegel.mietspiegeljahr, row);
      let resolvedMerkmalsgruppenSalden: number[][] = [[]];
      for (const merkmalsgruppe of merkmalsgruppenNames) {
        const scenario = scenarios[next() % scenarios.length];
        ctx.merkmale[merkmalsgruppe] = {
          Wohnwerterhoehend: { wohnwerterhoehend: scenario.wohnwerterhoehend },
          Wohnwertmindernd: { wohnwertmindernd: scenario.wohnwertmindernd },
        } as (typeof ctx.merkmale)[typeof merkmalsgruppe];
        const merkmalsgruppenSalden: number[] = [];
        for (const p of [0, 1]) {
          for (const n of [0, 1]) {
            if (
              scenario.wohnwerterhoehend !== "maybe" &&
              p !== Number(scenario.wohnwerterhoehend === "checked")
            )
              continue;
            if (
              scenario.wohnwertmindernd !== "maybe" &&
              n !== Number(scenario.wohnwertmindernd === "checked")
            )
              continue;
            merkmalsgruppenSalden.push(p - n);
          }
        }
        resolvedMerkmalsgruppenSalden = resolvedMerkmalsgruppenSalden.flatMap(
          (previous) =>
            merkmalsgruppenSalden.map((merkmalsgruppenSaldo) => [
              ...previous,
              merkmalsgruppenSaldo,
            ]),
        );
      }
      const values = resolvedMerkmalsgruppenSalden.map((merkmalsgruppen) =>
        referenceVergleichsmietePerQmInCent(row, merkmalsgruppen),
      );
      expect(
        getWorstBestOrtsueblicheVergleichsmiete(ctx),
        `seed=17012026 sample=${sample} tabellenfeld=${row.tabellenfeld}`,
      ).toEqual({
        best: Math.min(...values) / 100,
        worst: Math.max(...values) / 100,
      });
    }
  });
}
