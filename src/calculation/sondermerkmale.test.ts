import { expect, test } from "vitest";

import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import { Sondermerkmal } from "~/mietspiegel/types";

import { SONDERMERKMAL_RESET_ANSWERS } from "./answer-reset";
import { getWorstBestSondermerkmalAbzuege } from "./sondermerkmale";

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
          worst: 0.56,
          best: 0.56,
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
          worst: 0.56,
          best: 0,
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
          worst: 0,
          best: 0,
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
          worst: 0.16,
          best: 0.16,
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
            worst: 0,
            best: 0,
          },
          "[Sondermerkmal] Moderne Küchenausstattung": {
            worst: 0,
            best: 0,
          },
          "[Sondermerkmal] Von der Badewanne getrennte Dusche": {
            worst: 0,
            best: 0,
          },
          "[Sondermerkmal] Kleines Bad": {
            worst: 0,
            best: 0,
          },
          "[Sondermerkmal] Modernes Bad": {
            worst: 0,
            best: 0,
          },
          "[Sondermerkmal] Isolierverglasung/Schallschutzfenster": {
            worst: 0,
            best: 0,
          },
          "[Sondermerkmal] Aufzug im Haus": {
            worst: 0,
            best: 0,
          },
        },
        ...result,
      } as {
        [key in Sondermerkmal]: {
          worst: number;
          best: number;
        };
      },
    };
  }),
])("getWorstBestSondermerkmalAbzuege(%o)", ({ answers, result }) => {
  expect(
    getWorstBestSondermerkmalAbzuege(
      answers,
      getVisibleQuestionAliases(answers),
    ),
  ).toEqual(result);
});
