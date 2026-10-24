import { expect, test } from "vitest";

import { getWorstBestSondermerkmalModifier } from "~/calculation/sondermerkmale";
import { getSondermerkmalStates } from "~/form/api";
import { answersToCalculationContext } from "~/form/calculation-context";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import { questionsByAlias } from "~/form/flow-machine-runtime";
import {
  SCHNELLTEST_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";
import { hash } from "~/l10n";

import EN from "../../../../public/locales/en.json";
import { SONDERMERKMAL_DEFAULT_STATE } from "./merkmal-default-state";

test.each([
  ...[
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1918,
        "Sondermerkmal Modernes Bad": "Ja",
      },
      expected: {
        "[Sondermerkmal] Modernes Bad": "checked",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1918,
        "Sondermerkmal Modernes Bad": "Nicht sicher",
      },
      expected: {
        "[Sondermerkmal] Modernes Bad": "maybe",
      },
    },
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1918,
        "Sondermerkmal Modernes Bad": "Nein",
      },
      expected: {
        "[Sondermerkmal] Modernes Bad": "unchecked",
      },
    },
    // Check if answer is ignored for Baujahr when no Sondermerkmal Aufschlag is defined
    {
      answers: {
        Vertragsdatum: "2015-2016",
        Baujahr: 1991,
        "Sondermerkmal Modernes Bad": "Ja",
      },
      expected: {
        "[Sondermerkmal] Modernes Bad": "unchecked",
      },
    },
  ].map(({ answers, expected }) => {
    return {
      answers: {
        ...SCHNELLTEST_RESET_ANSWERS,
        ...SONDERMERKMAL_RESET_ANSWERS,
        ...answers,
      } as FinalAnswers,
      expected: {
        ...SONDERMERKMAL_DEFAULT_STATE,
        ...expected,
      },
    };
  }),
])("getMerkmalStates(%o)", ({ answers, expected }) => {
  expect(
    getSondermerkmalStates(answers, getVisibleQuestionAliases(answers)),
  ).toEqual(expected);
});

test("the German and English help require the complete Modernes Bad equipment", () => {
  const info = questionsByAlias.get("Sondermerkmal Modernes Bad")!.info!;
  const english = EN.strings[hash(info) as keyof typeof EN.strings];

  for (const component of [
    "alle folgenden Ausstattungen",
    "ausreichend geflieste Wände im Spritzwasserbereich von Waschbecken, Badewanne und/oder Dusche",
    "Bodenfliesen",
    "Einbauwanne und/oder -dusche",
    "Einhebelmischbatterie",
    "Strukturheizkörper als Handtuchwärmer",
    "Eine freistehende Badewanne ohne Einbauwanne oder Einbaudusche genügt nicht.",
  ]) {
    expect(info).toContain(component);
  }
  for (const component of [
    "requires all of the following",
    "adequately tiled walls in the splash areas of the washbasin, bathtub and/or shower",
    "floor tiles",
    "a built-in bathtub and/or built-in shower",
    "a single-lever mixer tap",
    "a structural radiator serving as a towel warmer",
    "A freestanding bathtub without a built-in bathtub or built-in shower is not sufficient.",
  ]) {
    expect(english).toContain(component);
  }
});

// Source: Mietspiegel 2015, printed p. 15, Modernes Bad row.
test.each([
  { Baujahr: 1918, Ost: false, aufschlag: 0.34 },
  { Baujahr: 1919, Ost: false, aufschlag: 0.4 },
  { Baujahr: 1949, Ost: false, aufschlag: 0.4 },
  { Baujahr: 1950, Ost: false, aufschlag: 0.28 },
  { Baujahr: 1964, Ost: false, aufschlag: 0.28 },
  { Baujahr: 1965, Ost: false, aufschlag: 0.12 },
  { Baujahr: 1972, Ost: false, aufschlag: 0.12 },
  { Baujahr: 1973, Ost: false, aufschlag: 0 },
  { Baujahr: 1973, Ost: true, aufschlag: 0.16 },
  { Baujahr: 1990, Ost: false, aufschlag: 0 },
  { Baujahr: 1990, Ost: true, aufschlag: 0.16 },
  { Baujahr: 1991, Ost: true, aufschlag: 0 },
  { Baujahr: 2002, Ost: false, aufschlag: 0 },
  { Baujahr: 2003, Ost: false, aufschlag: 0 },
])(
  "Modernes Bad for Baujahr $Baujahr, Ost=$Ost",
  ({ aufschlag, ...period }) => {
    // These are user answers to the full equipment list, not automatic detection
    // of fixtures: a freestanding tub alone must be answered Nein.
    for (const { example, answer, expectedState, expected } of [
      {
        example: "Einbauwanne and all other required equipment",
        answer: "Ja",
        expectedState: "checked",
        expected: { worst: aufschlag, best: aufschlag },
      },
      {
        example: "Einbaudusche and all other required equipment",
        answer: "Ja",
        expectedState: "checked",
        expected: { worst: aufschlag, best: aufschlag },
      },
      {
        example: "freestanding tub without Einbauwanne or Einbaudusche",
        answer: "Nein",
        expectedState: "unchecked",
        expected: { worst: 0, best: 0 },
      },
      {
        example: "uncertain whether the complete equipment list is present",
        answer: "Nicht sicher",
        expectedState: "maybe",
        expected: { worst: aufschlag, best: 0 },
      },
    ] as const) {
      const answers: FinalAnswers = {
        ...SCHNELLTEST_RESET_ANSWERS,
        ...SONDERMERKMAL_RESET_ANSWERS,
        Typ: "Miete",
        Vertragsdatum: "2015-2016",
        ...period,
        "Sondermerkmal Modernes Bad": answer,
      };
      const visible = getVisibleQuestionAliases(answers);
      expect(visible.has("Sondermerkmal Modernes Bad"), example).toBe(
        aufschlag > 0,
      );
      expect(
        getSondermerkmalStates(answers, visible)![
          "[Sondermerkmal] Modernes Bad"
        ],
        example,
      ).toBe(aufschlag > 0 ? expectedState : "unchecked");
      expect(
        getWorstBestSondermerkmalModifier(
          answersToCalculationContext(answers, visible)!,
        ),
        example,
      ).toEqual(expected);
    }
  },
);

test.each([
  "2016-2018",
  "2018-2020",
  "2020-2022",
  "2022-2024",
  "2024-2026",
  ">2026",
] as const)(
  "Modernes Bad is not asked after Mietspiegel 2015 (%s)",
  (Vertragsdatum) => {
    expect(
      getVisibleQuestionAliases({
        ...SCHNELLTEST_RESET_ANSWERS,
        ...SONDERMERKMAL_RESET_ANSWERS,
        Typ: "Miete",
        Vertragsdatum,
        Baujahr: 1918,
      }).has("Sondermerkmal Modernes Bad"),
    ).toBe(false);
  },
);
