import { mapValues } from "remeda";
import { expect, test } from "vitest";

import { FinalAnswers, getVisibleQuestionAliases } from "../flow-machine";
import { MERKMAL_RESET_ANSWERS } from "./answer-test-reset";
import {
  getAllCheckedMerkmale,
  getWorstBestMerkmalsgruppen,
  getWorstBestMerkmalsGruppenInProzent,
} from "./MerkmalsGruppen";
import { buildSameLageInfo } from "./utils";

test.each([
  [
    {
      Vertragsdatum: "2016-2018",
      "Küche hat Einbauküche": "Ja",
    },
    ["[Küche+] EBK"],
  ],
  [
    {
      Vertragsdatum: "2016-2018",
      "Küche hat Kochmöglichkeit": "Ja",
      "Küche hat Gas/Elektroherd": "Nein",
      "Küche hat Gas/Elektroherd ohne Backofen": "Ja",
      "Küche hat Ceran-/Induktionsherd": "Ja",
    },
    ["[Küche+] Edelkochfeld"],
  ],
] satisfies [FinalAnswers, string[]][])(
  "getAllCheckedMerkmale(%o)",
  (answers, merkmale) => {
    expect(
      getAllCheckedMerkmale(answers, getVisibleQuestionAliases(answers)),
    ).toEqual(merkmale);
  },
);

test.each([
  {
    answers: { Vertragsdatum: "2018-2020" },
    percent: [0, 0],
    numbers: [0, 0],
  },
  {
    answers: {
      Vertragsdatum: "2018-2020",
      "Bad ist groß": "Ja",
    },
    percent: [0.2, 0.2],
    numbers: [0.33, 0.33],
  },
  {
    answers: {
      Vertragsdatum: "2018-2020",
      "Bad ist groß": "Nicht sicher",
    },
    percent: [0.2, 0],
    numbers: [0.33, 0],
  },
  {
    answers: {
      Vertragsdatum: "2018-2020",
      "Bad ist klein": "Nein",
    },
    percent: [-0.2, -0.2],
    numbers: [-0.29, -0.29],
  },
  {
    answers: {
      Vertragsdatum: "2018-2020",
      "Bad ist klein": "Nicht sicher",
    },
    percent: [0, -0.2],
  },
  {
    answers: {
      Vertragsdatum: "2018-2020",
      "Bad ist groß": "Ja",
      "Bad hat Duschmöglichkeit": "Nein",
    },
    percent: [0, 0],
  },
  {
    answers: {
      Vertragsdatum: "2018-2020",
      "Bad ist groß": "Nicht sicher",
      "Bad hat Duschmöglichkeit": "Nicht sicher",
    },
    percent: [0.2, -0.2],
  },
  {
    answers: {
      Vertragsdatum: "2018-2020",
      "Bad ist groß": "Nicht sicher",
      "Bad hat Duschmöglichkeit": "Nicht sicher",
      "Küche ist groß": "Nicht sicher",
      "Küche hat Kochmöglichkeit": "Nicht sicher",
      "Wohnung hat großen Wohnraum": "Nicht sicher",
      "Wohnung hat Durchgangszimmer": "Nicht sicher",
      "Gebäude hat Treppenhaus in gutem Zustand": "Nicht sicher",
      "Gebäude hat Treppenhaus in schlechtem Zustand": "Nicht sicher",
      "Wohnumfeld ist besonders leise": "Nicht sicher",
      "Wohnumfeld ist stark vernachlässigt": "Nicht sicher",
    },
    percent: [1, -1],
    numbers: [1.66, -1.45],
  },
  {
    answers: {
      Vertragsdatum: "2018-2020",
      "Bad ist groß": "Nicht sicher",
      "Bad hat Duschmöglichkeit": "Nicht sicher",
      "Wohnung hat großen Wohnraum": "Nicht sicher",
      "Wohnung hat Durchgangszimmer": "Nicht sicher",
      "Gebäude hat Treppenhaus in gutem Zustand": "Nicht sicher",
      "Gebäude hat Treppenhaus in schlechtem Zustand": "Nicht sicher",
      "Wohnumfeld ist besonders leise": "Nicht sicher",
      "Wohnumfeld ist stark vernachlässigt": "Nicht sicher",
    },
    percent: [0.8, -0.8],
    numbers: [1.33, -1.16],
  },
  {
    answers: {
      Vertragsdatum: "2018-2020",
      "Kennt Energieverbrauch oder Energiebedarf": "Energieverbrauchswert",
      Energieverbrauchskennwert: "+++",
      "Wohnung hat Durchgangszimmer": "Ja",
      "Wohnung keinen Balkon weil unmöglich": "Nein",
      "Wohnung hat einfach verglaste Fenster": "Ja",
    },
    percent: [0, 0],
  },
] satisfies {
  answers: FinalAnswers;
  percent: [number, number];
  numbers?: [number, number];
}[])("Merkmale: %o", ({ answers, percent, numbers }) => {
  const allAnswers = {
    Qm: 60,
    Adresse: JSON.stringify({
      lage: buildSameLageInfo({
        laut: true,
        ost: false,
        wohnlage: "gut",
      }),
    }),
    Baujahr: "1965-1972",
    ...MERKMAL_RESET_ANSWERS,
    ...answers,
  } satisfies FinalAnswers;
  expect(
    mapValues(
      getWorstBestMerkmalsGruppenInProzent(
        allAnswers,
        getVisibleQuestionAliases(allAnswers),
      ),
      (n) => Number(n.toFixed(2)),
    ),
  ).toEqual({ worst: percent[0], best: percent[1] });

  if (numbers) {
    expect(
      mapValues(
        getWorstBestMerkmalsgruppen(
          allAnswers,
          getVisibleQuestionAliases(allAnswers),
        ),
        (n) => Number(n.toFixed(2)),
      ),
    ).toEqual({ worst: numbers[0], best: numbers[1] });
  }
});
