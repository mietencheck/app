import { expect, test } from "vitest";

import { hash } from "~/l10n";

import EN from "../../../public/locales/en.json";
import { getMerkmalStates } from "../api";
import type { FinalAnswers } from "../flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "../mappings/answer-reset";
import {
  BASE_ANSWERS,
  contractScenarios,
  evaluateAnswers,
  questionNodeById,
} from "./flow-paths";

const poor = "Gebäude hat Treppenhaus in schlechtem Zustand";
const good = "Gebäude hat Treppenhaus in gutem Zustand";
const negative =
  "[Gebäude-] Gebäude Treppenbereich/Eingangsbereich in schlechtem Zustand";
const positive = "[Gebäude+] Gebäude hat hochwertigen Eingangsbereich";
const options = ["Ja", "Nein", "Nicht sicher"] as const;
const states = { Ja: "checked", Nein: "unchecked", "Nicht sicher": "maybe" };

function evaluate(
  pinned: Record<string, unknown>,
  answers: Record<string, unknown>,
) {
  const evaluation = evaluateAnswers({
    ...BASE_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    ...pinned,
    Baujahr: 1918,
    ...answers,
  });
  expect(evaluation.lastStep?.type).not.toBe("Exit");
  return {
    ...evaluation,
    states: getMerkmalStates(
      evaluation.answers as FinalAnswers,
      evaluation.visible,
    ),
    question(alias: string) {
      return questionNodeById.get(evaluation.nodeIds.get(alias)!)!;
    },
  };
}

const scenarios = contractScenarios();
const recent = scenarios.filter(({ jahr }) => Number(jahr) >= 2024);
const older = scenarios.filter(({ jahr }) => Number(jahr) < 2024);

// The joint questions collect the user's assessment of both areas. Assert the
// displayed rule as well as the states produced by the corresponding answers.
test.each(recent)(
  "$label: both areas are required in both variants",
  ({ pinned }) => {
    const result = evaluate(pinned, { [poor]: "Nein" });
    expect(result.question(poor).text).toContain(
      "sowohl das Treppenhaus als auch der Eingangsbereich jeweils überwiegend",
    );
    expect(result.question(poor).info).toContain(
      "Ist nur einer der beiden Bereiche überwiegend in schlechtem Zustand, antworte mit „Nein“",
    );
    expect(result.question(good).text).toContain(
      "Treppenhaus und der Eingangsbereich",
    );
    expect(result.question(good).info).toContain(
      "Beide Bereiche müssen hochwertig saniert oder repräsentativ sein",
    );
    expect(result.question(good).info).toContain(
      "Erfüllt nur einer der beiden Bereiche diese Anforderungen, antworte mit „Nein“",
    );
  },
);

const conditions = [
  { condition: "both predominantly poor", poor: "Ja", good: "Nein" },
  {
    condition: "only stairwell predominantly poor",
    poor: "Nein",
    good: "Nein",
  },
  { condition: "only entrance predominantly poor", poor: "Nein", good: "Nein" },
  {
    condition: "poor stairwell, representative entrance",
    poor: "Nein",
    good: "Nein",
  },
  {
    condition: "representative stairwell, poor entrance",
    poor: "Nein",
    good: "Nein",
  },
  { condition: "both merely in good condition", poor: "Nein", good: "Nein" },
  { condition: "both renovated to a high standard", poor: "Nein", good: "Ja" },
];

test.each(recent.flatMap((s) => conditions.map((c) => ({ ...s, ...c }))))(
  "$label: $condition",
  ({ pinned, poor: poorAnswer, good: goodAnswer }) => {
    const result = evaluate(pinned, { [poor]: poorAnswer, [good]: goodAnswer });
    expect(result.states[negative]).toBe(
      states[poorAnswer as keyof typeof states],
    );
    expect(result.states[positive]).toBe(
      states[goodAnswer as keyof typeof states],
    );
    expect(result.visible.has(good)).toBe(poorAnswer !== "Ja");
  },
);

test.each(
  scenarios.flatMap((s) =>
    options.flatMap((poorAnswer) =>
      options.map((goodAnswer) => ({ ...s, poorAnswer, goodAnswer })),
    ),
  ),
)(
  "$label: poor=$poorAnswer, positive=$goodAnswer",
  ({ pinned, poorAnswer, goodAnswer }) => {
    const result = evaluate(pinned, { [poor]: poorAnswer, [good]: goodAnswer });
    expect(result.states[negative]).toBe(states[poorAnswer]);
    expect(result.visible.has(good)).toBe(poorAnswer !== "Ja");
    expect(result.states[positive]).toBe(
      poorAnswer === "Ja" ? "unchecked" : states[goodAnswer],
    );
  },
);

test.each(older)("$jahr: retains the source's slash wording", ({ pinned }) => {
  const result = evaluate(pinned, { [poor]: "Nein" });
  expect(result.question(poor).text).toBe(
    "Ist Treppenhaus/Eingangsbereich überwiegend in schlechtem Zustand?",
  );
  expect(result.question(good).text).toBe(
    "Ist Eingangsbereich/Treppenhaus hochwertig saniert oder repräsentativ?",
  );
});

test.each(
  scenarios.flatMap((s) =>
    [1918, 1949, 1950, 1990, 1991, 2009, 2010].map((baujahr) => ({
      ...s,
      baujahr,
    })),
  ),
)(
  "$label, Baujahr $baujahr: no unrelated Baujahr gate",
  ({ pinned, baujahr }) => {
    const result = evaluate(pinned, {
      Baujahr: baujahr,
      [poor]: "Nein",
      [good]: "Ja",
    });
    expect(result.visible.has(poor)).toBe(true);
    expect(result.visible.has(good)).toBe(true);
    expect(result.states[positive]).toBe("checked");
  },
);

test.each(scenarios)(
  "$label: English copy covers the visible questions",
  ({ pinned }) => {
    const result = evaluate(pinned, { [poor]: "Nein" });
    for (const alias of [poor, good]) {
      const question = result.question(alias);
      for (const text of [question.text, question.info].filter(Boolean)) {
        const key = hash(text!);
        const translation = (EN.strings as Record<string, string>)[key];
        expect(translation).toBeTruthy();
        expect(translation).not.toContain("[DE]");
      }
    }
    if (result.question(poor).id === "te71poor") {
      const translations = EN.strings as Record<string, string>;
      expect(translations[hash(result.question(poor).text)]).toContain("both");
      expect(translations[hash(result.question(poor).text)]).toContain(
        "each predominantly",
      );
      expect(translations[hash(result.question(good).info!)]).toContain(
        "Both areas must",
      );
    }
  },
);
