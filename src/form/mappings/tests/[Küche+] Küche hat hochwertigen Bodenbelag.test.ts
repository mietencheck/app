import { expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import {
  MERKMAL_RESET_ANSWERS,
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
        Baujahr: 2009,
        "Küche hat hochwertigen Fußboden": "Ja",
      },
      expected: {
        "[Küche+] Küche hat hochwertigen Bodenbelag": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        Baujahr: 2009,
        "Küche hat hochwertigen Fußboden": "Nicht sicher",
      },
      expected: {
        "[Küche+] Küche hat hochwertigen Bodenbelag": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        Baujahr: 2009,
        "Küche hat hochwertigen Fußboden": "Nein",
      },
      expected: {
        "[Küche+] Küche hat hochwertigen Bodenbelag": "unchecked",
      },
    })),
    {
      answers: {
        Vertragsdatum: "2024-2026",
        Baujahr: 2010,
        "Küche hat hochwertigen Fußboden": "Ja",
      },
      expected: {
        "[Küche+] Küche hat hochwertigen Bodenbelag": "unchecked",
      },
    },
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
