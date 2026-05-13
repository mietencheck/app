import { BeratungRecord } from "./types";

const DEFAULT_BERATUNG_RECORD: BeratungRecord = {
  typ: "Miete",
  vertragsdatum: ">2024",
  wohnflaeche: 100,
  baujahrSpanne: "-1918",
  wohnlage: "mittel",
  ausstattung: {
    sammelheizung: "Ja",
    bad: "Ja",
  },
  merkmale: {
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
        "Bad hat hochwertige Ausstattung": "unchecked",
        "Bad hat moderne Entlüftung": "unchecked",
        "Zweites WC oder Bad/WC getrennt": "unchecked",
        "Bad ist groß": "unchecked",
        "Bad hat Fußbodenheizung": "unchecked",
        "Bad hat hochwertige Boden- oder Wandfliesen": "unchecked",
        "Bad hat wandhängendes WC": "unchecked",
        "Bad hat von Badewanne getrennte Dusche": "unchecked",
        "Bad hat Strukturheizkörper": "unchecked",
        "Bad hat bodengleiche Dusche": "unchecked",
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
        "Küche ist nicht ausreichend gefliest": "unchecked",
      },
      Wohnwerterhoehend: {
        "Küche hat hochwertigen Bodenbelag": "unchecked",
        "Küche ist groß": "unchecked",
        "Küche hat Einbauküche": "unchecked",
        "Küche hat Ceran-/Induktionsherd": "unchecked",
        "Küche hat Dunstabzugshaube": "unchecked",
        "Küche hat Kühlschrank": "unchecked",
        "Küche hat freistehenden Küchenblock": "unchecked",
      },
    },
    Wohnung: {
      Wohnwertmindernd: {
        "Wohnung hat Einfachverglasung": "unchecked",
        "Wohnung hat schlechten Schnitt": "unchecked",
        "Wohnung hat kein Balkon": "unchecked",
        "Wohnung hat sichtbare Elektroinstallation": "unchecked",
        "Wohnung hat unzureichende Elektroinstallation": "unchecked",
        "Wohnung hat kein Waschmaschinen Anschluss": "unchecked",
        "Wohnung hat sichtbare Bewässerungsleitungen": "unchecked",
      },
      Wohnwerterhoehend: {
        "Wohnung hat großen Wohnraum": "unchecked",
        "Wohnung hat Einbauschrank/Abstellraum": "unchecked",
        "Wohnung hat großen Balkon": "unchecked",
        "Wohnung hat Schallschutzfenster/Wärmeschutzverglasung": "unchecked",
        "Wohnung hat Rollläden": "unchecked",
        "Wohnugn ist barrierearm": "unchecked",
        "Wohnung hat zusätzliche Einbruchssicherung": "unchecked",
        "Wohnung hat Fußbodenheizung": "unchecked",
        "Wohnung hat nicht sichtbare Heizungsrohre": "unchecked",
        "Wohnung hat hochwertigen Boden": "unchecked",
        "Wohnung hat aufwändige Deckenverkleidung": "unchecked",
      },
    },
    Gebäude: {
      Wohnwertmindernd: {
        "Gebäude Hauseingangstür ist nicht abschließbar": "unchecked",
        "Gebäude hat keine Gegensprechanlage": "unchecked",
        "Gebäude Treppenbereich/Eingangsbereich in schlechtem Zustand":
          "unchecked",
        "Gebäude in schlechten Instandhaltungszustand": "unchecked",
        "Wohnung ab fünftem Obergeschoss ohne Personenaufzug": "unchecked",
        "Gebäude hat keinen Mieterkeller oder Kellerersatzraum": "unchecked",
        "Gebäude in Seitenflügel oder Quergebäude bei verdichteter Bebauung":
          "unchecked",
        "Gebäude hat unzureichende Wärmedämmung": "unchecked",
        "Energieverbrauchskennwert größer als 170/155/145": "unchecked",
        "Energieverbrauchskennwert größer als 210/195": "unchecked",
        "Energieverbrauchskennwert größer als 250/235": "unchecked",
      },
      Wohnwerterhoehend: {
        "Gebäude hat Gegensprechanlage mit Video": "unchecked",
        "Gebäude hat hochwertigen Eingangsbereich": "unchecked",
        "Gebäude ist in überdurchschnittlich gutem Instandhaltungszustand":
          "unchecked",
        "Gebäude hat Aufzug bei weniger als fünf Geschossen": "unchecked",
        "Gebäude hat Fahrradabstellraum/Fahrradstellplätze": "unchecked",
        "Gebäude hat zusätzliche nutzbare Räume": "unchecked",
        "Gebäude hat zusätzliche Wärmedämmung": "unchecked",
        "Gebäude und Wohnung hat schwellenarmen Zugang": "unchecked",
        "Energieverbrauchskennwert kleiner als 120": "unchecked",
        "Energieverbrauchskennwert kleiner als 100": "unchecked",
        "Energieverbrauchskennwert kleiner als 80": "unchecked",
      },
    },
    Umfeld: {
      Wohnwertmindernd: {
        "Lage ist besonders lärmbelastet": "unchecked",
        "Lage ist besonders geruchsbelastet": "unchecked",
        "Keine Fahrradabstellmöglichkeit auf dem Grundstück": "unchecked",
        "Lage in vernachlässigter Umgebung": "unchecked",
      },
      Wohnwerterhoehend: {
        "Bevorzugte Citylage": "unchecked",
        "Besonders ruhige Lage": "unchecked",
        "Aufwändig gestaltetes Wohnumfeld auf dem Grundstück": "unchecked",
        "Garten zur alleinigen Nutzung": "unchecked",
        "Vom Vermieter zur Verfügung gestellter Parkplatz": "unchecked",
      },
    },
  },
  sondermerkmale: {
    "[Sondermerkmal] Moderne Küchenausstattung": "unchecked",
    "[Sondermerkmal] Aufzug im Haus": "unchecked",
  },
};

export function getDefaultBeratungRecord(): BeratungRecord {
  return structuredClone(DEFAULT_BERATUNG_RECORD);
}
