import { expect, test } from "vitest";

import { getWorstBestOrtsueblicheVergleichsmiete } from "~/calculation/ortsueblicheVergleichsmiete";
import { answersToCalculationContext } from "~/form/calculation-context";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";

import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "../form/mappings/answer-reset";

test.each([
  ...[
    {
      description: "Case where all Merkmale and Sondermerkmale are 'unchecked'",
      answers: {},
      result: {
        worst: 6.48,
        best: 6.48,
      },
    },
    {
      description: "Case where one Merkmalgruppe is wohnwertmindernd",
      answers: {
        "Bad hat Duschmöglichkeit": "Nein", // [Bad-]
      },
      result: {
        worst: 6.15,
        best: 6.15,
      },
    },
    {
      description: "Case where one Merkmalgruppe is wohnwertsteigernd",
      answers: {
        "Mehrere WCs": "Ja", // [Bad+]
      },
      result: {
        worst: 6.89,
        best: 6.89,
      },
    },
    {
      description:
        "Case where one Merkmalgruppe is wohnwertsteigernd or wohnwertmindernd",
      answers: {
        "Bad hat Duschmöglichkeit": "Nicht sicher", // [Bad-]
        "Mehrere WCs": "Nicht sicher", // [Bad+]
      },
      result: {
        worst: 6.89,
        best: 6.15,
      },
    },
    {
      description:
        "Case where all Merkmalgruppen are wohnwertsteigernd or wohnwertmindernd",
      answers: {
        "Bad hat Duschmöglichkeit": "Nicht sicher", // [Bad-]
        "Mehrere WCs": "Nicht sicher", // [Bad+]

        "Küche hat Spüle": "Nicht sicher", // [Küche-]
        "Küche hat Einbauküche": "Nicht sicher", // [Küche+]

        "Wohnung hat einfach verglaste Fenster": "Nicht sicher", // [Wohnung-]
        "Wohnung hat großen Wohnraum": "Nicht sicher", // [Wohnung+]

        "Gebäude hat Gegensprechanlage": "Nicht sicher", // [Gebäude-]
        "Gebäude hat Treppenhaus in gutem Zustand": "Nicht sicher", // [Gebäude+]

        "Wohnumfeld ist stark vernachlässigt": "Nicht sicher", // [Umfeld-],
        "Wohnumfeld ist repräsentativ": "Nicht sicher", // [Umfeld+]
      },
      result: {
        worst: 8.55,
        best: 4.81,
      },
    },
    {
      description: "Case where a Sondermerkmal is 'checked'",
      answers: {
        "Sondermerkmal Bodenbelag": "Ja",
      },
      result: {
        worst: 7.04,
        best: 7.04,
      },
    },
    {
      description: "Case where a Sondermerkmal is 'maybe'",
      answers: {
        "Sondermerkmal Bodenbelag": "Nicht sicher",
      },
      result: {
        worst: 7.04,
        best: 6.48,
      },
    },
    {
      description:
        "Case where upper threshold is exceeded, because all Sondermerkmale are 'checked'",
      answers: {
        "Sondermerkmal Bodenbelag": "Ja",
        "Sondermerkmal Moderne Küche": "Ja",
        "Sondermerkmal Dusche Und Badewanne": "Ja",
        "Sondermerkmal Badezimmer Klein": "Nein",
        "Sondermerkmal Modernes Bad": "Ja",
        "Sondermerkmal Schallschutzfenster": "Ja",
        "Sondermerkmal Aufzug": "Ja",
      },
      result: {
        worst: 10.3,
        best: 10.3,
      },
    },
    {
      description:
        "Case where upper threshold is exceeded but Spanneneinordnung is not applied, because all Sondermerkmale are 'checked' and a Merkmalgruppe is wohnwerterhoehend",
      answers: {
        "Sondermerkmal Bodenbelag": "Ja",
        "Sondermerkmal Moderne Küche": "Ja",
        "Sondermerkmal Dusche Und Badewanne": "Ja",
        "Sondermerkmal Badezimmer Klein": "Nein",
        "Sondermerkmal Modernes Bad": "Ja",
        "Sondermerkmal Schallschutzfenster": "Ja",
        "Sondermerkmal Aufzug": "Ja",
        "Mehrere WCs": "Ja", // [Bad+]
      },
      result: {
        worst: 10.3,
        best: 10.3,
      },
    },
    {
      description:
        "Case where upper threshold would be exceeded, because a Sondermerkmal is 'checked' and all Merkmalgruppen are wohnwerterhoehend.",
      answers: {
        "Mehrere WCs": "Ja", // [Bad+]
        "Küche hat Einbauküche": "Ja", // [Küche+]
        "Wohnung hat großen Wohnraum": "Ja", // [Wohnung+]
        "Gebäude hat Treppenhaus in gutem Zustand": "Ja", // [Gebäude+]
        "Wohnumfeld ist repräsentativ": "Ja", // [Umfeld+]
        "Sondermerkmal Bodenbelag": "Ja",
      },
      result: {
        worst: 8.55,
        best: 8.55,
      },
    },
  ].map(({ description, answers, result }) => {
    return {
      description: description,
      answers: {
        Typ: "Miete",
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
])("getWorstBestOrtsueblicheVergleichsmiete(%o)", ({ answers, result }) => {
  expect(
    getWorstBestOrtsueblicheVergleichsmiete(
      answersToCalculationContext(answers, getVisibleQuestionAliases(answers))!,
    ),
  ).toEqual(result);
});
