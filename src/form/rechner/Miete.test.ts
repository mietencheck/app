import { expect, test } from "vitest";

import { FinalAnswers, getVisibleQuestionAliases } from "../flow-machine";
import { MERKMAL_RESET_ANSWERS } from "./answer-test-reset";
import { getWorstBestOrtsüblicheVergleichsmiete } from "./Miete";
import { buildSameLageInfo } from "./utils";

test.each([
  {
    // Sondermerkmale
    answers: {
      Baujahr: "Nicht sicher",
      Vertragsdatum: "2015-2016",
      Qm: 60,
      "Sondermerkmal Bodenbelag": "Nicht sicher",
    },
    miete: [8.79 + 1.1, 4.99],
  },
  {
    // Merkmalsgruppen (negativ)
    answers: {
      Baujahr: "Nicht sicher",
      Vertragsdatum: "2015-2016",
      Qm: 60,
      "Küche hat Kochmöglichkeit": "Nein",
    },
    miete: [8.53, 4.94],
  },
  {
    // Merkmalsgruppen (positiv)
    answers: {
      Baujahr: "Nicht sicher",
      Vertragsdatum: "2015-2016",
      Qm: 60,
      "Küche ist groß": "Ja",
    },
    miete: [9.17, 5.05],
  },
  {
    // Merkmalsgruppen (negativ) und Sondermerkmal
    answers: {
      Baujahr: "Nicht sicher",
      Vertragsdatum: "2015-2016",
      Qm: 60,
      "Küche hat Kochmöglichkeit": "Nein",
      "Sondermerkmal Bodenbelag": "Nicht sicher",
    },
    miete: [8.53 + 1.1, 4.94],
  },

  {
    // Ausstattungsabzüge
    answers: {
      Baujahr: "1919-1949",
      Vertragsdatum: "2015-2016",
      Qm: 60,
      "Badezimmer in Wohnung": "Nein",
      "Wohnung hat Sammelheizung": "Nein",
    },
    miete: 5.66 - 2.65,
  },
] satisfies {
  answers: FinalAnswers;
  miete: number | [number, number];
}[])("getWorstBestOrtsüblicheVergleichsmiete(%o)", ({ answers, miete }) => {
  const allAnswers = {
    Adresse: JSON.stringify({
      lage: buildSameLageInfo({
        laut: false,
        ost: false,
        wohnlage: "mittel",
      }),
    }),
    Unterschrieben: "Ja",
    ...MERKMAL_RESET_ANSWERS,
    ...answers,
  } satisfies FinalAnswers;
  const { best, worst } = getWorstBestOrtsüblicheVergleichsmiete(
    allAnswers,
    getVisibleQuestionAliases(allAnswers as never),
  )!;
  expect([worst, best].map((n) => Number(n.toFixed(2)))).toEqual(
    (Array.isArray(miete) ? miete : [miete, miete]).map((n) =>
      Number(n.toFixed(2)),
    ),
  );
});
