import { Question, ungroup } from "flow-machine";
import { describe, expect, test } from "vitest";

import EN from "../../public/locales/en.json";
import { hash } from "../l10n";
import { getMerkmalStates } from "./api";
import { evaluateFlowMachine } from "./flow-machine-evaluation";
import {
  MERKMAL_RESET_ANSWERS,
  SCHNELLTEST_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "./mappings/answer-reset";
import { ALL_VERTRAGSDATUM } from "./mappings/tests/merkmal-default-state";

const alias = "Wohnung hat Rollläden";
const merkmal = "[Wohnung+] Wohnung hat Rollläden";
const legacyText = "Sind die Fenster überwiegend mit Rollläden ausgestattet?";

function evaluate(answers: Record<string, unknown>) {
  const result = evaluateFlowMachine({
    ...SCHNELLTEST_RESET_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    Typ: "Miete",
    Mietart: "Normal",
    ...answers,
  });
  const questions = ungroup(result.steps).filter(
    (step): step is Question =>
      step.type === "Question" && step.alias === alias,
  );
  expect(result.issues).toEqual([]);
  expect(questions).toHaveLength(1);
  return {
    question: questions[0],
    state: getMerkmalStates(
      result.answers,
      new Set(result.visibleQuestionAliases),
    )[merkmal],
  };
}

describe("Verschattungssysteme in Mietspiegel 2026", () => {
  test.each([
    { Unterschrieben: "Ja", Vertragsdatum: ">2026" },
    { Unterschrieben: "Nein" },
    // A stale contract period must not override the unsigned-contract rule.
    { Unterschrieben: "Nein", Vertragsdatum: "2024-2026" },
  ])("asks about exterior systems for %o", (contract) => {
    const { question } = evaluate(contract);
    expect(question.text).toContain("außen angebrachten Verschattungssystemen");
    expect(question.text).toContain("in den Wohnräumen überwiegend");
    expect(question.text).toContain("Außenjalousien");
    expect(question.info).toContain("mehr als der Hälfte");
    expect(question.info).toContain(
      "Innenliegende Jalousien oder Rollos zählen nicht",
    );

    const translations = EN.strings as Record<string, string>;
    expect(translations[hash(question.text)]).toContain(
      "exterior shading systems",
    );
    expect(translations[hash(question.text)]).toContain("habitable rooms");
    expect(translations[hash(question.info!)]).toContain("more than half");
    expect(translations[hash(question.info!)]).toContain(
      "Interior blinds or roller blinds do not count",
    );
  });

  // There is no Baujahr restriction on this feature in the source clause.
  test.each([1918, 1949, 1990, 1991, 2009, 2010, 2013, 2014])(
    "offers the exterior-system question for Baujahr %i",
    (Baujahr) => {
      expect(
        evaluate({ Vertragsdatum: ">2026", Baujahr }).question.text,
      ).toContain("Verschattungssystemen");
    },
  );

  // Physical eligibility is self-reported through the explicitly scoped question.
  test.each([
    ["exterior blinds on most habitable-room windows", "Ja", "checked"],
    ["roller shutters on most habitable-room windows", "Ja", "checked"],
    ["interior blinds only", "Nein", "unchecked"],
    [
      "exterior systems on exactly half the relevant windows",
      "Nein",
      "unchecked",
    ],
    [
      "exterior systems on fewer than half the relevant windows",
      "Nein",
      "unchecked",
    ],
    ["uncertain exterior coverage", "Nicht sicher", "maybe"],
  ])("%s (%s) yields %s", (_scenario, answer, expected) => {
    expect(evaluate({ Vertragsdatum: ">2026", [alias]: answer }).state).toBe(
      expected,
    );
  });
});

describe("older Mietspiegel editions", () => {
  test.each(ALL_VERTRAGSDATUM.filter((period) => period !== ">2026"))(
    "%s retains the roller-shutter question and answer behavior",
    (Vertragsdatum) => {
      for (const [answer, expected] of [
        ["Ja", "checked"],
        ["Nein", "unchecked"],
        ["Nicht sicher", "maybe"],
      ]) {
        const { question, state } = evaluate({
          Vertragsdatum,
          [alias]: answer,
        });
        expect(question.text).toBe(legacyText);
        expect(question.info).toBeNull();
        expect(state).toBe(expected);
      }
    },
  );
});

test("Mieterhöhung retains its existing question", () => {
  expect(
    evaluate({ Typ: "Mieterhöhung", Vertragsdatum: ">2026" }).question.text,
  ).toBe(legacyText);
});

test.each([2015, 2024])(
  "Baujahr %i still exits before the detail questions",
  (Baujahr) => {
    const result = evaluateFlowMachine({
      ...SCHNELLTEST_RESET_ANSWERS,
      Typ: "Miete",
      Mietart: "Normal",
      Vertragsdatum: ">2026",
      Baujahr,
    });
    expect(ungroup(result.steps).at(-1)).toMatchObject({
      type: "Exit",
      alias: "Exit: Neubauwohnung",
    });
    expect(result.visibleQuestionAliases).not.toContain(alias);
  },
);
