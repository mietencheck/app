import { expect, test } from "vitest";

import { analyzeMieteErgebnis, getMieteDiff } from "../mieteErgebnis";
import { editions } from "./fixtures";
import { referenceMonthlyCents } from "./reference-calculation";

for (const edition of editions) {
  test(`${edition.edition}: cent boundaries at both range endpoints`, () => {
    for (const row of edition.rows.filter((row) => row.medianCents !== null)) {
      const area = String(Math.max(20, row.minArea));
      const lower = referenceMonthlyCents(row.lowerCents!, area, true);
      const upper = referenceMonthlyCents(row.upperCents!, area, true);
      const ceiling = { best: lower / 100, worst: upper / 100 };
      for (const actualCents of new Set([
        lower - 1,
        lower,
        lower + 1,
        upper - 1,
        upper,
        upper + 1,
      ])) {
        const expected =
          actualCents <= lower
            ? "zulaessig"
            : actualCents > upper
              ? "zu_hoch"
              : "eventuell_zu_hoch";
        const result = analyzeMieteErgebnis(
          ceiling,
          getMieteDiff(actualCents / 100, ceiling),
        );
        expect(
          result.kind,
          `${row.field} actual=${actualCents} range=${lower}..${upper}`,
        ).toBe(expected);
        expect(result.hasRange).toBe(lower !== upper);
      }
    }
  });
}
