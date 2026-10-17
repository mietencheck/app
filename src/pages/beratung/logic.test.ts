import { describe, expect, test } from "vitest";

import { getWorstBestZulaessigeHoechstmiete } from "~/calculation/zulaessigeHoechstmiete";

import { recordToCalculationContext } from "./logic";
import { getDefaultBeratungRecord } from "./mock-data";
import { parseStoredFlowDataAsBeratungRecord } from "./parseStoredFlowData";

function savedRecord() {
  return { ...getDefaultBeratungRecord(), vertragsdatum: "2018-2020" as const };
}

describe("saved Beratung records", () => {
  test("round-trips a persisted record without losing editable fields", () => {
    const record = savedRecord();
    expect(
      parseStoredFlowDataAsBeratungRecord(JSON.parse(JSON.stringify(record))),
    ).toEqual(record);
  });

  test("defaults missing optional Sondermerkmale", () => {
    const record = { ...savedRecord(), sondermerkmale: undefined };
    expect(parseStoredFlowDataAsBeratungRecord(record)?.sondermerkmale).toEqual(
      {},
    );
  });

  test.each([
    { vertragsdatum: "invalid" },
    { wohnflaeche: "100" },
    { wohnflaeche: NaN },
    { baujahrSpanne: "" },
    { wohnlage: "invalid" },
    { ausstattung: null },
    { ausstattung: { sammelheizung: "Nicht sicher", bad: "Ja" } },
    { ausstattung: { sammelheizung: "Ja", bad: "invalid" } },
    { merkmale: null },
    { sondermerkmale: "invalid" },
  ])("rejects malformed persisted data: %j", (invalid) => {
    expect(
      parseStoredFlowDataAsBeratungRecord({ ...savedRecord(), ...invalid }),
    ).toBeNull();
  });
});

describe("Beratung calculation", () => {
  // 2019, pre-1918, medium location, 100 m²: mean 6.77 €/m².
  // One missing facility deducts 1.41; both deduct 2.20.
  // Neutral Merkmale, no Sondermerkmale: mean × 100 × 1.1.
  test.each([
    ["Ja", "Ja", 744.7],
    ["Nein", "Ja", 589.6],
    ["Ja", "Nein", 589.6],
    ["Nein", "Nein", 502.7],
  ] as const)(
    "calculates known rent for heating=%s, bathroom=%s",
    (sammelheizung, bad, expected) => {
      const parsed = parseStoredFlowDataAsBeratungRecord({
        ...savedRecord(),
        ausstattung: { sammelheizung, bad },
      });
      expect(parsed).not.toBeNull();
      const ctx = recordToCalculationContext(parsed!, parsed!.merkmale);
      expect(ctx).toMatchObject({
        mietspiegeljahr: "2019",
        wohnflaecheSpanne: "90-",
        ausstattung: { sammelheizung, bad },
      });
      expect(getWorstBestZulaessigeHoechstmiete(ctx!)).toEqual({
        best: expected,
        worst: expected,
      });
    },
  );

  test("uses edited Merkmale instead of the saved ratings", () => {
    const record = savedRecord();
    const edited = structuredClone(record.merkmale);
    edited.Bad.Wohnwerterhoehend["Bad ist groß"] = "checked";
    const ctx = recordToCalculationContext(record, edited);
    // 20% of (9.80 - 6.77) adds 0.606, rounded mean 7.38.
    expect(getWorstBestZulaessigeHoechstmiete(ctx!)).toEqual({
      best: 811.8,
      worst: 811.8,
    });
    expect(record.merkmale.Bad.Wohnwerterhoehend["Bad ist groß"]).toBe(
      "unchecked",
    );
  });

  test("returns no context for an unsupported building-year bracket", () => {
    const record = { ...savedRecord(), baujahrSpanne: "invalid" };
    expect(recordToCalculationContext(record, record.merkmale)).toBeUndefined();
  });
});
