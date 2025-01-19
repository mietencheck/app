import { expect, test } from "vitest";

import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import { Sondermerkmal } from "~/mietspiegel/types";

import { SONDERMERKMAL_RESET_ANSWERS } from "../form/mappings/answer-reset";
import { getWorstBestSondermerkmalAufschlagBySondermerkmal } from "./sondermerkmale";

test.each([
  ...[
    {
      description: "Case where all Sondermerkmale are 'unchecked'",
      answers: {},
      result: {},
    },
    {
      description: "Case where Sondermerkmal is 'checked'",
      answers: {
        "Sondermerkmal Bodenbelag": "Ja",
        Baujahr: 1918,
      },
      result: {
        "[Sondermerkmal] Hochwertiger Bodenbelag": {
          best: 0.56,
          worst: 0.56,
        },
      },
    },
    {
      description: "Case where Sondermerkmal is 'maybe'",
      answers: {
        "Sondermerkmal Bodenbelag": "Nicht sicher",
        Baujahr: 1918,
      },
      result: {
        "[Sondermerkmal] Hochwertiger Bodenbelag": {
          best: 0,
          worst: 0.56,
        },
      },
    },

    {
      description:
        "Case where Sondermerkmal is 'checked' for Baujahrspanne without value",
      answers: {
        "Sondermerkmal Bodenbelag": "Ja",
        Baujahr: 1965,
      },
      result: {
        "[Sondermerkmal] Hochwertiger Bodenbelag": {
          best: 0,
          worst: 0,
        },
      },
    },
    {
      description:
        "Case where Sondermerkmal is 'checked' for Baujahrspanne Ost",
      answers: {
        "Sondermerkmal Modernes Bad": "Ja",
        Baujahr: 1973,
        Ost: true,
      },
      result: {
        "[Sondermerkmal] Modernes Bad": {
          best: 0.16,
          worst: 0.16,
        },
      },
    },
  ].map(({ answers, result }) => {
    return {
      answers: {
        ...{
          ...SONDERMERKMAL_RESET_ANSWERS,
          Unterschrieben: "Ja",
          Vertragsdatum: "2015-2016",
          Baujahr: 1918,
          Ost: false,
        },
        ...answers,
      } as FinalAnswers,
      result: {
        ...{
          "[Sondermerkmal] Hochwertiger Bodenbelag": {
            best: 0,
            worst: 0,
          },
          "[Sondermerkmal] Moderne Küchenausstattung": {
            best: 0,
            worst: 0,
          },
          "[Sondermerkmal] Von der Badewanne getrennte Dusche": {
            best: 0,
            worst: 0,
          },
          "[Sondermerkmal] Kleines Bad": {
            best: 0,
            worst: 0,
          },
          "[Sondermerkmal] Modernes Bad": {
            best: 0,
            worst: 0,
          },
          "[Sondermerkmal] Isolierverglasung/Schallschutzfenster": {
            best: 0,
            worst: 0,
          },
          "[Sondermerkmal] Aufzug im Haus": {
            best: 0,
            worst: 0,
          },
        },
        ...result,
      } as {
        [key in Sondermerkmal]: {
          best: number;
          worst: number;
        };
      },
    };
  }),
])("getWorstBestSondermerkmalAbzuege(%o)", ({ answers, result }) => {
  expect(
    getWorstBestSondermerkmalAufschlagBySondermerkmal(
      answers,
      getVisibleQuestionAliases(answers),
    ),
  ).toEqual(result);
});
