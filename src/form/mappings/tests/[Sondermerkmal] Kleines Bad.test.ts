import { expect, test } from "vitest";

import { getSondermerkmalStates } from "~/form/api";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import {
  SCHNELLTEST_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";

import { SONDERMERKMAL_DEFAULT_STATE } from "./merkmal-default-state";

test.each([
  ...[
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1991,
        "Sondermerkmal Badezimmer Klein": "Nein",
      },
      expected: {
        "[Sondermerkmal] Kleines Bad": "checked",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1991,
        "Sondermerkmal Badezimmer Klein": "Nicht sicher",
      },
      expected: {
        "[Sondermerkmal] Kleines Bad": "maybe",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1991,
        "Sondermerkmal Badezimmer Klein": "Nein",
      },
      expected: {
        "[Sondermerkmal] Kleines Bad": "checked",
      },
    },
    // Check if answer is ignored for Baujahr when no Sondermerkmal Aufschlag is defined
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1918,
        "Sondermerkmal Badezimmer Klein": "Nein",
      },
      expected: {
        "[Sondermerkmal] Kleines Bad": "unchecked",
      },
    },
  ].map(({ answers, expected }) => {
    return {
      answers: {
        ...SCHNELLTEST_RESET_ANSWERS,
        ...SONDERMERKMAL_RESET_ANSWERS,
        ...answers,
      } as FinalAnswers,
      expected: {
        ...SONDERMERKMAL_DEFAULT_STATE,
        ...expected,
      },
    };
  }),
])("getMerkmalStates(%o)", ({ answers, expected }) => {
  expect(
    getSondermerkmalStates(answers, getVisibleQuestionAliases(answers)),
  ).toEqual(expected);
});
