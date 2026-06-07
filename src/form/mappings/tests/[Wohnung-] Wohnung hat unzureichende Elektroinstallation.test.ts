import { expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import {
  MERKMAL_RESET_ANSWERS,
  SCHNELLTEST_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";

import { MERKMAL_DEFAULT_STATE } from "./merkmal-default-state";

test.each([
  ...[
    {
      answers: {
        Vertragsdatum: "2015-2016",
        "Wohnung hat ausreichende Elektroinstallation": "Ja",
        "Wohnung hat Raum mit <2 Steckdosen": "Ja",
      },
      expected: {
        "[Wohnung-] Wohnung hat unzureichende Elektroinstallation": "checked",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        "Wohnung hat ausreichende Elektroinstallation": "Ja",
        "Wohnung hat Raum mit <2 Steckdosen": "Nicht sicher",
      },
      expected: {
        "[Wohnung-] Wohnung hat unzureichende Elektroinstallation": "maybe",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        "Wohnung hat ausreichende Elektroinstallation": "Ja",
        "Wohnung hat Raum mit <2 Steckdosen": "Nein",
      },
      expected: {
        "[Wohnung-] Wohnung hat unzureichende Elektroinstallation": "unchecked",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        "Wohnung hat ausreichende Elektroinstallation": "Nicht sicher",
        "Wohnung hat Raum mit <2 Steckdosen": "Ja",
      },
      expected: {
        "[Wohnung-] Wohnung hat unzureichende Elektroinstallation": "checked",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        "Wohnung hat ausreichende Elektroinstallation": "Nicht sicher",
        "Wohnung hat Raum mit <2 Steckdosen": "Nicht sicher",
      },
      expected: {
        "[Wohnung-] Wohnung hat unzureichende Elektroinstallation": "maybe",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        "Wohnung hat ausreichende Elektroinstallation": "Nein",
        "Wohnung hat Raum mit <2 Steckdosen": "Ja",
      },
      expected: {
        "[Wohnung-] Wohnung hat unzureichende Elektroinstallation": "checked",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        "Wohnung hat ausreichende Elektroinstallation": "Nein",
        "Wohnung hat Raum mit <2 Steckdosen": "Nicht sicher",
      },
      expected: {
        "[Wohnung-] Wohnung hat unzureichende Elektroinstallation": "checked",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        "Wohnung hat ausreichende Elektroinstallation": "Nein",
        "Wohnung hat Raum mit <2 Steckdosen": "Nein",
      },
      expected: {
        "[Wohnung-] Wohnung hat unzureichende Elektroinstallation": "checked",
      },
    },

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
        "Wohnung hat ausreichende Elektroinstallation": "Ja",
      },
      expected: {
        "[Wohnung-] Wohnung hat unzureichende Elektroinstallation": "unchecked",
      },
    })),
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
        "Wohnung hat ausreichende Elektroinstallation": "Nicht sicher",
      },
      expected: {
        "[Wohnung-] Wohnung hat unzureichende Elektroinstallation": "maybe",
      },
    })),
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
        "Wohnung hat ausreichende Elektroinstallation": "Nein",
      },
      expected: {
        "[Wohnung-] Wohnung hat unzureichende Elektroinstallation": "checked",
      },
    })),
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
