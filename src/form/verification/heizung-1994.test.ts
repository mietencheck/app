import { expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import { MERKMAL_RESET_ANSWERS } from "~/form/mappings/answer-reset";

import { BASE_ANSWERS, contractScenarios, evaluateAnswers } from "./flow-paths";

const stichtag = "Gebäude vor 1.7.1994 errichtet";
const heizung = "Gebäude hat moderne Heizanlage";
const merkmal = "[Gebäude+] Gebäude hat zusätzliche Wärmedämmung";
const antworten = ["Ja", "Nein", "Nicht sicher", undefined] as const;

function evaluate(answers: Record<string, unknown>) {
  const result = evaluateAnswers({
    ...BASE_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    Vertragsdatum: "2015-2016",
    Baujahr: 1994,
    "Kennt Energieverbrauch oder Energiebedarf": "Nein",
    ...answers,
  });
  expect(result.lastStep?.type).not.toBe("Exit");
  return {
    ...result,
    state: getMerkmalStates(result.answers as FinalAnswers, result.visible)[
      merkmal
    ],
  };
}

// Mietspiegel 2015, printed p.21 (PDF p.20): building BEFORE 01.07.1994,
// modern heating AFTER 01.07.1994. The exact day belongs to the Nein path.
test.each(
  antworten.flatMap((datum) =>
    antworten.map((heizanlage) => ({ datum, heizanlage })),
  ),
)("1994: date $datum, heating $heizanlage", ({ datum, heizanlage }) => {
  const result = evaluate({ [stichtag]: datum, [heizung]: heizanlage });
  expect(result.visible.has(stichtag)).toBe(true);
  expect(result.visible.has(heizung)).toBe(datum !== "Nein");
  const expected =
    datum === "Nein" || heizanlage === "Nein"
      ? "unchecked"
      : datum === "Ja" && heizanlage === "Ja"
        ? "checked"
        : "maybe";
  expect(result.state).toBe(expected);
});

test.each([1993, 1995])("Baujahr %i keeps the simple path", (baujahr) => {
  for (const datum of antworten) {
    for (const heizanlage of antworten) {
      const result = evaluate({
        Baujahr: baujahr,
        [stichtag]: datum,
        [heizung]: heizanlage,
      });
      expect(result.visible.has(stichtag)).toBe(false);
      expect(result.visible.has(heizung)).toBe(baujahr === 1993);
      expect(result.state).toBe(
        baujahr === 1995 || heizanlage === "Nein"
          ? "unchecked"
          : heizanlage === "Ja"
            ? "checked"
            : "maybe",
      );
    }
  }
});

test.each(antworten)(
  "additional insulation remains independent of date %s",
  (datum) => {
    const result = evaluate({
      [stichtag]: datum,
      [heizung]: "Ja",
      "Gebäude hat gute Wärmedämmung": "Ja",
    });
    expect(result.state).toBe("checked");
  },
);

test("inefficient heating retains its existing path", () => {
  const result = evaluate({
    "Gebäude hat Heizanlage mit ungünstigem Wirkungsgrad": "Ja",
    [stichtag]: "Ja",
    [heizung]: "Ja",
  });
  expect(result.visible.has(stichtag)).toBe(false);
  expect(result.visible.has(heizung)).toBe(false);
  expect(result.state).toBe("unchecked");
});

test.each(contractScenarios().filter(({ jahr }) => jahr !== "2015"))(
  "$jahr: separate heating cutoffs remain unchanged",
  ({ jahr, pinned }) => {
    const grenze = Number(jahr) >= 2024 ? 2009 : 2003;
    for (const baujahr of [1994, grenze - 1, grenze]) {
      const result = evaluate({
        ...pinned,
        Baujahr: baujahr,
        [stichtag]: "Nein",
        [heizung]: "Ja",
      });
      expect(result.visible.has(stichtag)).toBe(false);
      expect(result.visible.has(heizung)).toBe(baujahr < grenze);
      expect(result.state).toBe(baujahr < grenze ? "checked" : "unchecked");
    }
  },
);
