import { describe, expect, test } from "vitest";

import {
  getSelectedWohnflaecheSpanne,
  getWohnflaecheSpanneOptions,
  parseWohnflaecheSpanne,
  sortSpanne,
} from "./wohnflaecheSpanne";

describe("parseWohnflaecheSpanne", () => {
  test("parses closed ranges", () => {
    expect(parseWohnflaecheSpanne("40-60")).toEqual({ min: 40, max: 60 });
  });

  test("parses open-ended ranges", () => {
    expect(parseWohnflaecheSpanne("90-")).toEqual({ min: 90, max: null });
  });
});

describe("sortSpanne", () => {
  test("sorts ranges by lower bound, then upper bound", () => {
    const sorted = ["90-", "40-60", "60-90", "0-40"].sort(sortSpanne);
    expect(sorted).toEqual(["0-40", "40-60", "60-90", "90-"]);
  });
});

describe("getSelectedWohnflaecheSpanne", () => {
  const options = ["40-60", "60-90", "90-"];

  test("uses inclusive lower and exclusive upper bound", () => {
    expect(getSelectedWohnflaecheSpanne(59, options)).toBe("40-60");
    expect(getSelectedWohnflaecheSpanne(60, options)).toBe("60-90");
  });

  test("matches open-ended range for large values", () => {
    expect(getSelectedWohnflaecheSpanne(120, options)).toBe("90-");
  });
});

describe("getWohnflaecheSpanneOptions", () => {
  test("returns sorted options for a valid mietspiegel tuple", () => {
    const options = getWohnflaecheSpanneOptions("2024", "-1918", "einfach");
    expect(options.length).toBeGreaterThan(0);
    expect(options).toEqual([...options].sort(sortSpanne));
  });

  test("returns empty list for incomplete tuple", () => {
    expect(
      getWohnflaecheSpanneOptions(undefined, "1918-1949", "einfach"),
    ).toEqual([]);
    expect(getWohnflaecheSpanneOptions("2024", undefined, "einfach")).toEqual(
      [],
    );
    expect(getWohnflaecheSpanneOptions("2024", "1918-1949", undefined)).toEqual(
      [],
    );
  });
});
