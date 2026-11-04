import { ungroup } from "flow-machine";
import { describe, expect, test } from "vitest";

import { hash } from "~/l10n";

import EN from "../../public/locales/en.json";
import { getMerkmalStates } from "./api";
import { FinalAnswers, flowMachine } from "./flow-machine-runtime";
import { MERKMAL_RESET_ANSWERS } from "./mappings/answer-reset";
import { vertragsdatumToMietspiegelJahrMapping } from "./mappings/vertragsdatum";
import { periodsFor } from "./verification/flow-paths";

const alias = "Wohnung ist barrierearm";
const merkmal = "[Wohnung+] Wohnugn ist barrierearm";
const base: FinalAnswers = {
  ...MERKMAL_RESET_ANSWERS,
  Typ: "Miete",
  Unterschrieben: "Ja",
  Mietart: "Normal",
  Wohnlage: "mittel",
  Ost: false,
  Qm: 60,
  "Wohnung hat Sammelheizung": "Ja",
  "Badezimmer in Wohnung": "Ja",
};

function evaluate(answers: FinalAnswers) {
  const steps = ungroup(flowMachine.run(flowMachine.answers(answers).state));
  const questions = steps.filter((step) => step.type === "Question");
  const barrierearm = questions.filter((question) => question.alias === alias);
  expect(barrierearm).toHaveLength(1);
  return {
    question: barrierearm[0],
    state: getMerkmalStates(
      answers,
      new Set(questions.map((question) => question.alias!)),
    )[merkmal],
  };
}

for (const [vertragsdatum, jahr] of Object.entries(
  vertragsdatumToMietspiegelJahrMapping,
)) {
  if (!jahr) continue;
  describe(`Mietspiegel ${jahr}`, () => {
    // This Merkmal has no Baujahr restriction. Exercise each edition's actual
    // construction-period boundaries so unrelated gates cannot hide it.
    const baujahre = [
      ...new Set(
        periodsFor(jahr)
          .filter(({ from }) => from <= 2014)
          .flatMap(({ from, to }) => [
            Math.max(from, 1918),
            Math.min(to, 2014),
          ]),
      ),
    ];
    test.each(baujahre)("Baujahr %s: guidance and answer states", (Baujahr) => {
      for (const [answer, expected] of [
        ["Ja", "checked"],
        ["Nein", "unchecked"],
        ["Nicht sicher", "maybe"],
      ] as const) {
        const { question, state } = evaluate({
          ...base,
          Vertragsdatum: vertragsdatum as FinalAnswers["Vertragsdatum"],
          Baujahr,
          [alias]: answer,
        });
        expect(state).toBe(expected);
        const strings: Record<string, string> = EN.strings;
        const english = strings[hash(question.info!)];
        expect(english).toBeTruthy();
        expect(english).not.toContain("[DE]");
        if (jahr === "2026") {
          expect(question.info).toBe(
            "Alle drei Bedingungen müssen erfüllt sein: Die Wohnung ist schwellenfrei, der Übergang zu Balkon oder Terrasse ist schwellenarm und in der Wohnung ist ausreichend Bewegungsfläche vorhanden.",
          );
          expect(english).toBe(
            "All three conditions must be met: the apartment has no thresholds, the transition to the balcony or terrace has a low threshold, and there is sufficient space to move around in the apartment.",
          );
        } else {
          // A + B + (C or D), including both C and D, rather than all four
          // or a bathroom alone. AG Mitte 8 C 166/24, Rn. 34.
          expect(question.info).toBe(
            "Die Wohnung muss schwellenfrei sein und der Übergang zu Balkon oder Terrasse muss schwellenarm sein. Zusätzlich muss mindestens eine der beiden Bedingungen erfüllt sein: ausreichende Bewegungsfreiheit in der Wohnung oder barrierearme Badgestaltung. Beide zusammen erfüllen die Bedingung ebenfalls.",
          );
          expect(english).toBe(
            "The apartment must have no thresholds, and the transition to the balcony or terrace must have a low threshold. In addition, at least one of these two conditions must be met: sufficient freedom of movement in the apartment or a bathroom designed to reduce barriers. Meeting both conditions also qualifies.",
          );
        }
      }
    });
  });
}

test.each(["Ja", "Nein", "Nicht sicher"] as const)(
  "2026: other bathroom answers cannot override barrierearm = %s",
  (answer) => {
    // The questionnaire keeps one user assessment; it does not collect the
    // individual accessibility conditions. Other bathroom Merkmale must not
    // become additional requirements for this assessment.
    for (const bad of ["Ja", "Nein", "Nicht sicher"] as const) {
      expect(
        evaluate({
          ...base,
          Vertragsdatum: ">2026",
          Baujahr: 1930,
          [alias]: answer,
          "Bad hat bodengleiche Dusche": bad,
          "Bad mit hochwertiger Ausstattung": bad,
        }).state,
      ).toBe(
        answer === "Ja" ? "checked" : answer === "Nein" ? "unchecked" : "maybe",
      );
    }
  },
);

test("the Mieterhöhung questionnaire retains its existing question", () => {
  const { question } = evaluate({
    ...base,
    Typ: "Mieterhöhung",
    Vertragsdatum: ">2026",
    Baujahr: 1930,
    [alias]: "Ja",
  });
  expect(question.id).toBe("2hckt");
  expect(question.info).toBe(
    "Dies ist erfüllt, wenn Wohnung schwellenfrei ist, der Übergang zu Balkon oder Dachterasse schwellenarm ist, ausreichende Bewegungsfreiheit in Wohnung gegeben ist, und das Bad barreierearm gestaltet ist.",
  );
});
