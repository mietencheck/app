import { describe, expect, test } from "vitest";

import { getWorstBestAusstattungsAbzug } from "../ausstattungsAbzug";
import { getWorstBestOrtsueblicheVergleichsmiete } from "../ortsueblicheVergleichsmiete";
import { AusstattungState } from "../types";
import {
  contextFor,
  merkmalsgruppenNames,
  mietspiegelReferences,
} from "./mietspiegel-fixtures";
import { referenceVergleichsmietePerQmInCent } from "./reference-miete-calculation";
import rules from "./reference/mietspiegel-rules.json";

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

test.each([
  {
    label: "one uncertain wohnwerterhöhendes Merkmal",
    wohnwerterhoehend: "maybe",
    wohnwertmindernd: "unchecked",
    best: 7.3,
    worst: 7.75,
  },
  {
    label: "opposing uncertain Merkmale can resolve in either direction",
    wohnwerterhoehend: "maybe",
    wohnwertmindernd: "maybe",
    best: 7.02,
    worst: 7.75,
  },
  {
    label: "uncertain negative can cancel a confirmed positive",
    wohnwerterhoehend: "checked",
    wohnwertmindernd: "maybe",
    best: 7.3,
    worst: 7.75,
  },
  {
    label: "uncertain positive can cancel a confirmed negative",
    wohnwerterhoehend: "maybe",
    wohnwertmindernd: "checked",
    best: 7.02,
    worst: 7.3,
  },
] as const)(
  "$label",
  ({ wohnwerterhoehend, wohnwertmindernd, best, worst }) => {
    const row = mietspiegelReferences
      .find((m) => m.mietspiegeljahr === "2026")!
      .rows.find((r) => r.tabellenfeld === "81")!;
    const ctx = contextFor("2026", row);
    ctx.merkmale.Bad = {
      Wohnwerterhoehend: { testMerkmal: wohnwerterhoehend },
      Wohnwertmindernd: { testMerkmal: wohnwertmindernd },
    } as typeof ctx.merkmale.Bad;
    expect(getWorstBestOrtsueblicheVergleichsmiete(ctx)).toEqual({
      best,
      worst,
    });
  },
);

test("2017: an uncertain Bad can reduce the Ausstattungsabzug despite missing Sammelheizung", () => {
  const row = mietspiegelReferences
    .find((m) => m.mietspiegeljahr === "2017")!
    .rows.find((r) => r.baujahrSpanne === "-1918")!;
  const ctx = contextFor("2017", row);
  ctx.ausstattung = { sammelheizung: "Nein", bad: "Nicht sicher" };
  expect(getWorstBestAusstattungsAbzug(ctx)).toEqual({
    best: 1.34,
    worst: 0.87,
  });
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

// Nine explicit state patterns, rotated across five Merkmalsgruppen, cover
// mixed resolutions without a random generator or a sweep of every table row.
for (const mietspiegel of mietspiegelReferences.filter((m) =>
  ["2015", "2017", "2026"].includes(m.mietspiegeljahr),
)) {
  test(`${mietspiegel.mietspiegeljahr}: mixed uncertain Merkmalsgruppen match concrete resolutions`, () => {
    const rows = mietspiegel.rows.filter(
      (row) => row.mittelwertInCent !== null,
    );
    for (let sample = 0; sample < scenarios.length; sample++) {
      const row = rows[sample];
      const ctx = contextFor(mietspiegel.mietspiegeljahr, row);
      let resolvedSalden: number[][] = [[]];
      const resolve = (state: string) =>
        state === "maybe" ? [0, 1] : [Number(state === "checked")];
      for (const [index, merkmalsgruppe] of merkmalsgruppenNames.entries()) {
        const scenario = scenarios[(sample + index) % scenarios.length];
        ctx.merkmale[merkmalsgruppe] = {
          Wohnwerterhoehend: { testMerkmal: scenario.wohnwerterhoehend },
          Wohnwertmindernd: { testMerkmal: scenario.wohnwertmindernd },
        } as (typeof ctx.merkmale)[typeof merkmalsgruppe];
        const salden = resolve(scenario.wohnwerterhoehend).flatMap((p) =>
          resolve(scenario.wohnwertmindernd).map((n) => p - n),
        );
        resolvedSalden = resolvedSalden.flatMap((previous) =>
          salden.map((saldo) => [...previous, saldo]),
        );
      }
      const values = resolvedSalden.map((salden) =>
        referenceVergleichsmietePerQmInCent(row, salden),
      );
      expect(
        getWorstBestOrtsueblicheVergleichsmiete(ctx),
        `${row.tabellenfeld}: ${JSON.stringify(ctx.merkmale)}`,
      ).toEqual({
        best: Math.min(...values) / 100,
        worst: Math.max(...values) / 100,
      });
    }
  });
}
