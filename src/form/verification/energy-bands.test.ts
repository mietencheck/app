import { describe, expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import type { FinalAnswers } from "~/form/flow-machine-runtime";
import { getEnergiekennwertStates } from "~/form/utils/energiekennwert";

import { BASE_ANSWERS, contractScenarios, evaluateAnswers } from "./flow-paths";

const merkmale = [
  "[Gebäude-] Energieverbrauchskennwert größer als 170/155/145",
  "[Gebäude-] Energieverbrauchskennwert größer als 210/195",
  "[Gebäude-] Energieverbrauchskennwert größer als 250/235",
  "[Gebäude+] Energieverbrauchskennwert kleiner als 120",
  "[Gebäude+] Energieverbrauchskennwert kleiner als 100",
  "[Gebäude+] Energieverbrauchskennwert kleiner als 80",
] as const;
const numericAlias = "Energiekennwert laut Energieausweis";
const supplyAlias = "Warmwasserversorgung ist dezentral";
const includedAlias = "Dezentrales Warmwasser im Energiekennwert enthalten";
const visible = new Set([numericAlias, supplyAlias, includedAlias]);
const jahrGrenzen = [
  ["2015", [170, 210, 250, 120, 100, 80]],
  ["2017", [155, 195, 235, 120, 100, 80]],
  ["2019", [155, 195, 235, 120, 100, 80]],
  ["2021", [155, 195, 235, 120, 100, 80]],
  ["2023", [155, 195, 235, 120, 100, 80]],
  ["2024", [145, 195, 235, 120, 100, 80]],
  ["2026", [145, 195, 235, 120, 100, 80]],
] as const;
const typen = ["Energieverbrauchswert", "Ernergiebedarfswert"] as const;

function answers(overrides: Record<string, unknown> = {}): FinalAnswers {
  return {
    Typ: "Miete",
    "Kennt Energieverbrauch oder Energiebedarf": "Energieverbrauchswert",
    [numericAlias]: 140,
    [supplyAlias]: "Ja",
    [includedAlias]: "Nein",
    ...overrides,
  } as FinalAnswers;
}

describe.each(jahrGrenzen)("Mietspiegel %s", (jahr, grenzen) => {
  test.each(typen)(
    "%s: adjust before all strict threshold comparisons",
    (typ) => {
      const factor = typ === "Ernergiebedarfswert" ? 1.2 : 1;
      for (const [dezentral, enthalten, zuschlag] of [
        ["Nein", "Nein", 0],
        ["Ja", "Nein", 20],
        ["Ja", "Ja", 0],
      ] as const) {
        grenzen.forEach((grenze, i) => {
          for (const difference of [-0.01, 0, 0.01]) {
            const raw = grenze * factor - zuschlag + difference;
            const result = getEnergiekennwertStates(
              answers({
                "Kennt Energieverbrauch oder Energiebedarf": typ,
                [numericAlias]: raw,
                [supplyAlias]: dezentral,
                [includedAlias]: enthalten,
              }),
              visible,
              jahr,
            );
            expect(result[merkmale[i]], `${typ}, ${raw}, +${zuschlag}`).toBe(
              (i < 3 ? difference > 0 : difference < 0)
                ? "checked"
                : "unchecked",
            );
          }
        });
      }
    },
  );
});

test.each(
  contractScenarios().filter((s) => s.label.startsWith("unterschrieben")),
)(
  "$jahr: questionnaire value/type and warm water affect actual Merkmal mapping",
  (scenario) => {
    for (const typ of typen) {
      const factor = typ === "Ernergiebedarfswert" ? 1.2 : 1;
      const grenze =
        jahrGrenzen.find(([jahr]) => jahr === scenario.jahr)![1][0] * factor;
      const evaluate = (enthalten: "Ja" | "Nein") => {
        const result = evaluateAnswers({
          ...BASE_ANSWERS,
          ...scenario.pinned,
          ...answers({
            "Kennt Energieverbrauch oder Energiebedarf": typ,
            [numericAlias]: grenze - 10,
            [includedAlias]: enthalten,
          }),
        });
        expect(result.visible.has(numericAlias)).toBe(true);
        expect(result.visible.has(includedAlias)).toBe(true);
        expect(result.visible.has("Energieverbrauchskennwert")).toBe(false);
        expect(result.visible.has("Energiebedarfskennwert")).toBe(false);
        return getMerkmalStates(result.answers as FinalAnswers, result.visible);
      };
      expect(evaluate("Nein")[merkmale[0]]).toBe("checked");
      expect(evaluate("Ja")[merkmale[0]]).toBe("unchecked");
    }
  },
);

test.each(["Ja", "Nein", "Nicht sicher", undefined])(
  "central supply ignores a stale included answer (%s)",
  (enthalten) => {
    const result = evaluateAnswers({
      ...BASE_ANSWERS,
      Vertragsdatum: ">2026",
      ...answers({ [supplyAlias]: "Nein", [includedAlias]: enthalten }),
    });
    expect(result.visible.has(includedAlias)).toBe(false);
    expect(
      getMerkmalStates(result.answers as FinalAnswers, result.visible)[
        merkmale[0]
      ],
    ).toBe("unchecked");
  },
);

test.each([
  ["Ja", "Nicht sicher"],
  ["Nicht sicher", "Nein"],
  ["Nicht sicher", "Nicht sicher"],
  [undefined, undefined],
])(
  "uncertain warm water (%s, %s) only makes crossed thresholds uncertain",
  (supply, included) => {
    const result = getEnergiekennwertStates(
      answers({ [supplyAlias]: supply, [includedAlias]: included }),
      visible,
      "2026",
    );
    expect(Object.values(result)).toEqual([
      "maybe",
      "unchecked",
      "unchecked",
      "unchecked",
      "unchecked",
      "unchecked",
    ]);
  },
);

test("included warm water needs no addition even when the supply type is uncertain", () => {
  expect(
    getEnergiekennwertStates(
      answers({ [supplyAlias]: "Nicht sicher", [includedAlias]: "Ja" }),
      visible,
      "2026",
    )[merkmale[0]],
  ).toBe("unchecked");
});

test.each([undefined, null, "", " ", -1, NaN, Infinity, "bad"])(
  "invalid or missing numeric input %s cannot establish an energy Merkmal",
  (value) => {
    expect(
      Object.values(
        getEnergiekennwertStates(
          answers({ [numericAlias]: value }),
          visible,
          "2026",
        ),
      ),
    ).toEqual(Array(6).fill("maybe"));
  },
);

test.each([0, "0", "140.5"])(
  "browser numeric value %s is accepted",
  (value) => {
    expect(
      getEnergiekennwertStates(
        answers({ [numericAlias]: value }),
        visible,
        "2026",
      )[merkmale[0]],
    ).toBe(value === "140.5" ? "checked" : "unchecked");
  },
);

test("unknown certificate type hides numeric and hot-water questions and stale answers have no effect", () => {
  const result = evaluateAnswers({
    ...BASE_ANSWERS,
    ...answers(),
    Vertragsdatum: ">2026",
    "Kennt Energieverbrauch oder Energiebedarf": "Nein",
  });
  expect(result.visible.has(numericAlias)).toBe(false);
  expect(result.visible.has(supplyAlias)).toBe(false);
  expect(result.visible.has(includedAlias)).toBe(false);
  const states = getMerkmalStates(
    result.answers as FinalAnswers,
    result.visible,
  );
  expect(merkmale.map((merkmal) => states[merkmal])).toEqual(
    Array(6).fill("unchecked"),
  );
});

test("does not alter the Mieterhöhung or legacy answer path", () => {
  expect(
    getEnergiekennwertStates(answers({ Typ: "Mieterhöhung" }), visible, "2026"),
  ).toEqual({});
  expect(getEnergiekennwertStates(answers(), new Set(), "2026")).toEqual({});
});

test.each(typen)(
  "saved %s band answers keep their result until a numeric value is supplied",
  (typ) => {
    const legacyAlias =
      typ === "Energieverbrauchswert"
        ? "Energieverbrauchskennwert"
        : "Energiebedarfskennwert";
    const saved = answers({
      "Kennt Energieverbrauch oder Energiebedarf": typ,
      [numericAlias]: undefined,
      [legacyAlias]: "--",
    });
    expect(
      Object.values(getEnergiekennwertStates(saved, visible, "2026")),
    ).toEqual([
      "checked",
      "checked",
      "unchecked",
      "unchecked",
      "unchecked",
      "unchecked",
    ]);
    expect(
      getEnergiekennwertStates(
        { ...saved, [numericAlias]: 100 },
        visible,
        "2026",
      )[merkmale[0]],
    ).toBe("unchecked");
  },
);

test("uncertain inclusion also makes a positive Merkmal uncertain when the addition crosses it", () => {
  expect(
    getEnergiekennwertStates(
      answers({ [numericAlias]: 110, [includedAlias]: "Nicht sicher" }),
      visible,
      "2026",
    )[merkmale[3]],
  ).toBe("maybe");
});

test.each([1918, 1990, 1991, 2009, 2010, 2014])(
  "Warmwasser adjustment has no construction-year gate (Baujahr %s)",
  (Baujahr) => {
    const result = evaluateAnswers({
      ...BASE_ANSWERS,
      ...answers(),
      Vertragsdatum: ">2026",
      Baujahr,
    });
    expect(result.visible.has(numericAlias)).toBe(true);
    expect(
      getMerkmalStates(result.answers as FinalAnswers, result.visible)[
        merkmale[0]
      ],
    ).toBe("checked");
  },
);
