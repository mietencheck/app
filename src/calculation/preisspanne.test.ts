import { expect, test } from "vitest";

import { answersToCalculationContext } from "~/form/calculation-context";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import { Preisspanne } from "~/mietspiegel/types";

import { getWorstBestPreisspanne } from "./preisspanne";

/**
 * Test `getWorstBestPreisspanne` based on Vertragsdatum (contract date).
 */
test.each([
  ...[
    {
      description: "Case where contract was signed between 2015 and 2016",
      answers: {
        Vertragsdatum: "2015-2016",
      },
      preisspanne: [6.48, 4.81, 8.55],
    },
    {
      description: "Case where contract was signed between 2016 and 2018",
      answers: { Vertragsdatum: "2016-2018" },
      preisspanne: [7.45, 5.44, 10],
    },
    {
      description: "Case where contract was signed between 2018 and 2020",
      answers: { Vertragsdatum: "2018-2020" },
      preisspanne: [7.9, 5.5, 12.97],
    },
    {
      description: "Case where contract was signed between 2020 and 2022",
      answers: { Vertragsdatum: "2020-2022" },
      preisspanne: [7.99, 5.56, 13.11],
    },
    {
      description: "Case where contract was signed between 2022 and 2024",
      answers: { Vertragsdatum: "2022-2024" },
      preisspanne: [8.42, 5.86, 13.82],
    },
    {
      description: "Case where contract was signed between 2024 and 2026",
      answers: { Vertragsdatum: "2024-2026" },
      preisspanne: [9.87, 7.19, 14.19],
    },
    {
      description: "Case where contract was signed after 2026",
      answers: { Vertragsdatum: ">2026" },
      preisspanne: [9.58, 6.53, 13.43],
    },
  ].map(({ description, answers, preisspanne }) => ({
    description: description,
    answers: {
      Typ: "Miete",
      Ost: false,
      Wohnlage: "einfach",
      Unterschrieben: "Ja",
      Baujahr: 1918,
      Qm: 1,
      "Wohnung hat Sammelheizung": "Ja",
      "Badezimmer in Wohnung": "Ja",
      ...answers,
    } as FinalAnswers,
    preisspanne: preisspanne as Preisspanne,
  })),
])("getWorstBestPreisspanne(%o)", ({ answers, preisspanne }) => {
  expect(
    getWorstBestPreisspanne(
      answersToCalculationContext(answers, getVisibleQuestionAliases(answers))!,
    ),
  ).toEqual({
    worst: preisspanne,
    best: preisspanne,
  });
});

// Baujahr
test.each([
  ...[
    { Baujahr: 1918, preisspanne: [6.82, 5.32, 10.05] },
    { Baujahr: 1919, preisspanne: [6.47, 5.48, 8.28] },
    { Baujahr: 1950, preisspanne: [6.07, 5.44, 8.09] },
    { Baujahr: 1965, preisspanne: [5.94, 5.11, 7.09] },
    { Baujahr: 1973, preisspanne: [7.54, 6.27, 8.75] },
    { Baujahr: 1991, preisspanne: [8.45, 7.79, 10.31] },
    { Baujahr: 2003, preisspanne: [11.74, 9.81, 15.28] },
  ].map(({ Baujahr, preisspanne }) => ({
    answers: {
      Typ: "Miete",
      Ost: false,
      Wohnlage: "einfach",
      Unterschrieben: "Ja",
      Vertragsdatum: "2020-2022",
      Baujahr: Baujahr,
      Qm: 40,
      "Wohnung hat Sammelheizung": "Ja",
      "Badezimmer in Wohnung": "Ja",
    } as FinalAnswers,
    preisspanne: preisspanne as Preisspanne,
  })),
])("getWorstBestPreisspanne(%o)", ({ answers, preisspanne }) => {
  expect(
    getWorstBestPreisspanne(
      answersToCalculationContext(answers, getVisibleQuestionAliases(answers))!,
    ),
  ).toEqual({
    best: preisspanne,
    worst: preisspanne,
  });
});

// Wohnfläche
test.each([
  ...[
    { qm: 39, preisspanne: [8.42, 5.86, 13.82] },
    { qm: 40, preisspanne: [7.19, 5.61, 10.59] },
    { qm: 59, preisspanne: [7.19, 5.61, 10.59] },
    { qm: 60, preisspanne: [6.75, 5.14, 10.66] },
    { qm: 69, preisspanne: [6.75, 5.14, 10.66] },
    { qm: 90, preisspanne: [6.64, 5.1, 9.74] },
  ].map(({ qm, preisspanne }) => ({
    answers: {
      Typ: "Miete",
      Ost: false,
      Wohnlage: "einfach",
      Unterschrieben: "Ja",
      Vertragsdatum: "2022-2024",
      Baujahr: 1918,
      Qm: qm,
      "Wohnung hat Sammelheizung": "Ja",
      "Badezimmer in Wohnung": "Ja",
    } as FinalAnswers,
    preisspanne: preisspanne as Preisspanne,
  })),
])("getWorstBestPreisspanne(%o)", ({ answers, preisspanne }) => {
  expect(
    getWorstBestPreisspanne(
      answersToCalculationContext(answers, getVisibleQuestionAliases(answers))!,
    ),
  ).toEqual({
    best: preisspanne,
    worst: preisspanne,
  });
});

// Wohnlage
test.each([
  ...[
    { wohnlage: "einfach", preisspanne: [8.42, 5.86, 13.82] },
    { wohnlage: "mittel", preisspanne: [8.98, 7.16, 13.04] },
    { wohnlage: "gut", preisspanne: [12.19, 6.97, 15.17] },
  ].map(({ wohnlage, preisspanne }) => ({
    answers: {
      Typ: "Miete",
      Ost: false,
      Wohnlage: wohnlage,
      Unterschrieben: "Ja",
      Vertragsdatum: "2022-2024",
      Baujahr: 1918,
      Qm: 1,
      "Wohnung hat Sammelheizung": "Ja",
      "Badezimmer in Wohnung": "Ja",
    } as FinalAnswers,
    preisspanne: preisspanne as Preisspanne,
  })),
])("getWorstBestPreisspanne(%o)", ({ answers, preisspanne }) => {
  expect(
    getWorstBestPreisspanne(
      answersToCalculationContext(answers, getVisibleQuestionAliases(answers))!,
    ),
  ).toEqual({
    best: preisspanne,
    worst: preisspanne,
  });
});

// Ausstattungsabzuege
test.each([
  ...[
    {
      sammelheizung: "Ja",
      bad: "Ja",
      preisspanne: {
        best: [8.42, 5.86, 13.82],
        worst: [8.42, 5.86, 13.82],
      },
    },
    {
      sammelheizung: "Ja",
      bad: "Nicht sicher",
      preisspanne: {
        best: [6.91, 4.35, 12.31],
        worst: [8.42, 5.86, 13.82],
      },
    },
    {
      sammelheizung: "Ja",
      bad: "Nein",
      preisspanne: {
        best: [6.91, 4.35, 12.31],
        worst: [6.91, 4.35, 12.31],
      },
    },
    {
      sammelheizung: "Nicht sicher",
      bad: "Ja",
      preisspanne: {
        best: [6.91, 4.35, 12.31],
        worst: [8.42, 5.86, 13.82],
      },
    },
    {
      sammelheizung: "Nicht sicher",
      bad: "Nicht sicher",
      preisspanne: {
        best: [6.08, 3.52, 11.48],
        worst: [8.42, 5.86, 13.82],
      },
    },
    {
      sammelheizung: "Nicht sicher",
      bad: "Nein",
      preisspanne: {
        best: [6.08, 3.52, 11.48],
        worst: [6.91, 4.35, 12.31],
      },
    },
    {
      sammelheizung: "Nein",
      bad: "Ja",
      preisspanne: {
        best: [6.91, 4.35, 12.31],
        worst: [6.91, 4.35, 12.31],
      },
    },
    {
      sammelheizung: "Nein",
      bad: "Nicht sicher",
      preisspanne: {
        best: [6.08, 3.52, 11.48],
        worst: [6.91, 4.35, 12.31],
      },
    },
    {
      sammelheizung: "Nein",
      bad: "Nein",
      preisspanne: {
        best: [6.08, 3.52, 11.48],
        worst: [6.08, 3.52, 11.48],
      },
    },
  ].map(({ sammelheizung, bad, preisspanne }) => ({
    answers: {
      Typ: "Miete",
      Ost: false,
      Wohnlage: "einfach",
      Unterschrieben: "Ja",
      Vertragsdatum: "2022-2024",
      Baujahr: 1918,
      Qm: 1,
      "Wohnung hat Sammelheizung": sammelheizung,
      "Badezimmer in Wohnung": bad,
    } as FinalAnswers,
    preisspanne: preisspanne as { best: Preisspanne; worst: Preisspanne },
  })),
])("getWorstBestPreisspanne(%o)", ({ answers, preisspanne }) => {
  expect(
    getWorstBestPreisspanne(
      answersToCalculationContext(answers, getVisibleQuestionAliases(answers))!,
    ),
  ).toEqual(preisspanne);
});
