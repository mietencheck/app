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
        Baujahr: 1918,
        "Sondermerkmal Dusche Und Badewanne": "Ja",
      },
      expected: {
        "[Sondermerkmal] Von der Badewanne getrennte Dusche": "checked",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1918,
        "Sondermerkmal Dusche Und Badewanne": "Nicht sicher",
      },
      expected: {
        "[Sondermerkmal] Von der Badewanne getrennte Dusche": "maybe",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1918,
        "Sondermerkmal Dusche Und Badewanne": "Nein",
      },
      expected: {
        "[Sondermerkmal] Von der Badewanne getrennte Dusche": "unchecked",
      },
    },
    // Check if answer is ignored for Baujahr when no Sondermerkmal Aufschlag is defined
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1965,
        "Sondermerkmal Dusche Und Badewanne": "Ja",
      },
      expected: {
        "[Sondermerkmal] Von der Badewanne getrennte Dusche": "unchecked",
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
