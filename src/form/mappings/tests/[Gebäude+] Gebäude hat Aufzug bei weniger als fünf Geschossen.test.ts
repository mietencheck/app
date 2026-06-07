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
        "Gebäude hat Fahrstuhl": "Ja",
        "Gebäude hat <5 Stockwerke und Fahrstuhl": "Ja",
      },
      expected: {
        "[Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen":
          "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Gebäude hat Fahrstuhl": "Nicht sicher",
        "Gebäude hat <5 Stockwerke und Fahrstuhl": "Ja",
      },
      expected: {
        "[Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen":
          "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Gebäude hat Fahrstuhl": "Nicht sicher",
        "Gebäude hat <5 Stockwerke und Fahrstuhl": "Nicht sicher",
      },
      expected: {
        "[Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen":
          "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Gebäude hat Fahrstuhl": "Nicht sicher",
        "Gebäude hat <5 Stockwerke und Fahrstuhl": "Nein",
      },
      expected: {
        "[Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen":
          "unchecked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Gebäude hat Fahrstuhl": "Nein",
      },
      expected: {
        "[Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen":
          "unchecked",
      },
    })),
    // Sondermerkmal Aufzug
    {
      answers: {
        Vertragsdatum: "2015-2016",
        "Sondermerkmal Aufzug": "Ja",
        "Gebäude hat Fahrstuhl": "Nein",
      },
      expected: {
        "[Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen":
          "unchecked",
      },
    },
  ].map(({ answers, expected }) => {
    return {
      answers: {
        ...SCHNELLTEST_RESET_ANSWERS,
        Baujahr: 1918,
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
