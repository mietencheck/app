import { describe, expect, test } from "vitest";

import { getWorstBestOrtsueblicheVergleichsmiete } from "../ortsueblicheVergleichsmiete";
import { getWorstBestZulaessigeHoechstmiete } from "../zulaessigeHoechstmiete";
import {
  contextFor,
  merkmalsgruppenCombinations,
  mietspiegelReferences,
} from "./fixtures";
import {
  referenceMonthlyHoechstmieteInCent,
  referenceVergleichsmietePerQmInCent,
} from "./reference-calculation";
import rules from "./reference/rules.json";

for (const mietspiegel of mietspiegelReferences) {
  describe(`${mietspiegel.mietspiegeljahr}: independent integer oracle`, () => {
    test.each(mietspiegel.rows.filter((row) => row.mittelwertInCent !== null))(
      "Tabellenfeld $tabellenfeld: all 243 Merkmalsgruppe outcomes, both calculation types",
      (row) => {
        for (const merkmalsgruppen of merkmalsgruppenCombinations) {
          const ctx = contextFor(
            mietspiegel.mietspiegeljahr,
            row,
            merkmalsgruppen,
          );
          const cents = referenceVergleichsmietePerQmInCent(
            row,
            merkmalsgruppen,
          );
          const label = `${mietspiegel.mietspiegeljahr}/${row.tabellenfeld} merkmalsgruppen=${merkmalsgruppen}`;
          expect(getWorstBestOrtsueblicheVergleichsmiete(ctx), label).toEqual({
            best: cents / 100,
            worst: cents / 100,
          });
          for (const typ of ["Miete", "Mieterhöhung"] as const) {
            ctx.typ = typ;
            const monthlyHoechstmiete =
              referenceMonthlyHoechstmieteInCent(
                cents,
                String(ctx.wohnflaeche),
                typ === "Miete",
              ) / 100;
            expect(
              getWorstBestZulaessigeHoechstmiete(ctx),
              `${label} ${typ}`,
            ).toEqual({
              best: monthlyHoechstmiete,
              worst: monthlyHoechstmiete,
            });
          }
        }
      },
    );
  });
}

describe("2015 Sondermerkmal interactions: both limits and opposing Merkmalsgruppe directions", () => {
  const names = Object.keys(rules.sondermerkmale2015.zuAbschlaegeInCent);
  test.each(
    mietspiegelReferences[0].rows.filter(
      (row) => row.mittelwertInCent !== null,
    ),
  )(
    "Tabellenfeld $tabellenfeld: every Sondermerkmal subset and Merkmalsgruppensaldo",
    (row) => {
      for (let mask = 0; mask < 2 ** names.length; mask++) {
        const selected = names.filter((_, index) => mask & (1 << index));
        const sondermerkmalZuAbschlagInCent = selected.reduce(
          (sum, name) =>
            sum +
            rules.sondermerkmale2015.zuAbschlaegeInCent[
              name as keyof typeof rules.sondermerkmale2015.zuAbschlaegeInCent
            ][
              rules.sondermerkmale2015.baujahrSpannen.indexOf(row.baujahrSpanne)
            ],
          0,
        );
        for (
          let merkmalsgruppenSaldo = -5;
          merkmalsgruppenSaldo <= 5;
          merkmalsgruppenSaldo++
        ) {
          const merkmalsgruppen = Array.from({ length: 5 }, (_, index) =>
            index < Math.abs(merkmalsgruppenSaldo)
              ? Math.sign(merkmalsgruppenSaldo)
              : 0,
          );
          const expected =
            referenceVergleichsmietePerQmInCent(
              row,
              merkmalsgruppen,
              0,
              sondermerkmalZuAbschlagInCent,
            ) / 100;
          expect(
            getWorstBestOrtsueblicheVergleichsmiete(
              contextFor("2015", row, merkmalsgruppen, selected),
            ),
            `${row.tabellenfeld} sondermerkmale=${selected} merkmalsgruppenSaldo=${merkmalsgruppenSaldo}`,
          ).toEqual({ best: expected, worst: expected });
        }
      }
    },
  );
});

describe("fractional Wohnflächen and decimal half-cent rounding", () => {
  for (const mietspiegel of mietspiegelReferences) {
    test(`${mietspiegel.mietspiegeljahr}: every populated Tabellenfeld`, () => {
      for (const row of mietspiegel.rows.filter(
        (row) => row.mittelwertInCent !== null,
      )) {
        for (const wohnflaeche of [
          String(Math.max(20, row.minWohnflaeche)),
          String(Math.max(20, row.minWohnflaeche) + 0.5),
          String(Math.max(20, row.minWohnflaeche) + 0.01),
        ]) {
          const ctx = contextFor(mietspiegel.mietspiegeljahr, row);
          ctx.wohnflaeche = Number(wohnflaeche);
          const expected =
            referenceMonthlyHoechstmieteInCent(
              row.mittelwertInCent!,
              wohnflaeche,
              true,
            ) / 100;
          expect(
            getWorstBestZulaessigeHoechstmiete(ctx),
            `${row.tabellenfeld} ${wohnflaeche}m²`,
          ).toEqual({ best: expected, worst: expected });
        }
      }
    });
  }
});
