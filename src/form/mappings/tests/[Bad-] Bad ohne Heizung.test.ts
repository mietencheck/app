import { expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import {
  MERKMAL_RESET_ANSWERS,
  SCHNELLTEST_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";

import {
  ALL_VERTRAGSDATUM,
  MERKMAL_DEFAULT_STATE,
} from "./merkmal-default-state";

test.each([
  ...[
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad ohne Heizung": "Ja",
      },
      expected: {
        "[Bad-] Bad ohne Heizung": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad ohne Heizung": "Nicht sicher",
        "Bad mit alter Heizung": "Ja",
      },
      expected: {
        "[Bad-] Bad ohne Heizung": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad ohne Heizung": "Nicht sicher",
        "Bad mit alter Heizung": "Nicht sicher",
      },
      expected: {
        "[Bad-] Bad ohne Heizung": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad ohne Heizung": "Nicht sicher",
        "Bad mit alter Heizung": "Nein",
      },
      expected: {
        "[Bad-] Bad ohne Heizung": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad ohne Heizung": "Nein",
        "Bad mit alter Heizung": "Ja",
      },
      expected: {
        "[Bad-] Bad ohne Heizung": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad ohne Heizung": "Nein",
        "Bad mit alter Heizung": "Nicht sicher",
      },
      expected: {
        "[Bad-] Bad ohne Heizung": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad ohne Heizung": "Nein",
        "Bad mit alter Heizung": "Nein",
      },
      expected: {
        "[Bad-] Bad ohne Heizung": "unchecked",
      },
    })),
  ].map(({ answers, expected }) => {
    return {
      answers: {
        ...SCHNELLTEST_RESET_ANSWERS,
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
