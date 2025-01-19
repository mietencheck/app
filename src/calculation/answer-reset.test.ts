import { expect, test } from "vitest";

import { getMerkmalStates, getSondermerkmalStates } from "~/form/api";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import { merkmaleByYear } from "~/mietspiegel/merkmale";
import { sondermerkmale } from "~/mietspiegel/sondermerkmale";

import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "./answer-reset";

test.each([
  {
    description: "Case where all Sondermerkmale should be 'unchecked'",
    answers: {
      ...SONDERMERKMAL_RESET_ANSWERS,
      Unterschrieben: "Ja",
      Vertragsdatum: "2015-2016",
      Baujahr: 1918,
    } as FinalAnswers,
    result: Object.fromEntries(
      Object.keys(sondermerkmale).map((key) => [key, "unchecked"]),
    ),
  },
])("getSondermerkmalStates(%o)", ({ answers, result }) => {
  expect(
    getSondermerkmalStates(answers, getVisibleQuestionAliases(answers)),
  ).toEqual(result);
});

test.each([
  {
    answers: {
      Unterschrieben: "Ja",
      Vertragsdatum: "2015-2016",
      ...MERKMAL_RESET_ANSWERS,
    } as FinalAnswers,
    result: Object.fromEntries(
      Array.from(merkmaleByYear[2015]).map((merkmal) => [merkmal, "unchecked"]),
    ),
  },
  {
    answers: {
      Unterschrieben: "Ja",
      Vertragsdatum: "2016-2018",
      ...MERKMAL_RESET_ANSWERS,
    } as FinalAnswers,
    result: Object.fromEntries(
      Array.from(merkmaleByYear[2017]).map((merkmal) => [merkmal, "unchecked"]),
    ),
  },
  {
    answers: {
      Unterschrieben: "Ja",
      Vertragsdatum: "2018-2020",
      ...MERKMAL_RESET_ANSWERS,
    } as FinalAnswers,
    result: Object.fromEntries(
      Array.from(merkmaleByYear[2019]).map((merkmal) => [merkmal, "unchecked"]),
    ),
  },
  {
    answers: {
      Unterschrieben: "Ja",
      Vertragsdatum: "2020-2022",
      ...MERKMAL_RESET_ANSWERS,
    } as FinalAnswers,
    result: Object.fromEntries(
      Array.from(merkmaleByYear[2021]).map((merkmal) => [merkmal, "unchecked"]),
    ),
  },
  {
    answers: {
      Unterschrieben: "Ja",
      Vertragsdatum: "2022-2024",
      ...MERKMAL_RESET_ANSWERS,
    } as FinalAnswers,
    result: Object.fromEntries(
      Array.from(merkmaleByYear[2023]).map((merkmal) => [merkmal, "unchecked"]),
    ),
  },
  {
    answers: {
      Unterschrieben: "Ja",
      Vertragsdatum: ">2024",
      ...MERKMAL_RESET_ANSWERS,
    } as FinalAnswers,
    result: Object.fromEntries(
      Array.from(merkmaleByYear[2024]).map((merkmal) => [merkmal, "unchecked"]),
    ),
  },
])("getMerkmalStates(%o)", ({ answers, result }) => {
  expect(getMerkmalStates(answers, getVisibleQuestionAliases(answers))).toEqual(
    result,
  );
});
