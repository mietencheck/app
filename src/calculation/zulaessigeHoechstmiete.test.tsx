import { expect, test } from "vitest";

import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";

import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "../form/mappings/answer-reset";
import { getWorstBestZulaessigeHoechstmiete } from "./zulaessigeHoechstmiete";

test.each([
  ...[
    {
      description: "Case where type is 'Miete'",
      answers: {
        Typ: "Miete",
      },
      result: {
        worst: 7.13,
        best: 7.13,
      },
    },
    {
      description: "Case where type is 'Mieterhöhung/",
      answers: {
        Typ: "Mieterhöhung",
      },
      result: {
        worst: 6.48,
        best: 6.48,
      },
    },
  ].map(({ description, answers, result }) => {
    return {
      description: description,
      answers: {
        Vertragsdatum: "2015-2016",
        Unterschrieben: "Ja",
        Baujahr: 1918,
        Wohnlage: "einfach",
        Qm: 1,
        "Wohnung hat Sammelheizung": "Ja",
        "Badezimmer in Wohnung": "Ja",
        ...SONDERMERKMAL_RESET_ANSWERS,
        ...MERKMAL_RESET_ANSWERS,
        ...answers,
      } as FinalAnswers,
      result: result as { worst: number; best: number },
    };
  }),
])("getWorstBestZulaessigeHoechstmiete(%o)", ({ answers, result }) => {
  expect(
    getWorstBestZulaessigeHoechstmiete(
      answers,
      getVisibleQuestionAliases(answers),
    ),
  ).toEqual(result);
});
