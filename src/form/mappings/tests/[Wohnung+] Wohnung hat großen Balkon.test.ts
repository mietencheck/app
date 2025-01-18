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
        "Wohnung hat Balkon": "Ja",
        "Wohnung hat großen Balkon": "Ja",
      },
      expected: {
        "[Wohnung+] Wohnung hat großen Balkon": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Wohnung hat Balkon": "Ja",
        "Wohnung hat großen Balkon": "Nicht sicher",
      },
      expected: {
        "[Wohnung+] Wohnung hat großen Balkon": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Wohnung hat Balkon": "Ja",
        "Wohnung hat großen Balkon": "Nein",
      },
      expected: {
        "[Wohnung+] Wohnung hat großen Balkon": "unchecked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Wohnung hat Balkon": "Nicht sicher",
      },
      expected: {
        "[Wohnung+] Wohnung hat großen Balkon": "unchecked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Wohnung hat Balkon": "Nein",
      },
      expected: {
        "[Wohnung+] Wohnung hat großen Balkon": "unchecked",
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
