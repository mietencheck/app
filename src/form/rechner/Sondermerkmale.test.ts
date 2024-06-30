import { entries, fromEntries } from "remeda";
import { expect, test } from "vitest";

import { FinalAnswers, getVisibleQuestionAliases } from "../flow-machine";
import { MERKMAL_RESET_ANSWERS } from "./answer-test-reset";
import {
  getWorstBestSondermerkmale,
  getWorstBestSondermerkmalZuschlag,
  sondermerkmalZuschläge2015,
} from "./Sondermerkmale";
import { MerkmalState } from "./utils";

test.each([
  {
    answers: {
      Baujahr: "1919-1949",
      "Sondermerkmal Bodenbelag": "Ja",
    },
    sondermerkmale: { "hochwertiger Boden": "checked" },
    totalZuschlag: [0.83, 0.83],
  },

  {
    answers: {
      Baujahr: "-1918",
      "Sondermerkmal Bodenbelag": "Ja",
    },
    sondermerkmale: { "hochwertiger Boden": "checked" },
    totalZuschlag: [0.56, 0.56],
  },
  {
    answers: {
      Baujahr: "-1918",
      "Sondermerkmal Bodenbelag": "Nicht sicher",
    },
    sondermerkmale: { "hochwertiger Boden": "maybe" },
    totalZuschlag: [0.56, 0],
  },
  {
    answers: {
      Baujahr: "-1918",
      "Sondermerkmal Bodenbelag": "Nein",
    },
    sondermerkmale: { "hochwertiger Boden": "unchecked" },
    totalZuschlag: [0, 0],
  },
  {
    answers: {
      Baujahr: "1965-1972",
      "Sondermerkmal Bodenbelag": "Ja",
    },
    sondermerkmale: { "hochwertiger Boden": "unchecked" },
    totalZuschlag: [0, 0],
  },
  {
    answers: {
      Baujahr: "1965-1972",
      "Sondermerkmal Bodenbelag": "Nicht sicher",
    },
    sondermerkmale: { "hochwertiger Boden": "unchecked" },
    totalZuschlag: [0, 0],
  },
  {
    answers: {
      Baujahr: "1965-1972",
      "Sondermerkmal Bodenbelag": "Nein",
    },
    sondermerkmale: { "hochwertiger Boden": "unchecked" },
    totalZuschlag: [0, 0],
  },
  {
    answers: {
      Baujahr: "Nicht sicher",
      "Sondermerkmal Bodenbelag": "Ja",
    },
    sondermerkmale: { "hochwertiger Boden": "checked" },
    totalZuschlag: [1.1, 0],
  },
  {
    answers: {
      Baujahr: "Nicht sicher",
      "Sondermerkmal Bodenbelag": "Nicht sicher",
    },
    sondermerkmale: { "hochwertiger Boden": "maybe" },
    totalZuschlag: [1.1, 0],
  },
  {
    answers: {
      Baujahr: "Nicht sicher",
      "Sondermerkmal Bodenbelag": "Nein",
    },
    sondermerkmale: { "hochwertiger Boden": "unchecked" },
    totalZuschlag: [0, 0],
  },
] satisfies {
  answers: FinalAnswers;
  sondermerkmale: Record<string, MerkmalState>;
  totalZuschlag: [number, number];
}[])(
  "getWorstBestSondermerkmalZuschlag(%o)",
  ({ answers, sondermerkmale, totalZuschlag }) => {
    const allAnswers = {
      Unterschrieben: "Ja",
      Vertragsdatum: "2015-2016",
      Ost: false,
      ...MERKMAL_RESET_ANSWERS,
      ...answers,
    } satisfies FinalAnswers;
    const merkis = entries
      .strict(sondermerkmalZuschläge2015)
      .map(([key, tuple]) => ({
        key,
        ...getWorstBestSondermerkmalZuschlag(
          tuple,
          allAnswers,
          getVisibleQuestionAliases(allAnswers),
        ),
      }));

    expect(
      fromEntries(
        merkis
          .filter(
            ({ key, state }) => state !== "unchecked" || key in sondermerkmale,
          )
          .map(({ key, state }) => [key, state]),
      ),
    ).toEqual(sondermerkmale);

    const { worst, best } = getWorstBestSondermerkmale(merkis);
    expect(totalZuschlag).toEqual([worst, best]);
  },
);
