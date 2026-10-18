import { describe, expect, test } from "vitest";

import { getWorstBestOrtsueblicheVergleichsmiete } from "../ortsueblicheVergleichsmiete";
import { getWorstBestZulaessigeHoechstmiete } from "../zulaessigeHoechstmiete";
import { contextFor, editions, groupCombinations } from "./fixtures";
import {
  referenceMonthlyCents,
  referencePerSqmCents,
} from "./reference-calculation";
import rules from "./reference/rules.json";

for (const edition of editions) {
  describe(`${edition.edition}: independent integer oracle`, () => {
    test.each(edition.rows.filter((row) => row.medianCents !== null))(
      "field $field: all 243 group outcomes, both calculation types",
      (row) => {
        for (const groups of groupCombinations) {
          const ctx = contextFor(edition.edition, row, groups);
          const cents = referencePerSqmCents(row, groups);
          const label = `${edition.edition}/${row.field} groups=${groups}`;
          expect(getWorstBestOrtsueblicheVergleichsmiete(ctx), label).toEqual({
            best: cents / 100,
            worst: cents / 100,
          });
          for (const typ of ["Miete", "Mieterhöhung"] as const) {
            ctx.typ = typ;
            const monthly =
              referenceMonthlyCents(
                cents,
                String(ctx.wohnflaeche),
                typ === "Miete",
              ) / 100;
            expect(
              getWorstBestZulaessigeHoechstmiete(ctx),
              `${label} ${typ}`,
            ).toEqual({ best: monthly, worst: monthly });
          }
        }
      },
    );
  });
}

describe("2015 special-feature interactions: both limits and opposing group directions", () => {
  const names = Object.keys(rules.specialFeatures2015.amountsCents);
  test.each(editions[0].rows.filter((row) => row.medianCents !== null))(
    "field $field: every special-feature subset and group balance",
    (row) => {
      for (let mask = 0; mask < 2 ** names.length; mask++) {
        const selected = names.filter((_, index) => mask & (1 << index));
        const specialCents = selected.reduce(
          (sum, name) =>
            sum +
            rules.specialFeatures2015.amountsCents[
              name as keyof typeof rules.specialFeatures2015.amountsCents
            ][rules.specialFeatures2015.periods.indexOf(row.period)],
          0,
        );
        for (let balance = -5; balance <= 5; balance++) {
          const groups = Array.from({ length: 5 }, (_, index) =>
            index < Math.abs(balance) ? Math.sign(balance) : 0,
          );
          const expected =
            referencePerSqmCents(row, groups, 0, specialCents) / 100;
          expect(
            getWorstBestOrtsueblicheVergleichsmiete(
              contextFor("2015", row, groups, selected),
            ),
            `${row.field} specials=${selected} balance=${balance}`,
          ).toEqual({ best: expected, worst: expected });
        }
      }
    },
  );
});

describe("fractional areas and decimal half-cent rounding", () => {
  for (const edition of editions) {
    test(`${edition.edition}: every populated field`, () => {
      for (const row of edition.rows.filter(
        (row) => row.medianCents !== null,
      )) {
        for (const area of [
          String(Math.max(20, row.minArea)),
          String(Math.max(20, row.minArea) + 0.5),
          String(Math.max(20, row.minArea) + 0.01),
        ]) {
          const ctx = contextFor(edition.edition, row);
          ctx.wohnflaeche = Number(area);
          const expected =
            referenceMonthlyCents(row.medianCents!, area, true) / 100;
          expect(
            getWorstBestZulaessigeHoechstmiete(ctx),
            `${row.field} ${area}m²`,
          ).toEqual({ best: expected, worst: expected });
        }
      }
    });
  }
});
