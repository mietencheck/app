import { expect, test } from "vitest";

import { analyzeMieteErgebnis, getMieteDiff } from "../mieteErgebnis";

const cases = [
  [499.99, "zulaessig"],
  [500, "zulaessig"],
  [500.01, "eventuell_zu_hoch"],
  [549.99, "eventuell_zu_hoch"],
  [550, "eventuell_zu_hoch"],
  [550.01, "zu_hoch"],
] as const;

test.each(cases)(
  "Nettokaltmiete %s against a 500–550 range is %s",
  (nettokaltmiete, expected) => {
    const hoechstmiete = { best: 500, worst: 550 };
    const result = analyzeMieteErgebnis(
      hoechstmiete,
      getMieteDiff(nettokaltmiete, hoechstmiete),
    );
    expect(result.kind).toBe(expected);
    expect(result.hasRange).toBe(true);
  },
);

test.each([
  [499.99, "zulaessig"],
  [500, "zulaessig"],
  [500.01, "zu_hoch"],
] as const)(
  "Nettokaltmiete %s against a fixed 500 ceiling is %s",
  (nettokaltmiete, expected) => {
    const hoechstmiete = { best: 500, worst: 500 };
    const result = analyzeMieteErgebnis(
      hoechstmiete,
      getMieteDiff(nettokaltmiete, hoechstmiete),
    );
    expect(result.kind).toBe(expected);
    expect(result.hasRange).toBe(false);
  },
);
