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
        "Bad größer als 4qm": "Ja",
      },
      expected: {
        "[Bad-] Bad ist klein": "unchecked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad größer als 4qm": "Nicht sicher",
      },
      expected: {
        "[Bad-] Bad ist klein": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Bad größer als 4qm": "Nein",
      },
      expected: {
        "[Bad-] Bad ist klein": "checked",
      },
    })),
    // Check if answer is ignored when Sondermerkmal Badezimmer Klein is checked
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1991,
        "Sondermerkmal Badezimmer Klein": "Nein",
        "Bad größer als 4qm": "Nein",
      },
      expected: {
        "[Bad-] Bad ist klein": "unchecked",
      },
    },
    // Check if answer is ignored when when BaujahrSpanne is '1973-1990 Ost'
    ...[
      "2016-2018",
      "2018-2020",
      "2020-2022",
      "2022-2024",
      "2024-2026",
      ">2026",
    ].map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        Baujahr: 1973,
        Ost: true,
        "Bad größer als 4qm": "Nein",
      },
      expected: {
        "[Bad-] Bad ist klein": "unchecked",
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
