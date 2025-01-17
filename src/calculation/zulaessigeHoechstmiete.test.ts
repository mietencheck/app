import { expect, test } from "vitest";

import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";

import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "./answer-reset";
import { getWorstBestZulaessigeHoechstmiete } from "./zulaessigeHoechstmiete";

test.each([
  ...[
    {
      answers: {
        Vertragsdatum: "2016-2018",
        Baujahr: 1974,
        Ost: false,
        Wohnlage: "mittel",
        Qm: 20,
        "Bad & WC ohne Waschbecken": "Ja",
        "WC ohne Lüftung": "Ja",
        "Bad größer als 8qm": "Ja",
        "Bad mit Fußbodenheizung": "Ja",
        "Bad mit Strukturheizkörper": "Ja",
        "Küche hat Dunstabzug": "Ja",
        "Wohnung hat einfach verglaste Fenster": "Ja",
        "Wohnung hat Abstellraum": "Ja",
        "Wohnung hat Balkon": "Ja",
        "Wohnung hat großen Balkon": "Ja",
        "Gebäude hat Treppenhaus in schlechtem Zustand": "Ja",
        "Gebäude hat privaten Keller": "Nein",
        "Gebäude hat Fahrradstellplätze mit Anschließmöglichkeit": "Ja",
        "Kennt Energieverbrauch oder Energiebedarf": "Energieverbrauchswert",
        Energieverbrauchskennwert: "++",
        "Wohnumfeld hat Fahrradabstellmöglichkeiten": "Nein",
        "Wohnumfeld ist besonders leise": "Ja",
        "Wohnumfeld ist aufwendig gestaltet": "Ja",
      },
      result: {
        worst: 264,
        best: 264,
      },
    },
    {
      answers: {
        Vertragsdatum: "2016-2018",
        Baujahr: 1970,
        Ost: true,
        Wohnlage: "mittel",
        Qm: 40,
        "Bad ohne Heizung": "Ja",
        "Bad großes Waschbecken": "Ja",
        "Küche hat Kochmöglichkeit": "Nein",
        "Küche hat Spüle": "Nein",
        "Küche ist groß": "Ja",
        "Küche ist separater Raum": "Ja",
        "Küche hat hochwertigen Fußboden": "Ja",
        "Wohnung hat ausreichende Elektroinstallation": "Nein",
        "Wohnung hat nicht sichtbare Elektroinstallation": "Nein",
        "Wohnung hat aufwendige Wand- und Deckenverkleidung": "Ja",
        "Wohnung hat Rollläden": "Ja",
        "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Ja",
        "Gebäude hat Gegensprechanlage": "Nein",
        "Gebäude hat Treppenhaus in gutem Zustand": "Ja",
        "Gebäude hat moderne Heizanlage": "Ja",
        "Wohnumfeld ist geruchsbelastet": "Ja",
        "Wohnumfeld hat Parkplatz": "Ja",
      },
      result: {
        worst: 251.68,
        best: 251.68,
      },
    },
  ].map(({ answers, result }) => {
    return {
      answers: {
        Unterschrieben: "Ja",
        "Wohnung hat Sammelheizung": "Ja",
        "Badezimmer in Wohnung": "Ja",
        ...SONDERMERKMAL_RESET_ANSWERS,
        ...MERKMAL_RESET_ANSWERS,
        ...answers,
      } as FinalAnswers,
      result: result as { worst: number; best: number },
    };
  }),
])("getWorstBestZulaessigeHoechstmiete(%o)", ({ answers, result }) => {
  expect(
    getWorstBestZulaessigeHoechstmiete(
      answers,
      getVisibleQuestionAliases(answers),
    ),
  ).toEqual(result);
});
