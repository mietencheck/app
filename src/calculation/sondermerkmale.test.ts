import { expect, test } from "vitest";

import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";

import { SONDERMERKMAL_RESET_ANSWERS } from "../form/mappings/answer-reset";
import { getWorstBestSondermerkmalModifier } from "./sondermerkmale";

test.each([
  ...[
    {
      description: "Case where all Sondermerkmale are 'unchecked'",
      answers: {},
      result: {
        worst: 0,
        best: 0,
      },
    },
    {
      description:
        "Case where Sondermerkmal is 'checked' for a wohnwertsteigerndes Sondermerkmal",
      answers: {
        "Sondermerkmal Bodenbelag": "Ja",
        Baujahr: 1918,
      },
      result: {
        best: 0.56,
        worst: 0.56,
      },
    },
    {
      description:
        "Case where Sondermerkmal is 'maybe' for a wohnwertsteigerndes Sondermerkmal",
      answers: {
        "Sondermerkmal Bodenbelag": "Nicht sicher",
        Baujahr: 1918,
      },
      result: {
        best: 0,
        worst: 0.56,
      },
    },
    {
      description:
        "Case where Sondermerkmal is 'checked' for a wohnwertminderendes Sondermerkmal",
      answers: {
        "Sondermerkmal Badezimmer Klein": "Nein",
        Baujahr: 1991,
      },
      result: {
        best: -0.32,
        worst: -0.32,
      },
    },
    {
      description:
        "Case where Sondermerkmal is 'maybe' for a wohnwertminderendes Sondermerkmal",
      answers: {
        "Sondermerkmal Badezimmer Klein": "Nicht sicher",
        Baujahr: 1991,
      },
      result: {
        best: -0.32,
        worst: 0,
      },
    },
    {
      description:
        "Case where Sondermerkmal is 'checked' for a wohnwertminderendes and a wohnwertsteigerndes Sondermerkmal",
      answers: {
        "Sondermerkmal Bodenbelag": "Ja",
        "Sondermerkmal Badezimmer Klein": "Nein",
        Baujahr: 1991,
      },
      result: {
        best: 0.47,
        worst: 0.47,
      },
    },
    {
      description:
        "Case where Sondermerkmal is 'maybe' for a wohnwertminderendes and a wohnwertsteigerndes Sondermerkmal",
      answers: {
        "Sondermerkmal Bodenbelag": "Nicht sicher",
        "Sondermerkmal Badezimmer Klein": "Nicht sicher",
        Baujahr: 1991,
      },
      result: {
        best: -0.32,
        worst: 0.79,
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
        best: 0,
        worst: 0,
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
        best: 0.16,
        worst: 0.16,
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
      result: result as {
        best: number;
        worst: number;
      },
    };
  }),
])("getWorstBestSondermerkmalModifier(%o)", ({ answers, result }) => {
  expect(
    getWorstBestSondermerkmalModifier(
      answers,
      getVisibleQuestionAliases(answers),
    ),
  ).toEqual(result);
});
