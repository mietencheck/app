import { describe, expect, test } from "vitest";

import {
  analyzeMieteErgebnis,
  classifyMieteErgebnis,
  getMieteDiff,
  hasZulaessigeHoechstmieteRange,
} from "./mieteErgebnis";

const zulaessigeHoechstmiete = { best: 800, worst: 900 };

describe("getMieteDiff", () => {
  test("computes rent minus permissible max", () => {
    expect(getMieteDiff(950, zulaessigeHoechstmiete)).toEqual({
      worst: 50,
      best: 150,
    });
  });
});

describe("classifyMieteErgebnis", () => {
  test("rent below lowest max is zulaessig", () => {
    expect(classifyMieteErgebnis({ worst: -50, best: -100 })).toBe("zulaessig");
  });

  test("rent exactly at lowest max is zulaessig", () => {
    expect(classifyMieteErgebnis({ worst: -50, best: 0 })).toBe("zulaessig");
  });

  test("rent in uncertain range is eventuell_zu_hoch", () => {
    expect(classifyMieteErgebnis({ worst: -50, best: 50 })).toBe(
      "eventuell_zu_hoch",
    );
  });

  test("rent above highest max is zu_hoch", () => {
    expect(classifyMieteErgebnis({ worst: 50, best: 100 })).toBe("zu_hoch");
  });
});

describe("analyzeMieteErgebnis", () => {
  test("includes diff and range metadata", () => {
    const diff = { worst: -50, best: 50 };
    expect(analyzeMieteErgebnis(zulaessigeHoechstmiete, diff)).toEqual({
      kind: "eventuell_zu_hoch",
      zulaessigeHoechstmiete,
      diff,
      hasRange: true,
    });
  });

  test("hasRange is false when max rent is a single value", () => {
    expect(hasZulaessigeHoechstmieteRange({ best: 800, worst: 800 })).toBe(
      false,
    );
  });
});
