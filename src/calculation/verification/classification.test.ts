import { expect, test } from "vitest";

import { analyzeMieteErgebnis, getMieteDiff } from "../mieteErgebnis";
import { mietspiegelReferences } from "./fixtures";
import { referenceMonthlyHoechstmieteInCent } from "./reference-calculation";

for (const mietspiegel of mietspiegelReferences) {
  test(`${mietspiegel.mietspiegeljahr}: cent boundaries at both range endpoints`, () => {
    for (const row of mietspiegel.rows.filter(
      (row) => row.mittelwertInCent !== null,
    )) {
      const wohnflaeche = String(Math.max(20, row.minWohnflaeche));
      const lowestHoechstmiete = referenceMonthlyHoechstmieteInCent(
        row.unterwertInCent!,
        wohnflaeche,
        true,
      );
      const highestHoechstmiete = referenceMonthlyHoechstmieteInCent(
        row.oberwertInCent!,
        wohnflaeche,
        true,
      );
      const zulaessigeHoechstmiete = {
        best: lowestHoechstmiete / 100,
        worst: highestHoechstmiete / 100,
      };
      for (const nettokaltmieteInCent of new Set([
        lowestHoechstmiete - 1,
        lowestHoechstmiete,
        lowestHoechstmiete + 1,
        highestHoechstmiete - 1,
        highestHoechstmiete,
        highestHoechstmiete + 1,
      ])) {
        const expected =
          nettokaltmieteInCent <= lowestHoechstmiete
            ? "zulaessig"
            : nettokaltmieteInCent > highestHoechstmiete
              ? "zu_hoch"
              : "eventuell_zu_hoch";
        const result = analyzeMieteErgebnis(
          zulaessigeHoechstmiete,
          getMieteDiff(nettokaltmieteInCent / 100, zulaessigeHoechstmiete),
        );
        expect(
          result.kind,
          `${row.tabellenfeld} actual=${nettokaltmieteInCent} range=${lowestHoechstmiete}..${highestHoechstmiete}`,
        ).toBe(expected);
        expect(result.hasRange).toBe(
          lowestHoechstmiete !== highestHoechstmiete,
        );
      }
    }
  });
}
