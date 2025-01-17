import { expect, test } from "vitest";

import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/calculation/answer-reset";
import { getMerkmalStates } from "~/form/api";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";

import { MERKMAL_DEFAULT_STATE } from "./merkmal-default-state";

const allVertragsdatum = [
  "2015-2016",
  "2016-2018",
  "2018-2020",
  "2020-2022",
  "2022-2024",
  ">2024",
];

test.each([
  ...[
    ...allVertragsdatum.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Gebäude Hauseingangstür ist nicht abschließbar": "Ja",
      },
      expected: {
        "[Gebäude-] Gebäude Hauseingangstür ist nicht abschließbar": "checked",
      },
    })),
    ...allVertragsdatum.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Gebäude Hauseingangstür ist nicht abschließbar": "Nicht sicher",
      },
      expected: {
        "[Gebäude-] Gebäude Hauseingangstür ist nicht abschließbar": "maybe",
      },
    })),
    ...allVertragsdatum.map((vertragsdatum) => ({
      answers: {
        Vertragsdatum: vertragsdatum,
        "Gebäude Hauseingangstür ist nicht abschließbar": "Nein",
      },
      expected: {
        "[Gebäude-] Gebäude Hauseingangstür ist nicht abschließbar":
          "unchecked",
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
