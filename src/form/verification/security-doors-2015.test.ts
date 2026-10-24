import { describe, expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers, questionsByAlias } from "~/form/flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";
import { hash } from "~/l10n";

import EN from "../../../public/locales/en.json";
import { BASE_ANSWERS, contractScenarios, evaluateAnswers } from "./flow-paths";

// Keep the persisted alias; the combined question applies to future answers.
const alias = "Gebäude hat sichere Haustür";
const merkmal = "[Gebäude+] Gebäude hat zusätzliche Einbruchsicherung";

function evaluate(answers: Record<string, unknown>) {
  const result = evaluateAnswers({
    ...BASE_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    ...answers,
  });
  expect(result.lastStep?.type).not.toBe("Exit");
  return {
    ...result,
    states: getMerkmalStates(result.answers as FinalAnswers, result.visible),
  };
}

describe("2015: combined Wohnungs- und Haustür security", () => {
  test("asks about both doors and explains mixed and uncertain conditions in both languages", () => {
    const question = questionsByAlias.get(alias)!;
    expect(question.text).toBe(
      "Sind sowohl deine Wohnungstür als auch die Haustür des Gebäudes einbruchhemmend?",
    );
    expect(question.info).toContain(
      "zusätzliche moderne Einbruchsicherungsmaßnahmen",
    );
    expect(question.info).toContain(
      "„Ja“ nur, wenn dies für beide Türen zutrifft",
    );
    expect(question.info).toContain("„Nein“, wenn mindestens eine");
    expect(question.info).toContain("wenn keine Tür sicher ausgeschlossen ist");
    const strings = EN.strings as Record<string, string>;
    expect(strings[hash(question.text)]).toBe(
      "Are both your flat door and the building entrance door burglary-resistant?",
    );
    expect(strings[hash(question.info!)]).toContain(
      "Choose “No” if at least one",
    );
    expect(strings[hash(question.info!)]).toContain(
      "neither door is known to fail",
    );
  });

  // Responses follow the combined question's instructions, rather than the
  // later editions' distinct reinforced-flat-door question. Source: 2015 p.21.
  test.each([
    { situation: "both doors qualify", answer: "Ja", expected: "checked" },
    {
      situation: "only the building entrance qualifies",
      answer: "Nein",
      expected: "unchecked",
    },
    {
      situation: "only the flat door qualifies",
      answer: "Nein",
      expected: "unchecked",
    },
    {
      situation: "neither door qualifies",
      answer: "Nein",
      expected: "unchecked",
    },
    {
      situation: "one door fails and the other is uncertain",
      answer: "Nein",
      expected: "unchecked",
    },
    {
      situation: "one door qualifies and the other is uncertain",
      answer: "Nicht sicher",
      expected: "maybe",
    },
    {
      situation: "both doors are uncertain",
      answer: "Nicht sicher",
      expected: "maybe",
    },
  ])("$situation: $expected", ({ answer, expected }) => {
    const result = evaluate({
      Vertragsdatum: "2015-2016",
      [alias]: answer,
      "Wohnung hat verstärkte Tür": "Ja",
    });
    expect(result.visible.has(alias)).toBe(true);
    expect(result.states[merkmal]).toBe(expected);
  });

  test.each([1918, 1919, 1949, 1950, 1990, 1991, 2002, 2003, 2010])(
    "Baujahr %i: both qualifying doors count without a construction-year gate",
    (Baujahr) => {
      expect(
        evaluate({ Vertragsdatum: "2015-2016", Baujahr, [alias]: "Ja" }).states[
          merkmal
        ],
      ).toBe("checked");
    },
  );

  test.each(contractScenarios().filter(({ jahr }) => jahr !== "2015"))(
    "$label: the 2015 combined question is skipped",
    ({ pinned }) => {
      const result = evaluate({
        ...pinned,
        [alias]: "Ja",
        "Wohnung hat verstärkte Tür": "Ja",
      });
      expect(result.visible.has(alias)).toBe(false);
      expect(result.states[merkmal]).toBeUndefined();
      expect(
        result.states["[Wohnung+] Wohnung hat zusätzliche Einbruchssicherung"],
      ).toBe("checked");
    },
  );
});
