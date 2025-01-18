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
        "Mehrere WCs": "Ja",
      },
      expected: {
        "[Bad+] Zweites WC oder Bad/WC getrennt": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Mehrere WCs": "Nicht sicher",
        "Getrenntes WC": "Ja",
      },
      expected: {
        "[Bad+] Zweites WC oder Bad/WC getrennt": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Mehrere WCs": "Nicht sicher",
        "Getrenntes WC": "Nicht sicher",
      },
      expected: {
        "[Bad+] Zweites WC oder Bad/WC getrennt": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Mehrere WCs": "Nicht sicher",
        "Getrenntes WC": "Nein",
      },
      expected: {
        "[Bad+] Zweites WC oder Bad/WC getrennt": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Mehrere WCs": "Nein",
        "Getrenntes WC": "Ja",
      },
      expected: {
        "[Bad+] Zweites WC oder Bad/WC getrennt": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Mehrere WCs": "Nein",
        "Getrenntes WC": "Nicht sicher",
      },
      expected: {
        "[Bad+] Zweites WC oder Bad/WC getrennt": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Mehrere WCs": "Nein",
        "Getrenntes WC": "Nein",
      },
      expected: {
        "[Bad+] Zweites WC oder Bad/WC getrennt": "unchecked",
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
