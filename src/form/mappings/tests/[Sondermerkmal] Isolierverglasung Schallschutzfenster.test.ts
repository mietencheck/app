import { expect, test } from "vitest";

import { getSondermerkmalStates } from "~/form/api";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import { SONDERMERKMAL_RESET_ANSWERS } from "~/form/mappings/answer-reset";

import { SONDERMERKMAL_DEFAULT_STATE } from "./merkmal-default-state";

test.each([
  ...[
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1918,
        "Sondermerkmal Schallschutzfenster": "Ja",
      },
      expected: {
        "[Sondermerkmal] Isolierverglasung/Schallschutzfenster": "checked",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1918,
        "Sondermerkmal Schallschutzfenster": "Nicht sicher",
      },
      expected: {
        "[Sondermerkmal] Isolierverglasung/Schallschutzfenster": "maybe",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1918,
        "Sondermerkmal Schallschutzfenster": "Nein",
      },
      expected: {
        "[Sondermerkmal] Isolierverglasung/Schallschutzfenster": "unchecked",
      },
    },
    // Check if answer is ignored for Baujahr when no Sondermerkmal Aufschlag is defined
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1965,
        "Sondermerkmal Schallschutzfenster": "Ja",
      },
      expected: {
        "[Sondermerkmal] Isolierverglasung/Schallschutzfenster": "unchecked",
      },
    },
  ].map(({ answers, expected }) => {
    return {
      answers: {
        Unterschrieben: "Ja",
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
