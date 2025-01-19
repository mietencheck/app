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
        "Duschen nur in freistehender Badewanne": "Ja",
        "Duschen nur in freistehender Badewanne in nicht modernisiertem Bad":
          "Ja",
      },
      expected: {
        "[Bad-] Bad ohne separate Dusche mit frei stehender Wanne": "checked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Duschen nur in freistehender Badewanne": "Ja",
        "Duschen nur in freistehender Badewanne in nicht modernisiertem Bad":
          "Nicht sicher",
      },
      expected: {
        "[Bad-] Bad ohne separate Dusche mit frei stehender Wanne": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Duschen nur in freistehender Badewanne": "Ja",
        "Duschen nur in freistehender Badewanne in nicht modernisiertem Bad":
          "Nein",
      },
      expected: {
        "[Bad-] Bad ohne separate Dusche mit frei stehender Wanne": "unchecked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Duschen nur in freistehender Badewanne": "Nicht sicher",
        "Duschen nur in freistehender Badewanne in nicht modernisiertem Bad":
          "Ja",
      },
      expected: {
        "[Bad-] Bad ohne separate Dusche mit frei stehender Wanne": "maybe",
      },
    })),

    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Duschen nur in freistehender Badewanne": "Nicht sicher",
        "Duschen nur in freistehender Badewanne in nicht modernisiertem Bad":
          "Nicht sicher",
      },
      expected: {
        "[Bad-] Bad ohne separate Dusche mit frei stehender Wanne": "maybe",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Duschen nur in freistehender Badewanne": "Nicht sicher",
        "Duschen nur in freistehender Badewanne in nicht modernisiertem Bad":
          "Nein",
      },
      expected: {
        "[Bad-] Bad ohne separate Dusche mit frei stehender Wanne": "unchecked",
      },
    })),
    ...ALL_VERTRAGSDATUM.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Duschen nur in freistehender Badewanne": "Nein",
      },
      expected: {
        "[Bad-] Bad ohne separate Dusche mit frei stehender Wanne": "unchecked",
      },
    })),
  ].map(({ answers, expected }) => {
    return {
      answers: {
        Unterschrieben: "Ja",
        Baujahr: 1918,
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
