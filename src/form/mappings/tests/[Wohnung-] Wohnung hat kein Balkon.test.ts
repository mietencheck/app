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
        "Wohnung hat Balkon": "Ja",
      },
      expected: {
        "[Wohnung-] Wohnung hat kein Balkon": "unchecked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Wohnung hat Balkon": "Nicht sicher",
        "Wohnung keinen Balkon weil unmöglich": "Ja",
      },
      expected: {
        "[Wohnung-] Wohnung hat kein Balkon": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Wohnung hat Balkon": "Nicht sicher",
        "Wohnung keinen Balkon weil unmöglich": "Nicht sicher",
      },
      expected: {
        "[Wohnung-] Wohnung hat kein Balkon": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Wohnung hat Balkon": "Nicht sicher",
        "Wohnung keinen Balkon weil unmöglich": "Nein",
      },
      expected: {
        "[Wohnung-] Wohnung hat kein Balkon": "unchecked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Wohnung hat Balkon": "Nein",
        "Wohnung keinen Balkon weil unmöglich": "Ja",
      },
      expected: {
        "[Wohnung-] Wohnung hat kein Balkon": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Wohnung hat Balkon": "Nein",
        "Wohnung keinen Balkon weil unmöglich": "Nicht sicher",
      },
      expected: {
        "[Wohnung-] Wohnung hat kein Balkon": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Wohnung hat Balkon": "Nein",
        "Wohnung keinen Balkon weil unmöglich": "Nein",
      },
      expected: {
        "[Wohnung-] Wohnung hat kein Balkon": "unchecked",
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
