import { describe, expect, test } from "vitest";

import { getWorstBestAusstattungsAbzug } from "../ausstattungsAbzug";
import { getWorstBestOrtsueblicheVergleichsmiete } from "../ortsueblicheVergleichsmiete";
import { AusstattungState } from "../types";
import { contextFor, editions, groupNames } from "./fixtures";
import { referencePerSqmCents } from "./reference-calculation";
import rules from "./reference/rules.json";

const equipmentStates: AusstattungState[] = ["Ja", "Nein", "Nicht sicher"];

describe("equipment uncertainty resolves all reachable deductions", () => {
  for (const rule of rules.deductions.filter(
    (rule) => rule.bothMissingCents !== null,
  )) {
    test(`${rule.edition}/${rule.period}: all nine answer combinations`, () => {
      const row = editions
        .find((edition) => edition.edition === rule.edition)!
        .rows.find((row) => row.period === rule.period)!;
      for (const heating of equipmentStates) {
        for (const bathroom of equipmentStates) {
          const possibleDeductions: number[] = [];
          for (const h of ["Ja", "Nein"]) {
            for (const b of ["Ja", "Nein"]) {
              if (
                (heating !== "Nicht sicher" && heating !== h) ||
                (bathroom !== "Nicht sicher" && bathroom !== b)
              )
                continue;
              possibleDeductions.push(
                h === "Ja" && b === "Ja"
                  ? 0
                  : h === "Nein" && b === "Nein"
                    ? rule.bothMissingCents!
                    : rule.oneMissingCents,
              );
            }
          }
          const ctx = contextFor(rule.edition, row);
          ctx.ausstattung = { sammelheizung: heating, bad: bathroom };
          expect(
            getWorstBestAusstattungsAbzug(ctx),
            `${heating}/${bathroom}`,
          ).toEqual({
            best: Math.max(...possibleDeductions) / 100,
            worst: Math.min(...possibleDeductions) / 100,
          });
        }
      }
    });
  }
});

// Each scenario describes facts at the calculation-context boundary. Questionnaire
// correlations and exclusions are exercised separately by integration cases.
const scenarios = [
  { positive: "unchecked", negative: "unchecked" },
  { positive: "checked", negative: "unchecked" },
  { positive: "unchecked", negative: "checked" },
  { positive: "checked", negative: "checked" },
  { positive: "maybe", negative: "unchecked" },
  { positive: "unchecked", negative: "maybe" },
  { positive: "maybe", negative: "checked" },
  { positive: "checked", negative: "maybe" },
  { positive: "maybe", negative: "maybe" },
] as const;

for (const edition of editions) {
  test(`${edition.edition}: seeded uncertain groups match enumerated concrete resolutions`, () => {
    let seed = 17012026;
    const next = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0);
    const rows = edition.rows.filter((row) => row.medianCents !== null);
    for (let sample = 0; sample < 64; sample++) {
      const row = rows[next() % rows.length];
      const ctx = contextFor(edition.edition, row);
      let resolvedBalances: number[][] = [[]];
      for (const group of groupNames) {
        const scenario = scenarios[next() % scenarios.length];
        ctx.merkmale[group] = {
          Wohnwerterhoehend: { positive: scenario.positive },
          Wohnwertmindernd: { negative: scenario.negative },
        } as (typeof ctx.merkmale)[typeof group];
        const balances: number[] = [];
        for (const p of [0, 1]) {
          for (const n of [0, 1]) {
            if (
              scenario.positive !== "maybe" &&
              p !== Number(scenario.positive === "checked")
            )
              continue;
            if (
              scenario.negative !== "maybe" &&
              n !== Number(scenario.negative === "checked")
            )
              continue;
            balances.push(p - n);
          }
        }
        resolvedBalances = resolvedBalances.flatMap((previous) =>
          balances.map((balance) => [...previous, balance]),
        );
      }
      const values = resolvedBalances.map((groups) =>
        referencePerSqmCents(row, groups),
      );
      expect(
        getWorstBestOrtsueblicheVergleichsmiete(ctx),
        `seed=17012026 sample=${sample} field=${row.field}`,
      ).toEqual({
        best: Math.min(...values) / 100,
        worst: Math.max(...values) / 100,
      });
    }
  });
}
