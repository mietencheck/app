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
        Baujahr: 1918,
        "Gebäude ist in gutem Zustand": "Ja",
      },
      expected: {
        "[Gebäude+] Gebäude ist in überdurchschnittlich gutem Instandhaltungszustand":
          "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        Baujahr: 1918,
        "Gebäude ist in gutem Zustand": "Nicht sicher",
      },
      expected: {
        "[Gebäude+] Gebäude ist in überdurchschnittlich gutem Instandhaltungszustand":
          "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        Baujahr: 1918,
        "Gebäude ist in gutem Zustand": "Nein",
      },
      expected: {
        "[Gebäude+] Gebäude ist in überdurchschnittlich gutem Instandhaltungszustand":
          "unchecked",
      },
    })),
    // Check if answer is ignored if Baujahr is > 2015
    {
      answers: {
        Vertragsdatum: "2024-2026",
        Baujahr: 2016,
        "Gebäude ist in gutem Zustand": "Ja",
      },
      expected: {
        "[Gebäude+] Gebäude ist in überdurchschnittlich gutem Instandhaltungszustand":
          "unchecked",
      },
    },
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
