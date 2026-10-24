import { ungroup } from "flow-machine";
import { describe, expect, test } from "vitest";

import { hash } from "~/l10n";

import EN from "../../public/locales/en.json";
import { getMerkmalStates } from "./api";
import { FinalAnswers, getVisibleQuestionAliases } from "./flow-machine";
import { evaluateFlowMachine } from "./flow-machine-evaluation";
import {
  MERKMAL_RESET_ANSWERS,
  SCHNELLTEST_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "./mappings/answer-reset";
import { ALL_VERTRAGSDATUM } from "./mappings/tests/merkmal-default-state";

const answersFor = (answers: FinalAnswers) => ({
  Typ: "Miete" as const,
  Mietart: "Normal" as const,
  Ausnahmen: "Keine" as const,
  ...SCHNELLTEST_RESET_ANSWERS,
  ...MERKMAL_RESET_ANSWERS,
  ...SONDERMERKMAL_RESET_ANSWERS,
  ...answers,
});

function questionsFor(answers: FinalAnswers) {
  return ungroup(evaluateFlowMachine(answersFor(answers)).steps).filter(
    (step) => step.type === "Question",
  );
}

describe("Waschbecken edition wording", () => {
  test.each(ALL_VERTRAGSDATUM)(
    "uses only the applicable definitions for %s",
    (Vertragsdatum) => {
      const questions = questionsFor({ Vertragsdatum } as FinalAnswers);
      const small = questions.filter(
        (q) => q.alias === "Bad nur kleines Waschbecken",
      );
      const large = questions.filter(
        (q) => q.alias === "Bad großes Waschbecken",
      );
      expect(small).toHaveLength(1);
      expect(large).toHaveLength(1);
      expect(small[0].text).toContain(
        Vertragsdatum === ">2026"
          ? "50 cm breit oder weniger"
          : "50x25cm oder kleiner",
      );
      expect(large[0].text.includes("nebeneinander")).toBe(
        Vertragsdatum === ">2026",
      );
      expect(large[0].text).toContain("Außenmaß mindestens 80 cm breit");
      expect(large[0].text).toContain("Doppelhandwaschbecken");
      if (Vertragsdatum === ">2026") {
        for (const q of [small[0], large[0]]) {
          expect(q.info).toContain("nicht auf Gäste-WCs");
          expect(
            EN.strings[hash(q.text) as keyof typeof EN.strings],
          ).toBeTruthy();
          expect(
            EN.strings[hash(q.text) as keyof typeof EN.strings],
          ).not.toContain("[DE]");
        }
        expect(
          EN.strings[hash(large[0].text) as keyof typeof EN.strings],
        ).toContain("side by side");
      }
    },
  );

  test("unsigned contracts use 2026 wording even with a stale contract period", () => {
    const questions = questionsFor({
      Unterschrieben: "Nein",
      Vertragsdatum: "2024-2026",
    } as FinalAnswers);
    expect(
      questions.find((q) => q.alias === "Bad nur kleines Waschbecken")?.text,
    ).toContain("50 cm breit oder weniger");
    expect(
      questions.find((q) => q.alias === "Bad großes Waschbecken")?.text,
    ).toContain("nebeneinander");
  });

  test.each(["Nein", "Nicht sicher"] as const)(
    "small-basin follow-up remains available after %s to missing basin",
    (answer) => {
      expect(
        questionsFor({
          Vertragsdatum: ">2026",
          "Bad & WC ohne Waschbecken": answer,
        } as FinalAnswers).filter(
          (q) => q.alias === "Bad nur kleines Waschbecken",
        ),
      ).toHaveLength(1);
    },
  );

  test("no-basin and no-bathroom paths retain their existing scope", () => {
    expect(
      questionsFor({
        Vertragsdatum: ">2026",
        "Bad & WC ohne Waschbecken": "Ja",
      } as FinalAnswers).some((q) => q.alias === "Bad nur kleines Waschbecken"),
    ).toBe(false);
    expect(
      questionsFor({
        Vertragsdatum: ">2026",
        "Badezimmer in Wohnung": "Nein",
      } as FinalAnswers).some((q) =>
        ["Bad nur kleines Waschbecken", "Bad großes Waschbecken"].includes(
          q.alias ?? "",
        ),
      ),
    ).toBe(false);
  });
});

// Dimensions are read by the person answering; the flow stores Ja/Nein/Nicht sicher.
test.each([
  { basin: "50×40 cm", answer: "Ja", expected: "checked" },
  { basin: "51×40 cm", answer: "Nein", expected: "unchecked" },
  { basin: "unknown width", answer: "Nicht sicher", expected: "maybe" },
] as const)("2026 small basin: $basin / $answer", ({ answer, expected }) => {
  const answers = answersFor({
    Vertragsdatum: ">2026",
    "Bad nur kleines Waschbecken": answer,
  } as FinalAnswers);
  expect(
    getMerkmalStates(answers, getVisibleQuestionAliases(answers))[
      "[Bad-] Bad ohne Handwaschbecken"
    ],
  ).toBe(expected);
});

test.each(["Ja", "Nein", "Nicht sicher"] as const)(
  "2026 large basin preserves %s mapping",
  (answer) => {
    const answers = answersFor({
      Vertragsdatum: ">2026",
      "Bad großes Waschbecken": answer,
    } as FinalAnswers);
    expect(
      getMerkmalStates(answers, getVisibleQuestionAliases(answers))[
        "[Bad+] Bad hat großes Waschbecken"
      ],
    ).toBe(
      { Ja: "checked", Nein: "unchecked", "Nicht sicher": "maybe" }[answer],
    );
  },
);
