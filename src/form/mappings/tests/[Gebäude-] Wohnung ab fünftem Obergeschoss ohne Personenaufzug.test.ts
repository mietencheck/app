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
        Baujahr: 1949,
        "Gebäude hat Fahrstuhl": "Ja",
        "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Ja",
      },
      expected: {
        "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug":
          "unchecked",
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
        Baujahr: 1949,
        "Gebäude hat Fahrstuhl": "Ja",
        "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Nicht sicher",
      },
      expected: {
        "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug":
          "unchecked",
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
        Baujahr: 1949,
        "Gebäude hat Fahrstuhl": "Ja",
        "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Nein",
      },
      expected: {
        "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug":
          "unchecked",
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
        Baujahr: 1949,
        "Gebäude hat Fahrstuhl": "Nicht sicher",
        "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Ja",
      },
      expected: {
        "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug":
          "maybe",
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
        Baujahr: 1949,
        "Gebäude hat Fahrstuhl": "Nicht sicher",
        "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Nicht sicher",
      },
      expected: {
        "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug":
          "maybe",
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
        Baujahr: 1949,
        "Gebäude hat Fahrstuhl": "Nicht sicher",
        "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Nein",
      },
      expected: {
        "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug":
          "unchecked",
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
        Baujahr: 1949,
        "Gebäude hat Fahrstuhl": "Nein",
        "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Ja",
      },
      expected: {
        "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug":
          "checked",
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
        Baujahr: 1949,
        "Gebäude hat Fahrstuhl": "Nein",
        "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Nicht sicher",
      },
      expected: {
        "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug":
          "maybe",
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
        Baujahr: 1949,
        "Gebäude hat Fahrstuhl": "Nein",
        "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Nein",
      },
      expected: {
        "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug":
          "unchecked",
      },
    })),
    {
      answers: {
        Vertragsdatum: "2024-2026",
        Baujahr: 1948,
        "Gebäude hat Fahrstuhl": "Ja",
        "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Ja",
      },
      expected: {
        "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug":
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
