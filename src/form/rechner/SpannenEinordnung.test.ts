import { entries } from "remeda";
import { expect, test } from "vitest";

import { LageInfoByJahr } from "../adresse/types";
import { FinalAnswers } from "../flow-machine";
import {
  getSpannenEinordnung,
  getWorstBestAusstattungsabzüge,
} from "./SpannenEinordnung";
import { buildSameLageInfo } from "./utils";

type SpanneFlat = [number, number, number];
type SpannenTestInput = {
  lage: LageInfoByJahr;
  answers: FinalAnswers;
  spannen: SpanneFlat[];
};

type Pre = "?" | "!" | "";
type AusstattungKey = `${Pre}S&${Pre}B`;

const getAnswerFromPre = (key: string) =>
  key == "" ? "Ja" : key == "!" ? "Nein" : "Nicht sicher";

function getAusstattungsAnswers(key: AusstattungKey) {
  const [sammelheizung, bad] = key.split("&");
  return {
    "Wohnung hat Sammelheizung": getAnswerFromPre(sammelheizung.split("S")[0]),
    "Badezimmer in Wohnung": getAnswerFromPre(bad.split("B")[0]),
  } satisfies FinalAnswers;
}

test.each([
  ...[
    { qm: 39, spannen: [[8.42, 5.86, 13.82]] },
    { qm: 40, spannen: [[7.19, 5.61, 10.59]] },
    { qm: 59, spannen: [[7.19, 5.61, 10.59]] },
    { qm: 60, spannen: [[6.75, 5.14, 10.66]] },
    { qm: 69, spannen: [[6.75, 5.14, 10.66]] },
    { qm: 90, spannen: [[6.64, 5.1, 9.74]] },
  ].map(
    ({ qm, spannen }) =>
      ({
        lage: {
          2023: {
            laut: true,
            ost: false,
            wohnlage: "einfach",
          },
        },
        answers: {
          Vertragsdatum: "2022-2024",
          Baujahr: "-1918",
          Qm: qm,
        },
        spannen: spannen as never,
      }) satisfies SpannenTestInput,
  ),

  ...(
    [
      { Baujahr: "-1918", spannen: [[6.82, 5.32, 10.05]] },
      { Baujahr: "1919-1949", spannen: [[6.47, 5.48, 8.28]] },
      { Baujahr: "1950-1964", spannen: [[6.07, 5.44, 8.09]] },
      { Baujahr: "1965-1972", spannen: [[5.94, 5.11, 7.09]] },
      { Baujahr: "1973-1985", spannen: [[7.54, 6.27, 8.75]] },
      { Baujahr: "1986-1990", spannen: [[7.54, 6.27, 8.75]] },
      { Baujahr: "1991-2001", spannen: [[8.45, 7.79, 10.31]] },
      { Baujahr: "2002", spannen: [[8.45, 7.79, 10.31]] },
      { Baujahr: "2003-2014", spannen: [[11.74, 9.81, 15.28]] },
      {
        Baujahr: "Nicht sicher",
        spannen: [
          [7.99, 5.56, 13.11],
          [7.89, 6.07, 8.78],
          [6.5, 5.6, 9.13],
          [6.87, 6.06, 8.93],
          [7.65, 7.51, 8.95],
          [7.22, 6.93, 8.06],
        ],
      },
    ] as const
  ).map(
    ({ Baujahr, spannen }) =>
      ({
        lage: {
          2021: {
            laut: true,
            ost: false,
            wohnlage: "einfach",
          },
        },
        answers: {
          Vertragsdatum: "2020-2022",
          Baujahr,
          Qm: Baujahr == "Nicht sicher" ? 1 : 40,
        },
        spannen: spannen as never,
      }) satisfies SpannenTestInput,
  ),

  ...(
    [
      { wohnlage: "einfach", spannen: [[8.42, 5.86, 13.82]] },
      { wohnlage: "mittel", spannen: [[8.98, 7.16, 13.04]] },
      { wohnlage: "gut", spannen: [[12.19, 6.97, 15.17]] },
    ] as const
  ).map(
    ({ wohnlage, spannen }) =>
      ({
        lage: {
          2023: {
            laut: true,
            ost: true,
            wohnlage,
          },
        },
        answers: {
          Vertragsdatum: "2022-2024",
          Baujahr: "-1918",
          Qm: 1,
        },
        spannen: spannen as never,
      }) satisfies SpannenTestInput,
  ),

  ...(
    [
      { Vertragsdatum: "2015-2016", spannen: [[6.48, 4.81, 8.55]] },
      { Vertragsdatum: "2016-2018", spannen: [[7.45, 5.44, 10]] },
      { Vertragsdatum: "2018-2020", spannen: [[7.9, 5.5, 12.97]] },
      { Vertragsdatum: "2020-2022", spannen: [[7.99, 5.56, 13.11]] },
      { Vertragsdatum: "2022-2024", spannen: [[8.42, 5.86, 13.82]] },
    ] as const
  ).map(
    ({ Vertragsdatum, spannen }) =>
      ({
        lage: buildSameLageInfo({
          laut: true,
          ost: false,
          wohnlage: "einfach",
        }),
        answers: {
          Vertragsdatum,
          Baujahr: "-1918",
          Qm: 1,
        },
        spannen: spannen as never,
      }) satisfies SpannenTestInput,
  ),

  ...(
    [
      {
        answers: {
          Baujahr: "-1918",
          "Badezimmer in Wohnung": "Ja",
          "Wohnung hat Sammelheizung": "Ja",
        },
        spannen: [[7.21, 5.15, 10.66]],
      },
      {
        answers: {
          Baujahr: "-1918",
          "Badezimmer in Wohnung": "Ja",
          "Wohnung hat Sammelheizung": "Nein",
        },
        spannen: [[5.7, 3.64, 9.15]],
      },
      {
        answers: {
          Baujahr: "-1918",
          "Badezimmer in Wohnung": "Nein",
          "Wohnung hat Sammelheizung": "Ja",
        },
        spannen: [[5.7, 3.64, 9.15]],
      },
      {
        answers: {
          Baujahr: "-1918",
          "Badezimmer in Wohnung": "Nein",
          "Wohnung hat Sammelheizung": "Nein",
        },
        spannen: [[4.87, 2.81, 8.32]],
      },
    ] as const
  ).map(
    ({ answers, spannen }) =>
      ({
        lage: buildSameLageInfo({
          laut: true,
          ost: false,
          wohnlage: "mittel",
        }),
        answers: {
          Vertragsdatum: "2022-2024",
          Qm: 60,
          ...answers,
        },
        spannen: spannen as never,
      }) satisfies SpannenTestInput,
  ),

  {
    lage: buildSameLageInfo({
      laut: true,
      ost: false,
      wohnlage: "mittel",
    }),
    answers: { Vertragsdatum: "2015-2016", Baujahr: "Nicht sicher", Qm: 50 },
    spannen: [
      [5.81, 4.34, 7.81],
      [5.83, 5.27, 6.55],
      [5.6, 5.06, 6.5],
      [5.43, 5.09, 5.86],
      [6.97, 6.46, 7.84],
      [5.64, 5.37, 6.11],
      [7.34, 6.32, 8.36],
      [10.01, 7.69, 12.31],
    ],
  },
  {
    lage: buildSameLageInfo({
      laut: true,
      ost: false,
      wohnlage: "mittel",
    }),
    answers: { Vertragsdatum: "2016-2018", Baujahr: "Nicht sicher", Qm: 50 },
    spannen: [
      // 2017
      [6.61, 5.11, 10.06],
      [6.34, 5.52, 7.65],
      [6.11, 5.43, 7.48],
      [5.72, 5.39, 7.2],
      [7.39, 6.65, 7.97],
      [5.83, 5.37, 6.75],
      [8.18, 6.84, 9.37],
      [10.1, 8.4, 13.94],
    ],
  },
  {
    lage: buildSameLageInfo({
      laut: true,
      ost: false,
      wohnlage: "mittel",
    }),
    answers: { Vertragsdatum: "2018-2020", Baujahr: "Nicht sicher", Qm: 50 },
    spannen: [
      [7.43, 5.41, 10.25],
      [6.74, 5.63, 7.76],
      [6.11, 5.39, 7.64],
      [5.98, 5.43, 6.94],
      [7.73, 6.36, 8.77],
      [5.95, 5.4, 6.7],
      [8.18, 7.43, 9.17],
      [9.85, 7.28, 12.5],
    ],
  },
  {
    lage: buildSameLageInfo({
      laut: true,
      ost: false,
      wohnlage: "mittel",
    }),
    answers: { Vertragsdatum: "2020-2022", Baujahr: "Nicht sicher", Qm: 50 },
    spannen: [
      [7.51, 5.47, 10.36],
      [6.81, 5.69, 7.85],
      [6.18, 5.45, 7.72],
      [6.05, 5.49, 7.02],
      [7.82, 6.43, 8.87],
      [6.02, 5.46, 6.77],
      [8.27, 7.51, 9.27],
      [9.96, 7.36, 12.64],
    ],
  },
  {
    lage: buildSameLageInfo({
      laut: true,
      ost: false,
      wohnlage: "mittel",
    }),
    answers: { Vertragsdatum: "2022-2024", Baujahr: "Nicht sicher", Qm: 50 },
    spannen: [
      [7.92, 5.77, 10.92],
      [7.18, 6.0, 8.27],
      [6.51, 5.74, 8.14],
      [6.38, 5.79, 7.4],
      [8.24, 6.78, 9.35],
      [6.35, 5.75, 7.14],
      [8.72, 7.92, 9.77],
      [10.5, 7.76, 13.32],
    ],
  },

  ...entries({
    "S&B": [[7.21, 5.15, 10.66]],
    "?S&B": [
      [5.7, 3.64, 9.15],
      [7.21, 5.15, 10.66],
    ],
    "!S&B": [[5.7, 3.64, 9.15]],
    "S&?B": [
      [5.7, 3.64, 9.15],
      [7.21, 5.15, 10.66],
    ],
    "?S&?B": [
      [4.87, 2.81, 8.32],
      [7.21, 5.15, 10.66],
    ],
    "!S&?B": [
      [4.87, 2.81, 8.32],
      [5.7, 3.64, 9.15],
    ],
    "S&!B": [[5.7, 3.64, 9.15]],
    "?S&!B": [
      [4.87, 2.81, 8.32],
      [5.7, 3.64, 9.15],
    ],
    "!S&!B": [[4.87, 2.81, 8.32]],
  } satisfies Record<AusstattungKey, SpanneFlat[]>).map(
    ([key, spannen]) =>
      ({
        lage: buildSameLageInfo({
          laut: true,
          ost: false,
          wohnlage: "mittel",
        }),
        answers: {
          Vertragsdatum: "2022-2024",
          Baujahr: "-1918",
          Qm: 60,
          ...getAusstattungsAnswers(key),
        },
        spannen,
      }) satisfies SpannenTestInput,
  ),
] satisfies SpannenTestInput[])(
  "getSpannenEinordnung(%o)",
  async ({ lage, answers, spannen }) => {
    expect(
      getSpannenEinordnung({
        "Wohnung hat Sammelheizung": "Ja",
        "Badezimmer in Wohnung": "Ja",
        ...answers,
        Adresse: JSON.stringify({ lage }),
      }).map((m) => [m.center, m.min, m.max].map((n) => Number(n.toFixed(2)))),
    ).toEqual(spannen);
  },
);

const austattungCasesByBaujahr = {
  "-1918": {
    "S&B": [0, 0],
    "?S&B": [0, 1.51],
    "!S&B": [1.51, 1.51],

    "S&?B": [0, 1.51],
    "?S&?B": [0, 2.34],
    "!S&?B": [1.51, 2.34],

    "S&!B": [1.51, 1.51],
    "?S&!B": [1.51, 2.34],
    "!S&!B": [2.34, 2.34],
  },
  "1919-1949": {
    "S&B": [0, 0],
    "?S&B": [0, 0.45],
    "!S&B": [0.45, 0.45],

    "S&?B": [0, 0.45],
    "?S&?B": [0, 2.34],
    "!S&?B": [0.45, 2.34],

    "S&!B": [0.45, 0.45],
    "?S&!B": [0.45, 2.34],
    "!S&!B": [2.34, 2.34],
  },
  "1950-1964": {
    "S&B": [0, 0],
    "?S&B": [0, 1.55],
    "!S&B": [1.55, 1.55],

    "S&?B": [0, 1.55],
    "?S&?B": [0, 1.55],
    "!S&?B": [1.55, 1.55],

    "S&!B": [1.55, 1.55],
    "?S&!B": [1.55, 1.55],
    "!S&!B": [1.55, 1.55],
  },
  "1965-1972": {
    "S&B": [0, 0],
    "?S&B": [0, 0],
    "!S&B": [0, 0],

    "S&?B": [0, 0],
    "?S&?B": [0, 0],
    "!S&?B": [0, 0],

    "S&!B": [0, 0],
    "?S&!B": [0, 0],
    "!S&!B": [0, 0],
  },
  "Nicht sicher": {
    "S&B": [0, 0],
    "?S&B": [0, 1.55],
    "!S&B": [0, 1.55],

    "S&?B": [0, 1.55],
    "?S&?B": [0, 2.34],
    "!S&?B": [0, 2.34],

    "S&!B": [0, 1.55],
    "?S&!B": [0, 2.34],
    "!S&!B": [0, 2.34],
  },
} satisfies Partial<
  Record<
    NonNullable<FinalAnswers["Baujahr"]>,
    Record<AusstattungKey, [number, number]>
  >
>;

test.each(
  entries(austattungCasesByBaujahr).flatMap(([Baujahr, cases]) =>
    entries(cases).map(
      ([key, [worst, best]]) =>
        [
          {
            Baujahr,
            Vertragsdatum: "2022-2024",
            ...getAusstattungsAnswers(key),
          } satisfies FinalAnswers,
          { worst, best },
        ] as const,
    ),
  ),
)("getWorstBestAusstattungsabzüge(%o)", async (answers, worstBest) => {
  const abzug = getWorstBestAusstattungsabzüge(answers);
  expect(abzug).toEqual(worstBest);
});
