import { ungroup } from "flow-machine";
import { describe, expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import {
  FinalAnswers,
  flowMachine,
  getVisibleQuestionAliases,
} from "~/form/flow-machine";
import {
  MERKMAL_RESET_ANSWERS,
  SCHNELLTEST_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";
import { hash } from "~/l10n";

import en from "../../../../public/locales/en.json";
import { ALL_VERTRAGSDATUM } from "./merkmal-default-state";

const alias = "Wohnumfeld hat gepflegte Müllstandsfläche";
const negativeAlias = "Wohnumfeld hat ungepflegte Müllstandsfläche";
const merkmal = "[Umfeld+] Gepflegte Müllstandsfläche";
const negativeMerkmal = "[Umfeld-] Ungepflegte und offene Müllstandfläche";

function answers(overrides: FinalAnswers = {}): FinalAnswers {
  return {
    ...SCHNELLTEST_RESET_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    Typ: "Miete",
    Vertragsdatum: "2015-2016",
    ...overrides,
  };
}

function states(input: FinalAnswers) {
  return getMerkmalStates(input, getVisibleQuestionAliases(input));
}

describe("2015 gepflegte Müllstandsfläche", () => {
  test("asks all three source conditions and explains public or uncertain access in both languages", () => {
    const question = ungroup(
      flowMachine.run(flowMachine.answers(answers()).state),
    ).find((step) => step.type === "Question" && step.alias === alias);
    if (!question || question.type !== "Question")
      throw new Error("Missing question");
    expect(question.text).toBe(
      "Gibt es auf dem Grundstück des Hauses eine gepflegte Müllstandsfläche mit sichtbegrenzender Gestaltung, die nur den Mietern zugänglich ist?",
    );
    expect(question.info).toContain("alle drei Bedingungen");
    expect(question.info).toContain(
      "öffentlich zugänglich, antworte mit „Nein“",
    );
    expect(question.info).toContain("wähle „Ich bin mir nicht sicher“");
    const translations = en.strings as Record<string, string>;
    expect(translations[hash(question.text)]).toContain(
      "accessible only to tenants",
    );
    expect(translations[hash(question.info!)]).toContain(
      "If it is publicly accessible, answer “No”",
    );
    expect(translations[hash(question.info!)]).toContain(
      "choose “I am not sure”",
    );
  });

  test.each([
    {
      situation: "all three conditions met",
      answer: "Ja",
      expected: "checked",
    },
    {
      situation: "maintained and screened but publicly accessible",
      answer: "Nein",
      expected: "unchecked",
    },
    {
      situation: "tenant-only access uncertain",
      answer: "Nicht sicher",
      expected: "maybe",
    },
  ] as const)("$situation: $expected", ({ answer, expected }) => {
    expect(states(answers({ [alias]: answer }))[merkmal]).toBe(expected);
  });

  test.each(["Nein", "Nicht sicher"] as const)(
    "keeps the positive question available when the negative answer is %s",
    (answer) => {
      const input = answers({ [negativeAlias]: answer, [alias]: "Ja" });
      expect(getVisibleQuestionAliases(input).has(alias)).toBe(true);
      expect(states(input)[merkmal]).toBe("checked");
      expect(states(input)[negativeMerkmal]).toBe(
        answer === "Nicht sicher" ? "maybe" : "unchecked",
      );
    },
  );

  test("an unkempt open rubbish area still checks the negative and hides the positive", () => {
    const input = answers({ [negativeAlias]: "Ja", [alias]: "Ja" });
    expect(getVisibleQuestionAliases(input).has(alias)).toBe(false);
    expect(states(input)[negativeMerkmal]).toBe("checked");
    expect(states(input)[merkmal]).toBe("unchecked");
  });

  test.each(ALL_VERTRAGSDATUM)(
    "availability follows the Mietspiegel year (%s)",
    (Vertragsdatum) => {
      const input = answers({
        Vertragsdatum: Vertragsdatum as FinalAnswers["Vertragsdatum"],
        [alias]: "Ja",
      });
      expect(getVisibleQuestionAliases(input).has(alias)).toBe(
        Vertragsdatum === "2015-2016",
      );
      if (Vertragsdatum !== "2015-2016")
        expect(states(input)).not.toHaveProperty(merkmal);
    },
  );

  // The 2015 clause has no Baujahr threshold.
  test.each([
    1918, 1919, 1949, 1950, 1964, 1965, 1972, 1973, 1985, 1986, 1990, 1991,
    2002, 2003, 2014,
  ])("requires the same answer for Baujahr %i", (Baujahr) => {
    const input = answers({ Baujahr, [alias]: "Ja" });
    expect(getVisibleQuestionAliases(input).has(alias)).toBe(true);
    expect(states(input)[merkmal]).toBe("checked");
  });
});
