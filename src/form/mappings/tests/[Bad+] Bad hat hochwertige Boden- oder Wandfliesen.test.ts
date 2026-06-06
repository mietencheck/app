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
        Baujahr: 1900,
        "Bad Boden und Wand hochwertig": "Ja",
      },
      expected: {
        "[Bad+] Bad hat hochwertige Boden- oder Wandfliesen": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        Baujahr: 1900,
        "Bad Boden und Wand hochwertig": "Nicht sicher",
      },
      expected: {
        "[Bad+] Bad hat hochwertige Boden- oder Wandfliesen": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        Baujahr: 1900,
        "Bad Boden und Wand hochwertig": "Nein",
      },
      expected: {
        "[Bad+] Bad hat hochwertige Boden- oder Wandfliesen": "unchecked",
      },
    })),
    {
      answers: {
        Vertragsdatum: "2024-2026",
        Baujahr: 2018,
        "Bad Boden und Wand hochwertig": "Ja",
      },
      expected: {
        "[Bad+] Bad hat hochwertige Boden- oder Wandfliesen": "unchecked",
      },
    },
    {
      answers: {
        Vertragsdatum: ">2026",
        Baujahr: 2018,
        "Bad Boden und Wand hochwertig": "Ja",
      },
      expected: {
        "[Bad+] Bad hat hochwertige Boden- oder Wandfliesen": "unchecked",
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
