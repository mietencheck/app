import { describe, expect, it } from "vitest";

import { calculateKappungsgrenze, SAMPLE_TEST_CASES } from "./kappungsgrenze";

describe("calculateKappungsgrenze", () => {
  it("does not exceed when only small increase in normal market", () => {
    const result = calculateKappungsgrenze(SAMPLE_TEST_CASES[0].input);
    expect(result.conservative.exceeded).toBe(false);
    expect(result.conservative.usagePercent).toBeLessThan(100);
  });

  it("exceeds when prior counted increase plus target exceeds cap", () => {
    const result = calculateKappungsgrenze(SAMPLE_TEST_CASES[1].input);
    expect(result.conservative.exceeded).toBe(true);
  });

  it("ignores modernization increases for cap sum", () => {
    const result = calculateKappungsgrenze(SAMPLE_TEST_CASES[2].input);
    expect(result.conservative.exceeded).toBe(false);
  });

  it("treats unknown counted amounts conservatively", () => {
    const result = calculateKappungsgrenze({
      currentRent: 900,
      market: "tight",
      target: {
        id: "target",
        date: "2026-01-01",
        amountType: "delta",
        amount: 50,
        reason: "vergleichsmiete",
      },
      history: [
        {
          id: "h1",
          date: "2025-01-01",
          amountType: "delta",
          amount: null,
          reason: "vergleichsmiete",
          unknownAmount: true,
        },
      ],
    });

    expect(result.conservative.exceeded).toBe(true);
    expect(result.assumptions.length).toBeGreaterThan(0);
  });
});
