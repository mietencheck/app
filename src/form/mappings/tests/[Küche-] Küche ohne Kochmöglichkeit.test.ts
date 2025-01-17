import { expect, test } from "vitest";

import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/calculation/answer-reset";
import { getMerkmalStates } from "~/form/api";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";

import { MERKMAL_DEFAULT_STATE } from "./merkmal-default-state";

const allVertragsdatum = [
  "2015-2016",
  "2016-2018",
  "2018-2020",
  "2020-2022",
  "2022-2024",
  ">2024",
];

test.each([
  ...[
    ...allVertragsdatum.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Küche hat Kochmöglichkeit": "Ja",
        "Küche hat Gas/Elektroherd ohne Backofen": "Ja",
      },
      expected: {
        "[Küche-] Küche ohne Kochmöglichkeit": "checked",
      },
    })),
    ...allVertragsdatum.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Küche hat Kochmöglichkeit": "Ja",
        "Küche hat Gas/Elektroherd ohne Backofen": "Nicht sicher",
      },
      expected: {
        "[Küche-] Küche ohne Kochmöglichkeit": "maybe",
      },
    })),
    ...allVertragsdatum.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Küche hat Kochmöglichkeit": "Ja",
        "Küche hat Gas/Elektroherd ohne Backofen": "Nein",
      },
      expected: {
        "[Küche-] Küche ohne Kochmöglichkeit": "unchecked",
      },
    })),
    ...allVertragsdatum.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Küche hat Kochmöglichkeit": "Nicht sicher",
        "Küche hat Gas/Elektroherd ohne Backofen": "Ja",
      },
      expected: {
        "[Küche-] Küche ohne Kochmöglichkeit": "maybe",
      },
    })),
    ...allVertragsdatum.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Küche hat Kochmöglichkeit": "Nicht sicher",
        "Küche hat Gas/Elektroherd ohne Backofen": "Nicht sicher",
      },
      expected: {
        "[Küche-] Küche ohne Kochmöglichkeit": "maybe",
      },
    })),
    ...allVertragsdatum.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Küche hat Kochmöglichkeit": "Nicht sicher",
        "Küche hat Gas/Elektroherd ohne Backofen": "Nein",
      },
      expected: {
        "[Küche-] Küche ohne Kochmöglichkeit": "maybe",
      },
    })),
  ].map(({ answers, expected }) => {
    return {
      answers: {
        Unterschrieben: "Ja",
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
