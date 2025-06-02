import { expect, test } from "vitest";

import { getMerkmalStates, getSondermerkmalStates } from "~/form/api";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";

import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "./answer-reset";
import {
  MERKMAL_DEFAULT_STATE,
  SONDERMERKMAL_DEFAULT_STATE,
} from "./tests/merkmal-default-state";

test.each([
  {
    answers: {
      ...SONDERMERKMAL_RESET_ANSWERS,
      Unterschrieben: "Ja",
      Vertragsdatum: "2015-2016",
      Baujahr: 1918,
    } as FinalAnswers,
    result: SONDERMERKMAL_DEFAULT_STATE,
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
    result: MERKMAL_DEFAULT_STATE["2015-2016"],
  },
  {
    answers: {
      Unterschrieben: "Ja",
      Vertragsdatum: "2016-2018",
      ...MERKMAL_RESET_ANSWERS,
    } as FinalAnswers,
    result: MERKMAL_DEFAULT_STATE["2016-2018"],
  },
  {
    answers: {
      Unterschrieben: "Ja",
      Vertragsdatum: "2018-2020",
      ...MERKMAL_RESET_ANSWERS,
    } as FinalAnswers,
    result: MERKMAL_DEFAULT_STATE["2018-2020"],
  },
  {
    answers: {
      Unterschrieben: "Ja",
      Vertragsdatum: "2020-2022",
      ...MERKMAL_RESET_ANSWERS,
    } as FinalAnswers,
    result: MERKMAL_DEFAULT_STATE["2020-2022"],
  },
  {
    answers: {
      Unterschrieben: "Ja",
      Vertragsdatum: "2022-2024",
      ...MERKMAL_RESET_ANSWERS,
    } as FinalAnswers,
    result: MERKMAL_DEFAULT_STATE["2022-2024"],
  },
  {
    answers: {
      Unterschrieben: "Ja",
      Vertragsdatum: ">2024",
      ...MERKMAL_RESET_ANSWERS,
    } as FinalAnswers,
    result: MERKMAL_DEFAULT_STATE[">2024"],
  },
])("getMerkmalStates(%o)", ({ answers, result }) => {
  expect(getMerkmalStates(answers, getVisibleQuestionAliases(answers))).toEqual(
    result,
  );
});
