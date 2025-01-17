import { expect, test } from "vitest";

import { getMerkmalStatesByGruppe, getSondermerkmalStates } from "~/form/api";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import { SondermerkmalStateList } from "~/form/utils/mapMerkmalStateToMerkmalGruppen";

import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "./answer-reset";

test.each([
  {
    description: "Case where all Sondermerkmale should be 'unchecked'",
    answers: {
      ...SONDERMERKMAL_RESET_ANSWERS,
      Unterschrieben: "Ja",
      Vertragsdatum: "2015-2016",
      Baujahr: 1918,
    } as FinalAnswers,
    result: {
      "[Sondermerkmal] Hochwertiger Bodenbelag": "unchecked",
      "[Sondermerkmal] Moderne Küchenausstattung": "unchecked",
      "[Sondermerkmal] Von der Badewanne getrennte Dusche": "unchecked",
      "[Sondermerkmal] Kleines Bad": "unchecked",
      "[Sondermerkmal] Modernes Bad": "unchecked",
      "[Sondermerkmal] Isolierverglasung/Schallschutzfenster": "unchecked",
      "[Sondermerkmal] Aufzug im Haus": "unchecked",
    } as SondermerkmalStateList,
  },
])("getSondermerkmalStates(%o)", ({ answers, result }) => {
  expect(
    getSondermerkmalStates(answers, getVisibleQuestionAliases(answers)),
  ).toEqual(result);
});

test.each([
  ...[
    {
      description:
        "Case where all Merkmale in Mietspiegel 2015 should be 'unchecked'",
      answers: {
        ...MERKMAL_RESET_ANSWERS,
        Vertragsdatum: "2015-2016",
      },
      merkmalgruppen: {
        Bad: {
          Wohnwertmindernd: {
            "Bad ohne Handwaschbecken": "unchecked",
            "WC ohne Entlüftung": "unchecked",
            "Bad mit Dielenfußboden": "unchecked",
            "Bad ohne Heizung": "unchecked",
            "Bad ohne ausreichende Warmwasserversorgung": "unchecked",
            "Bad ohne separate Dusche mit frei stehender Wanne": "unchecked",
            "Bad Wände nicht gefliest": "unchecked",
            "Bad mit WC ohne Fenster": "unchecked",
            "Bad ohne Duschmöglichkeit": "unchecked",
            "Bad ist klein": "unchecked",
          },
          Wohnwerterhoehend: {
            "Bad hat großes Waschbecken": "unchecked",
            "Bad hat moderne Entlüftung": "unchecked",
            "Zweites WC oder Bad/WC getrennt": "unchecked",
            "Bad ist groß": "unchecked",
            "Bad hat Fußbodenheizung": "unchecked",
            "Bad hat hochwertige Boden- oder Wandfliesen": "unchecked",
            "Bad hat hochwertige Ausstattung": "unchecked",
            "Bad hat wandhängendes WC": "unchecked",
            "Bad hat Strukturheizkörper": "unchecked",
            "Bad hat Einhebelmischbatterie": "unchecked",
            "Bad hat von Badewanne getrennte Dusche": "unchecked",
          },
        },
        Küche: {
          Wohnwertmindernd: {
            "Küche ohne Fenster/Entlüftung": "unchecked",
            "Küche ohne Kochmöglichkeit": "unchecked",
            "Küche ohne Spüle": "unchecked",
            "Küche ohne ausreichende Warmwasserversorgung": "unchecked",
            "Küche ohne Heizung": "unchecked",
            "Küche ohne Geschirrspüler Anschluss": "unchecked",
          },
          Wohnwerterhoehend: {
            "Küche hat hochwertigen Bodenbelag": "unchecked",
            "Küche ist groß": "unchecked",
            "Küche hat Einbauküche": "unchecked",
            "Küche hat Ceran-/Induktionsherd": "unchecked",
            "Küche hat Dunstabzugshaube": "unchecked",
            "Küche hat Kühlschrank": "unchecked",
          },
        },
        Wohnung: {
          Wohnwertmindernd: {
            "Wohnung hat Einfachverglasung": "unchecked",
            "Wohnung hat unzureichende Elektroinstallation": "unchecked",
            "Wohnung hat sichtbare Elektroinstallation": "unchecked",
            "Wohnung hat sichtbare Bewässerungsleitungen": "unchecked",
            "Wohnung hat kein Waschmaschinen Anschluss": "unchecked",
            "Wohnung hat schlechten Schnitt": "unchecked",
            "Wohnung hat kein Balkon": "unchecked",
            "Wohnung hat kein Breitbandanschluss": "unchecked",
          },
          Wohnwerterhoehend: {
            "Wohnung hat Einbauschrank/Abstellraum": "unchecked",
            "Wohnung hat großen Balkon": "unchecked",
            "Wohnung hat Fußbodenheizung": "unchecked",
            "Wohnung hat aufwändige Deckenverkleidung": "unchecked",
            "Wohnung hat nicht sichtbare Heizungsrohre": "unchecked",
            "Wohnung hat rückkanalfähigen Breitbandanschluss": "unchecked",
            "Wohnugn hat Rollläden": "unchecked",
            "Wohnugn hat wohnungsbezogenen Kaltwasserzähler": "unchecked",
            "Wohnung hat großen Wohnraum": "unchecked",
            "Wohnugn ist barrierearm": "unchecked",
            "Wohnung hat Schallschutzfenster/Wärmeschutzverglasung":
              "unchecked",
            "Wohnung hat hochwertigen Boden": "unchecked",
          },
        },
        Gebäude: {
          Wohnwertmindernd: {
            "Gebäude Treppenbereich/Eingangsbereich in schlechtem Zustand":
              "unchecked",
            "Gebäude hat keinen Mieterkeller oder Kellerersatzraum":
              "unchecked",
            "Gebäude Hauseingangstür ist nicht abschließbar": "unchecked",
            "Gebäude in schlechten Instandhaltungszustand": "unchecked",
            "Gebäude in Seitenflügel oder Quergebäude bei verdichteter Bebauung":
              "unchecked",
            "Gebäude hat keine Gegensprechanlage": "unchecked",
            "Gebäude hat keine Fahrradabstellmöglichkeit": "unchecked",
            "Gebäude hat unzureichende Wärmedämmung": "unchecked",
            "Energieverbrauchskennwert größer als 170/155/145": "unchecked",
            "Energieverbrauchskennwert größer als 210/195": "unchecked",
            "Energieverbrauchskennwert größer als 250/235": "unchecked",
          },
          Wohnwerterhoehend: {
            "Gebäude hat Fahrradabstellraum/Fahrradstellplätze": "unchecked",
            "Gebäude hat zusätzliche nutzbare Räume": "unchecked",
            "Gebäude hat Auto Stellplatz": "unchecked",
            "Gebäude hat hochwertigen Eingangsbereich": "unchecked",
            "Gebäude hat zusätzliche Einbruchsicherung": "unchecked",
            "Gebäude hat Gegensprechanlage mit Video": "unchecked",
            "Gebäude hat Aufzug bei weniger als fünf Geschossen": "unchecked",
            "Gebäude hat zusätzliche Wärmedämmung": "unchecked",
            "Energieverbrauchskennwert kleiner als 120": "unchecked",
            "Energieverbrauchskennwert kleiner als 100": "unchecked",
            "Energieverbrauchskennwert kleiner als 80": "unchecked",
          },
        },
        Umfeld: {
          Wohnwertmindernd: {
            "Lage in vernachlässigter Umgebung": "unchecked",
            "Lage ist besonders lärmbelastet": "unchecked",
            "Lage ist regelmäßig beeinträchtigt durch Geräusche oder Gerüche von Gewerbe":
              "unchecked",
            "Ungepflegte und offene Müllstandfläche": "unchecked",
          },
          Wohnwerterhoehend: {
            "Bevorzugte Citylage": "unchecked",
            "Besonders ruhige Lage": "unchecked",
            "Aufwändig gestaltetes Wohnumfeld auf dem Grundstück": "unchecked",
            "Gepflegte Müllstandsfläche": "unchecked",
            "Villenartige Mehrfamilienhäuser": "unchecked",
            "Garten zur alleinigen Nutzung": "unchecked",
          },
        },
      },
    },
    // TODO: Add tests for 2017-2023
    {
      description:
        "Case where all Merkmale in Mietspiegel 2023 should be 'unchecked'",
      answers: {
        ...MERKMAL_RESET_ANSWERS,
        Vertragsdatum: "2022-2024",
      },
      merkmalgruppen: {
        Bad: {
          Wohnwerterhoehend: {
            "Bad hat Fußbodenheizung": "unchecked",
            "Bad hat Strukturheizkörper": "unchecked",
            "Bad hat großes Waschbecken": "unchecked",
            "Bad hat hochwertige Ausstattung": "unchecked",
            "Bad hat hochwertige Boden- oder Wandfliesen": "unchecked",
            "Bad hat moderne Entlüftung": "unchecked",
            "Bad hat von Badewanne getrennte Dusche": "unchecked",
            "Bad hat wandhängendes WC": "unchecked",
            "Bad ist groß": "unchecked",
            "Zweites WC oder Bad/WC getrennt": "unchecked",
          },
          Wohnwertmindernd: {
            "Bad Wände nicht gefliest": "unchecked",
            "Bad ohne Handwaschbecken": "unchecked",
            "WC ohne Entlüftung": "unchecked",
            "Bad mit Dielenfußboden": "unchecked",
            "Bad ohne Heizung": "unchecked",
            "Bad ohne ausreichende Warmwasserversorgung": "unchecked",
            "Bad ohne separate Dusche mit frei stehender Wanne": "unchecked",
            "Bad mit WC ohne Fenster": "unchecked",
            "Bad ohne Duschmöglichkeit": "unchecked",
            "Bad ist klein": "unchecked",
          },
        },
        Küche: {
          Wohnwerterhoehend: {
            "Küche hat hochwertigen Bodenbelag": "unchecked",
            "Küche ist groß": "unchecked",
            "Küche hat Einbauküche": "unchecked",
            "Küche hat Ceran-/Induktionsherd": "unchecked",
            "Küche hat Dunstabzugshaube": "unchecked",
            "Küche hat Kühlschrank": "unchecked",
          },
          Wohnwertmindernd: {
            "Küche ohne Kochmöglichkeit": "unchecked",
            "Küche ohne Fenster/Entlüftung": "unchecked",
            "Küche ohne Spüle": "unchecked",
            "Küche ohne ausreichende Warmwasserversorgung": "unchecked",
            "Küche ohne Heizung": "unchecked",
            "Küche ohne Geschirrspüler Anschluss": "unchecked",
          },
        },
        Wohnung: {
          Wohnwerterhoehend: {
            "Wohnung hat Einbauschrank/Abstellraum": "unchecked",
            "Wohnung hat großen Balkon": "unchecked",
            "Wohnung hat Fußbodenheizung": "unchecked",
            "Wohnung hat aufwändige Deckenverkleidung": "unchecked",
            "Wohnung hat nicht sichtbare Heizungsrohre": "unchecked",
            "Wohnugn hat Rollläden": "unchecked",
            "Wohnugn hat wohnungsbezogenen Kaltwasserzähler": "unchecked",
            "Wohnung hat großen Wohnraum": "unchecked",
            "Wohnugn ist barrierearm": "unchecked",
            "Wohnung hat hochwertigen Boden": "unchecked",
            "Wohnung hat Schallschutzfenster/Wärmeschutzverglasung":
              "unchecked",
            "Wohnugn hat zusätzliche Einbruchssicherung": "unchecked",
          },
          Wohnwertmindernd: {
            "Wohnung hat Einfachverglasung": "unchecked",
            "Wohnung hat unzureichende Elektroinstallation": "unchecked",
            "Wohnung hat sichtbare Elektroinstallation": "unchecked",
            "Wohnung hat sichtbare Bewässerungsleitungen": "unchecked",
            "Wohnung hat kein Waschmaschinen Anschluss": "unchecked",
            "Wohnung hat schlechten Schnitt": "unchecked",
            "Wohnung hat kein Balkon": "unchecked",
          },
        },
        Gebäude: {
          Wohnwerterhoehend: {
            "Gebäude hat Fahrradabstellraum/Fahrradstellplätze": "unchecked",
            "Gebäude hat zusätzliche nutzbare Räume": "unchecked",
            "Gebäude hat hochwertigen Eingangsbereich": "unchecked",
            "Gebäude hat Gegensprechanlage mit Video": "unchecked",
            "Gebäude hat Aufzug bei weniger als fünf Geschossen": "unchecked",
            "Gebäude hat zusätzliche Wärmedämmung": "unchecked",
            "Energieverbrauchskennwert kleiner als 120": "unchecked",
            "Energieverbrauchskennwert kleiner als 100": "unchecked",
            "Energieverbrauchskennwert kleiner als 80": "unchecked",
          },
          Wohnwertmindernd: {
            "Gebäude Treppenbereich/Eingangsbereich in schlechtem Zustand":
              "unchecked",
            "Gebäude hat keine Gegensprechanlage": "unchecked",
            "Gebäude hat keinen Mieterkeller oder Kellerersatzraum":
              "unchecked",
            "Gebäude hat unzureichende Wärmedämmung": "unchecked",
            "Gebäude in Seitenflügel oder Quergebäude bei verdichteter Bebauung":
              "unchecked",
            "Gebäude in schlechten Instandhaltungszustand": "unchecked",
            "Gebäude Hauseingangstür ist nicht abschließbar": "unchecked",
            "Wohnung ab fünftem Obergeschoss ohne Personenaufzug": "unchecked",
            "Energieverbrauchskennwert größer als 170/155/145": "unchecked",
            "Energieverbrauchskennwert größer als 210/195": "unchecked",
            "Energieverbrauchskennwert größer als 250/235": "unchecked",
          },
        },
        Umfeld: {
          Wohnwerterhoehend: {
            "Aufwändig gestaltetes Wohnumfeld auf dem Grundstück": "unchecked",
            "Besonders ruhige Lage": "unchecked",
            "Garten zur alleinigen Nutzung": "unchecked",
            "Vom Vermieter zur Verfügung gestellter Parkplatz": "unchecked",
            "Bevorzugte Citylage": "unchecked",
          },
          Wohnwertmindernd: {
            "Lage in vernachlässigter Umgebung": "unchecked",
            "Lage ist besonders geruchsbelastet": "unchecked",
            "Lage ist besonders lärmbelastet": "unchecked",
            "Keine Fahrradabstellmöglichkeit auf dem Grundstück": "unchecked",
          },
        },
      },
    },
  ].map(({ answers, merkmalgruppen }) => ({
    answers: {
      ...answers,
      Ost: false,
      Wohnlage: "einfach",
      Unterschrieben: "Ja",
      Baujahr: 1918,
      Qm: 1,
      "Wohnung hat Sammelheizung": "Ja",
      "Badezimmer in Wohnung": "Ja",
    } as FinalAnswers,
    merkmalgruppen: merkmalgruppen,
  })),
])("getMerkmalGruppenStates(%o)", ({ answers, merkmalgruppen }) => {
  expect(
    getMerkmalStatesByGruppe(answers, getVisibleQuestionAliases(answers)),
  ).toEqual(merkmalgruppen);
});
