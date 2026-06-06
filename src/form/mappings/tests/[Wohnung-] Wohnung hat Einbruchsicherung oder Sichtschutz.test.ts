import { expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";

import { MERKMAL_DEFAULT_STATE } from "./merkmal-default-state";

test.each([
  ...[
    {
      answers: {
        Vertragsdatum: ">2026",
        "Wohnung im Erdgeschoss": "Ja",
        "Wohnung hat Einbruchsicherung oder Sichtschutz": "Nein",
      },
      expected: {
        "[Wohnung-] Kein Einbruch- oder Sichtschutz bei Erdgeschosswohnung":
          "checked",
      },
    },
    {
      answers: {
        Vertragsdatum: ">2026",
        "Wohnung im Erdgeschoss": "Ja",
        "Wohnung hat Einbruchsicherung oder Sichtschutz": "Nicht sicher",
      },
      expected: {
        "[Wohnung-] Kein Einbruch- oder Sichtschutz bei Erdgeschosswohnung":
          "maybe",
      },
    },
    {
      answers: {
        Vertragsdatum: ">2026",
        "Wohnung im Erdgeschoss": "Ja",
        "Wohnung hat Einbruchsicherung oder Sichtschutz": "Ja",
      },
      expected: {
        "[Wohnung-] Kein Einbruch- oder Sichtschutz bei Erdgeschosswohnung":
          "unchecked",
      },
    },
    {
      answers: {
        Vertragsdatum: ">2026",
        "Wohnung im Erdgeschoss": "Nicht sicher",
        "Wohnung hat Einbruchsicherung oder Sichtschutz": "Ja",
      },
      expected: {
        "[Wohnung-] Kein Einbruch- oder Sichtschutz bei Erdgeschosswohnung":
          "unchecked",
      },
    },
    {
      answers: {
        Vertragsdatum: ">2026",
        "Wohnung im Erdgeschoss": "Nicht sicher",
        "Wohnung hat Einbruchsicherung oder Sichtschutz": "Nicht sicher",
      },
      expected: {
        "[Wohnung-] Kein Einbruch- oder Sichtschutz bei Erdgeschosswohnung":
          "maybe",
      },
    },
    {
      answers: {
        Vertragsdatum: ">2026",
        "Wohnung im Erdgeschoss": "Nicht sicher",
        "Wohnung hat Einbruchsicherung oder Sichtschutz": "Nicht sicher",
      },
      expected: {
        "[Wohnung-] Kein Einbruch- oder Sichtschutz bei Erdgeschosswohnung":
          "maybe",
      },
    },
    {
      answers: {
        Vertragsdatum: ">2026",
        "Wohnung im Erdgeschoss": "Nein",
      },
      expected: {
        "[Wohnung-] Kein Einbruch- oder Sichtschutz bei Erdgeschosswohnung":
          "unchecked",
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
