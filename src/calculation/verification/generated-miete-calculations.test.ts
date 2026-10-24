import { describe, expect, test } from "vitest";

import { multiplyMoney } from "../money";
import {
  calcMerkmalsgruppenValueInEuro,
  getWorstBestOrtsueblicheVergleichsmiete,
} from "../ortsueblicheVergleichsmiete";
import { getWorstBestZulaessigeHoechstmiete } from "../zulaessigeHoechstmiete";
import { contextFor, mietspiegelReferences } from "./mietspiegel-fixtures";
import {
  referenceMonthlyHoechstmieteInCent,
  referenceVergleichsmietePerQmInCent,
} from "./reference-miete-calculation";
import examples from "./reference/mietspiegel-examples.json";

// Source-data tests cover every Tabellenfeld. Here, representative numeric
// spans from the published examples exercise all eleven distinct group balances.
for (const mietspiegel of mietspiegelReferences) {
  const example = examples.find(
    (e) => e.mietspiegeljahr === mietspiegel.mietspiegeljahr,
  )!;
  const row = mietspiegel.rows.find(
    (r) => r.tabellenfeld === example.tabellenfeld,
  )!;
  describe(`${mietspiegel.mietspiegeljahr}/${row.tabellenfeld}: Merkmalsgruppensaldo`, () => {
    test.each(Array.from({ length: 11 }, (_, i) => i - 5))(
      "saldo %s",
      (saldo) => {
        const merkmalsgruppen = Array.from({ length: 5 }, (_, i) =>
          i < Math.abs(saldo) ? Math.sign(saldo) : 0,
        );
        const ctx = contextFor(
          mietspiegel.mietspiegeljahr,
          row,
          merkmalsgruppen,
        );
        const vergleichsmieteInCent = referenceVergleichsmietePerQmInCent(
          row,
          merkmalsgruppen,
        );
        expect(getWorstBestOrtsueblicheVergleichsmiete(ctx)).toEqual({
          best: vergleichsmieteInCent / 100,
          worst: vergleichsmieteInCent / 100,
        });
        const baseWohnflaeche = Number(example.wohnflaeche);
        for (const wohnflaeche of [
          baseWohnflaeche,
          baseWohnflaeche + 0.5,
          baseWohnflaeche + 0.01,
        ]) {
          ctx.wohnflaeche = wohnflaeche;
          const expected =
            referenceMonthlyHoechstmieteInCent(
              vergleichsmieteInCent,
              String(wohnflaeche),
              true,
            ) / 100;
          expect(getWorstBestZulaessigeHoechstmiete(ctx)).toEqual({
            best: expected,
            worst: expected,
          });
        }
      },
    );
  });
}

// Asymmetric span [Mittelwert 5, Unterwert 3, Oberwert 9] makes using the
// wrong side's distance observable. Expected adjustments are fixed numbers.
test.each([
  {
    label: "positive direction uses Oberwert distance",
    einordnung: 0.4,
    sondermerkmal: 0,
    expected: 1.6,
  },
  {
    label: "negative direction uses Unterwert distance",
    einordnung: -0.4,
    sondermerkmal: 0,
    expected: -0.8,
  },
  {
    label: "upper clamp after Sondermerkmal",
    einordnung: 0.4,
    sondermerkmal: 3,
    expected: 1,
  },
  {
    label: "lower clamp after Sondermerkmal",
    einordnung: -1,
    sondermerkmal: -1,
    expected: -1,
  },
  {
    label: "above Oberwert suppresses positive adjustment",
    einordnung: 1,
    sondermerkmal: 5,
    expected: 0,
  },
  {
    label: "above Oberwert suppresses opposing adjustment",
    einordnung: -1,
    sondermerkmal: 5,
    expected: 0,
  },
  {
    label: "below Unterwert suppresses negative adjustment",
    einordnung: -1,
    sondermerkmal: -3,
    expected: 0,
  },
  {
    label: "below Unterwert suppresses opposing adjustment",
    einordnung: 1,
    sondermerkmal: -3,
    expected: 0,
  },
  {
    label: "exact Oberwert still permits inward adjustment",
    einordnung: -0.4,
    sondermerkmal: 4,
    expected: -0.8,
  },
  {
    label: "exact Unterwert still permits inward adjustment",
    einordnung: 0.4,
    sondermerkmal: -2,
    expected: 1.6,
  },
])("$label", ({ einordnung, sondermerkmal, expected }) => {
  expect(
    calcMerkmalsgruppenValueInEuro([5, 3, 9], einordnung, sondermerkmal),
  ).toBeCloseTo(expected, 12);
});

test("decimal half-cent monthly Hoechstmiete rounds up exactly once", () => {
  expect(multiplyMoney(5.1, 90.5, 1.1)).toBe(507.71);
  expect(referenceMonthlyHoechstmieteInCent(510, "90.5", true)).toBe(50771);
});
