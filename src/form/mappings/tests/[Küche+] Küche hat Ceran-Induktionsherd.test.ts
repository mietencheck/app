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
        "Küche hat Ceran-/Induktionsherd": "Ja",
      },
      expected: {
        "[Küche+] Küche hat Ceran-/Induktionsherd": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        Baujahr: 1918,
        "Küche hat Ceran-/Induktionsherd": "Nicht sicher",
      },
      expected: {
        "[Küche+] Küche hat Ceran-/Induktionsherd": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        Baujahr: 1918,
        "Küche hat Ceran-/Induktionsherd": "Nein",
      },
      expected: {
        "[Küche+] Küche hat Ceran-/Induktionsherd": "unchecked",
      },
    })),
    //  Check if answer is ignored if 'Sondermerkmal Moderne Küche' is 'Ja'
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1918,
        "Sondermerkmal Moderne Küche": "Ja",
        "Küche hat Ceran-/Induktionsherd": "Ja",
      },
      expected: {
        "[Küche+] Küche hat Ceran-/Induktionsherd": "unchecked",
      },
    },
    // Check if answer is ignored if Baujahr is > 2001
    {
      answers: {
        Vertragsdatum: "2024-2026",
        Baujahr: 2002,
        "Küche hat Ceran-/Induktionsherd": "Ja",
      },
      expected: {
        "[Küche+] Küche hat Ceran-/Induktionsherd": "unchecked",
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
