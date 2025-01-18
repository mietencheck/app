import { expect, test } from "vitest";

import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/calculation/answer-reset";
import { getMerkmalStates } from "~/form/api";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";

import {
  ALL_VERTRAGSDATUM,
  MERKMAL_DEFAULT_STATE,
} from "./merkmal-default-state";

test.each([
  ...[
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad & WC ohne Waschbecken": "Ja",
      },
      expected: {
        "[Bad-] Bad ohne Handwaschbecken": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad & WC ohne Waschbecken": "Nicht sicher",
        "Bad nur kleines Waschbecken": "Ja",
      },
      expected: {
        "[Bad-] Bad ohne Handwaschbecken": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad & WC ohne Waschbecken": "Nicht sicher",
        "Bad nur kleines Waschbecken": "Nicht sicher",
      },
      expected: {
        "[Bad-] Bad ohne Handwaschbecken": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad & WC ohne Waschbecken": "Nicht sicher",
        "Bad nur kleines Waschbecken": "Nein",
      },
      expected: {
        "[Bad-] Bad ohne Handwaschbecken": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad & WC ohne Waschbecken": "Nein",
        "Bad nur kleines Waschbecken": "Ja",
      },
      expected: {
        "[Bad-] Bad ohne Handwaschbecken": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad & WC ohne Waschbecken": "Nein",
        "Bad nur kleines Waschbecken": "Nicht sicher",
      },
      expected: {
        "[Bad-] Bad ohne Handwaschbecken": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad & WC ohne Waschbecken": "Nein",
        "Bad nur kleines Waschbecken": "Nein",
      },
      expected: {
        "[Bad-] Bad ohne Handwaschbecken": "unchecked",
      },
    })),
  ].map(({ answers, expected }) => {
    return {
      answers: {
        Unterschrieben: "Ja",
        Baujahr: 1918,
        "Wohnung hat Sammelheizung": "Ja",
        "Badezimmer in Wohnung": "Ja",
        ...MERKMAL_RESET_ANSWERS,
        ...SONDERMERKMAL_RESET_ANSWERS,
        ...answers,
      } as FinalAnswers,
      expected: {
        ...MERKMAL_DEFAULT_STATE[
          answers.Vertragsdatum as keyof typeof MERKMAL_DEFAULT_STATE
        ],
        ...expected,
      },
    };
  }),
])("getMerkmalStates(%o)", ({ answers, expected }) => {
  expect(getMerkmalStates(answers, getVisibleQuestionAliases(answers))).toEqual(
    expected,
  );
});
