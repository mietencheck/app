import { FinalAnswers } from "~/form/flow-machine";
import { Merkmal } from "~/mietspiegel/types";

export type Condition = {
  [key in keyof FinalAnswers]: string;
};

export type ConditionGroup = {
  logic: "or" | "and";
  conditions: Condition[];
};

export type AnswerMerkmalStateMapping = {
  [key in Merkmal]: {
    checked_if: ConditionGroup | Condition;
  };
};

export const answersToMerkmalStateMapping = {
  "[Bad-] Bad ohne Handwaschbecken": {
    checked_if: {
      logic: "or",
      conditions: [
        { "Bad & WC ohne Waschbecken": "Ja" },
        { "Bad nur kleines Waschbecken": "Ja" },
      ],
    },
  },
  "[Bad-] WC ohne Entlüftung": {
    checked_if: { "WC ohne Lüftung": "Ja" },
  },
  "[Bad-] Bad mit Dielenfußboden": {
    checked_if: { "Bad mit Dielenfußboden": "Ja" },
  },
  "[Bad-] Bad ohne Heizung": {
    checked_if: {
      logic: "or",
      conditions: [
        { "Bad ohne Heizung": "Ja" },
        { "Bad mit alter Heizung": "Ja" },
      ],
    },
  },
  "[Bad-] Bad ohne ausreichende Warmwasserversorgung": {
    checked_if: { "Bad hat Warmwasser": "Nein" },
  },
  "[Bad-] Bad ohne separate Dusche mit frei stehender Wanne": {
    checked_if: {
      logic: "and",
      conditions: [
        { "Duschen nur in freistehender Badewanne": "Ja" },
        {
          "Duschen nur in freistehender Badewanne in nicht modernisiertem Bad":
            "Ja",
        },
      ],
    },
  },
  "[Bad-] Bad Wände nicht gefliest": {
    checked_if: { "Bad Wände ausreichend gefließt": "Nein" },
  },
  "[Bad-] Bad mit WC ohne Fenster": {
    checked_if: { "Bad mit WC ohne Fenster": "Ja" },
  },
  "[Bad-] Bad ohne Duschmöglichkeit": {
    checked_if: { "Bad hat Duschmöglichkeit": "Nein" },
  },
  "[Bad-] Bad ist klein": {
    checked_if: { "Bad größer als 4qm": "Nein" },
  },
  "[Bad+] Bad hat großes Waschbecken": {
    checked_if: { "Bad großes Waschbecken": "Ja" },
  },
  "[Bad+] Bad hat hochwertige Ausstattung": {
    checked_if: { "Bad mit hochwertiger Ausstattung": "Ja" },
  },
  "[Bad+] Bad hat moderne Entlüftung": {
    checked_if: { "Bad mit moderner Entlüftung": "Ja" },
  },
  "[Bad+] Zweites WC oder Bad/WC getrennt": {
    checked_if: {
      logic: "or",
      conditions: [{ "Mehrere WCs": "Ja" }, { "Getrenntes WC": "Ja" }],
    },
  },
  "[Bad+] Bad ist groß": {
    checked_if: { "Bad größer als 8qm": "Ja" },
  },
  "[Bad+] Bad hat Fußbodenheizung": {
    checked_if: { "Bad mit Fußbodenheizung": "Ja" },
  },
  "[Bad+] Bad hat hochwertige Boden- oder Wandfliesen": {
    checked_if: { "Bad Boden und Wand hochwertig": "Ja" },
  },
  "[Bad+] Bad hat wandhängendes WC": {
    checked_if: {
      logic: "or",
      conditions: [
        { "Bad hat wandhängendes WC": "Ja" },
        { "Bad hat hochwertiges Stand-WC": "Ja" },
      ],
    },
  },
  "[Bad+] Bad hat Einhebelmischbatterie": {
    checked_if: { "Bad hat Einhebelmischbatterie": "Ja" },
  },
  "[Bad+] Bad hat von Badewanne getrennte Dusche": {
    checked_if: { "Bad hat Dusche und Wanne": "Ja" },
  },
  "[Bad+] Bad hat Strukturheizkörper": {
    checked_if: { "Bad mit Strukturheizkörper": "Ja" },
  },
  "[Bad+] Bad hat bodengleiche Dusche": {
    checked_if: { "Bad hat bodengleiche Dusche": "Ja" },
  },

  // Küche
  "[Küche-] Küche ohne Fenster/Entlüftung": {
    checked_if: { "Küche hat Lüftung": "Nein" },
  },
  "[Küche-] Küche ohne Kochmöglichkeit": {
    checked_if: {
      logic: "or",
      conditions: [
        { "Küche hat Kochmöglichkeit": "Nein" },
        { "Küche hat Gas/Elektroherd ohne Backofen": "Ja" },
      ],
    },
  },
  "[Küche-] Küche ohne Spüle": {
    checked_if: { "Küche hat Spüle": "Nein" },
  },
  "[Küche-] Küche ohne ausreichende Warmwasserversorgung": {
    checked_if: { "Küche hat Warmwasser": "Nein" },
  },
  "[Küche-] Küche ohne Heizung": {
    checked_if: { "Küche hat Heizung": "Nein" },
  },
  "[Küche-] Küche ohne Geschirrspüler Anschluss": {
    checked_if: { "Küche kann Spülmaschine": "Nein" },
  },
  "[Küche+] Küche hat hochwertigen Bodenbelag": {
    checked_if: { "Küche hat hochwertigen Fußboden": "Ja" },
  },
  "[Küche+] Küche ist groß": {
    checked_if: {
      logic: "and",
      conditions: [
        { "Küche ist groß": "Ja" },
        { "Küche ist separater Raum": "Ja" },
      ],
    },
  },
  "[Küche+] Küche hat Einbauküche": {
    checked_if: { "Küche hat Einbauküche": "Ja" },
  },
  "[Küche+] Küche hat Ceran-/Induktionsherd": {
    checked_if: { "Küche hat Ceran-/Induktionsherd": "Ja" },
  },
  "[Küche+] Küche hat Dunstabzugshaube": {
    checked_if: { "Küche hat Dunstabzug": "Ja" },
  },
  "[Küche+] Küche hat Kühlschrank": {
    checked_if: { "Küche hat Kühlschrank": "Ja" },
  },

  // Wohnung
  "[Wohnung-] Wohnung hat Einfachverglasung": {
    checked_if: {
      "Wohnung hat einfach verglaste Fenster": "Ja",
    },
  },
  "[Wohnung-] Wohnung hat schlechten Schnitt": {
    checked_if: { "Wohnung hat Durchgangszimmer": "Ja" },
  },
  "[Wohnung-] Wohnung hat kein Balkon": {
    checked_if: {
      logic: "and",
      conditions: [
        { "Wohnung hat Balkon": "Nein" },
        { "Wohnung keinen Balkon weil unmöglich": "Ja" },
      ],
    },
  },
  "[Wohnung-] Wohnung hat sichtbare Elektroinstallation": {
    checked_if: {
      "Wohnung hat nicht sichtbare Elektroinstallation": "Nein",
    },
  },
  "[Wohnung-] Wohnung hat unzureichende Elektroinstallation": {
    checked_if: {
      logic: "or",
      conditions: [
        { "Wohnung hat ausreichende Elektroinstallation": "Nein" },
        { "Wohnung hat Raum mit <2 Steckdosen": "Ja" },
      ],
    },
  },
  "[Wohnung-] Wohnung hat kein Breitbandanschluss": {
    checked_if: { "Wohnung hat Kabelanschluss": "Nein" },
  },
  "[Wohnung-] Wohnung hat kein Waschmaschinen Anschluss": {
    checked_if: { "Wohnung kann Waschmaschiene": "Nein" },
  },
  "[Wohnung-] Wohnung hat sichtbare Bewässerungsleitungen": {
    checked_if: { "Wohnnung hat sichtbare Bewässerungsleitungen": "Ja" },
  },
  "[Wohnung+] Wohnung hat großen Wohnraum": {
    checked_if: { "Wohnung hat großen Wohnraum": "Ja" },
  },
  "[Wohnung+] Wohnung hat Einbauschrank/Abstellraum": {
    checked_if: { "Wohnung hat Abstellraum": "Ja" },
  },
  "[Wohnung+] Wohnung hat großen Balkon": {
    checked_if: {
      logic: "and",
      conditions: [
        { "Wohnung hat Balkon": "Ja" },
        { "Wohnung hat großen Balkon": "Ja" },
      ],
    },
  },
  "[Wohnung+] Wohnung hat Schallschutzfenster/Wärmeschutzverglasung": {
    checked_if: {
      "Wohnung hat Schallschutzfenster": "Ja",
    },
  },
  "[Wohnung+] Wohnugn hat Rollläden": {
    checked_if: { "Wohnung hat Rollläden": "Ja" },
  },
  "[Wohnung+] Wohnugn ist barrierearm": {
    checked_if: { "Wohnung ist barrierearm": "Ja" },
  },
  "[Wohnung+] Wohnugn hat zusätzliche Einbruchssicherung": {
    checked_if: { "Wohnung hat verstärkte Tür": "Ja" },
  },
  "[Wohnung+] Wohnugn hat wohnungsbezogenen Kaltwasserzähler": {
    checked_if: {
      logic: "and",
      conditions: [
        { "Wohnung hat Kaltwasserzähler": "Ja" },
        { "Mieter zahlt für Kaltwasserzähler": "Nein" },
      ],
    },
  },
  "[Wohnung+] Wohnung hat Fußbodenheizung": {
    checked_if: { "Wohnung hat Fußbodenheizung": "Ja" },
  },
  "[Wohnung+] Wohnung hat nicht sichtbare Heizungsrohre": {
    checked_if: { "Wohnung hat sichtbare Heizungsrohe": "Nein" },
  },
  "[Wohnung+] Wohnung hat hochwertigen Boden": {
    checked_if: { "Wohnung hat hochwertigen Bodenbelag": "Ja" },
  },
  "[Wohnung+] Wohnung hat rückkanalfähigen Breitbandanschluss": {
    checked_if: { "Wohnung hat Internetanschluss": "Ja" },
  },
  "[Wohnung+] Wohnung hat aufwändige Deckenverkleidung": {
    checked_if: { "Wohnung hat aufwendige Wand- und Deckenverkleidung": "Ja" },
  },

  // Gebäude
  "[Gebäude-] Gebäude Hauseingangstür ist nicht abschließbar": {
    checked_if: {
      "Gebäude Hauseingangstür ist nicht abschließbar": "Ja",
    },
  },
  "[Gebäude-] Gebäude hat keine Gegensprechanlage": {
    checked_if: {
      "Gebäude hat Gegensprechanlage": "Nein",
    },
  },
  "[Gebäude-] Gebäude Treppenbereich/Eingangsbereich in schlechtem Zustand": {
    checked_if: {
      "Gebäude hat Treppenhaus in schlechtem Zustand": "Ja",
    },
  },
  "[Gebäude-] Gebäude in schlechten Instandhaltungszustand": {
    checked_if: {
      "Gebäude ist in schlechtem Zustand": "Ja",
    },
  },
  "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug": {
    checked_if: {
      logic: "and",
      conditions: [
        { "Gebäude hat Fahrstuhl": "Ja" },
        { "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Ja" },
      ],
    },
  },
  "[Gebäude-] Gebäude hat keine Fahrradabstellmöglichkeit": {
    checked_if: {
      "Gebäude hat Fahrradabstellmöglichkeit": "Nein",
    },
  },
  "[Gebäude-] Gebäude hat keinen Mieterkeller oder Kellerersatzraum": {
    checked_if: {
      logic: "or",
      conditions: [
        { "Gebäude hat privaten Abstellraum": "Nein" },
        { "Gebäude hat privaten Keller": "Nein" },
      ],
    },
  },
  "[Gebäude-] Gebäude in Seitenflügel oder Quergebäude bei verdichteter Bebauung":
    {
      checked_if: { "Gebäude ist dicht bebaut": "Ja" },
    },
  "[Gebäude-] Gebäude hat unzureichende Wärmedämmung": {
    checked_if: {
      logic: "or",
      conditions: [
        { "Gebäude hat schlechte Wärmedämmung": "Ja" },
        { "Gebäude hat Heizanlage mit ungünstigem Wirkungsgrad": "Ja" },
      ],
    },
  },
  "[Gebäude-] Energieverbrauchskennwert größer als 170/155/145": {
    checked_if: {
      logic: "or",
      conditions: [
        { Energieverbrauchskennwert: "-" },
        { Energiebedarfskennwert: "-" },
      ],
    },
  },
  "[Gebäude-] Energieverbrauchskennwert größer als 210/195": {
    checked_if: {
      logic: "or",
      conditions: [
        { Energieverbrauchskennwert: "-" },
        { Energieverbrauchskennwert: "--" },
        { Energiebedarfskennwert: "-" },
        { Energiebedarfskennwert: "--" },
      ],
    },
  },
  "[Gebäude-] Energieverbrauchskennwert größer als 250/235": {
    checked_if: {
      logic: "or",
      conditions: [
        { Energieverbrauchskennwert: "-" },
        { Energieverbrauchskennwert: "--" },
        { Energieverbrauchskennwert: "---" },
        { Energiebedarfskennwert: "-" },
        { Energiebedarfskennwert: "--" },
        { Energiebedarfskennwert: "---" },
      ],
    },
  },
  "[Gebäude+] Gebäude hat zusätzliche Einbruchsicherung": {
    checked_if: {
      "Gebäude hat sichere Haustür": "Ja",
    },
  },
  "[Gebäude+] Gebäude hat Gegensprechanlage mit Video": {
    checked_if: {
      "Gebäude hat Gegensprechanlage mit Kamera": "Ja",
    },
  },
  "[Gebäude+] Gebäude hat hochwertigen Eingangsbereich": {
    checked_if: {
      "Gebäude hat Treppenhaus in gutem Zustand": "Ja",
    },
  },
  "[Gebäude+] Gebäude ist in überdurchschnittlich guten Instandhaltungszustand":
    {
      checked_if: {
        "Gebäude ist in gutem Zustand": "Ja",
      },
    },
  "[Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen": {
    checked_if: {
      logic: "and",
      conditions: [
        { "Gebäude hat Fahrstuhl": "Ja" },
        { "Gebäude hat <5 Stockwerke und Fahrstuhl": "Ja" },
      ],
    },
  },
  "[Gebäude+] Gebäude hat Fahrradabstellraum/Fahrradstellplätze": {
    checked_if: {
      logic: "or",
      conditions: [
        { "Gebäude hat Fahrradstellplätze mit Anschließmöglichkeit": "Ja" },
        { "Gebäude hat Fahrradabstellraum": "Ja" },
      ],
    },
  },
  "[Gebäude+] Gebäude hat zusätzliche nutzbare Räume": {
    checked_if: {
      "Gebäude hat zusätzliche Räume": "Ja",
    },
  },
  "[Gebäude+] Gebäude hat Auto Stellplatz": {
    checked_if: {
      "Gebäude hat Parkplatz": "Ja",
    },
  },
  "[Gebäude+] Gebäude hat zusätzliche Wärmedämmung": {
    checked_if: {
      logic: "or",
      conditions: [
        { "Gebäude hat gute Wärmedämmung": "Ja" },
        { "Gebäude hat moderne Heizanlage": "Ja" },
      ],
    },
  },
  "[Gebäude+] Energieverbrauchskennwert kleiner als 120": {
    checked_if: {
      logic: "or",
      conditions: [
        { Energieverbrauchskennwert: "+" },
        { Energieverbrauchskennwert: "++" },
        { Energieverbrauchskennwert: "+++" },
        { Energiebedarfskennwert: "+" },
        { Energiebedarfskennwert: "++" },
        { Energiebedarfskennwert: "+++" },
      ],
    },
  },
  "[Gebäude+] Energieverbrauchskennwert kleiner als 100": {
    checked_if: {
      logic: "or",
      conditions: [
        { Energieverbrauchskennwert: "++" },
        { Energieverbrauchskennwert: "+++" },
        { Energiebedarfskennwert: "++" },
        { Energiebedarfskennwert: "+++" },
      ],
    },
  },
  "[Gebäude+] Energieverbrauchskennwert kleiner als 80": {
    checked_if: {
      logic: "or",
      conditions: [
        { Energieverbrauchskennwert: "+++" },
        { Energiebedarfskennwert: "+++" },
      ],
    },
  },

  "[Umfeld-] Lage ist besonders lärmbelastet": {
    checked_if: { "Wohnumfeld ist besonders laut": "Ja" },
  },
  "[Umfeld-] Lage ist regelmäßig beeinträchtigt durch Geräusche oder Gerüche von Gewerbe":
    {
      checked_if: { "Wohnumfeld ist geräuschs- oder geruchsbelastet": "Ja" },
    },
  "[Umfeld-] Lage ist besonders geruchsbelastet": {
    checked_if: { "Wohnumfeld ist geruchsbelastet": "Ja" },
  },
  "[Umfeld-] Ungepflegte und offene Müllstandfläche": {
    checked_if: { "Wohnumfeld hat ungepflegte Müllstandsfläche": "Ja" },
  },
  "[Umfeld-] Keine Fahrradabstellmöglichkeit auf dem Grundstück": {
    checked_if: { "Wohnumfeld hat Fahrradabstellmöglichkeiten": "Nein" },
  },
  "[Umfeld-] Lage in vernachlässigter Umgebung": {
    checked_if: { "Wohnumfeld ist stark vernachlässigt": "Ja" },
  },

  "[Umfeld+] Bevorzugte Citylage": {
    checked_if: { "Wohnumfeld ist repräsentativ": "Ja" },
  },
  "[Umfeld+] Besonders ruhige Lage": {
    checked_if: { "Wohnumfeld ist besonders leise": "Ja" },
  },
  "[Umfeld+] Aufwändig gestaltetes Wohnumfeld auf dem Grundstück": {
    checked_if: { "Wohnumfeld ist aufwendig gestaltet": "Ja" },
  },
  "[Umfeld+] Gepflegte Müllstandsfläche": {
    checked_if: { "Wohnumfeld hat gepflegte Müllstandsfläche": "Ja" },
  },
  "[Umfeld+] Villenartige Mehrfamilienhäuser": {
    checked_if: { "Wohnumfeld hat villenartige Mehrfamilienhäuser": "Ja" },
  },
  "[Umfeld+] Garten zur alleinigen Nutzung": {
    checked_if: {
      logic: "or",
      conditions: [
        { "Wohnumfeld hat eigenen Garten": "Ja" },
        { "Wohnumfeld hat Gemeinschaftsgarten": "Ja" },
      ],
    },
  },
  "[Umfeld+] Vom Vermieter zur Verfügung gestellter Parkplatz": {
    checked_if: { "Wohnumfeld hat Parkplatz": "Ja" },
  },
} satisfies AnswerMerkmalStateMapping;

/*
  Umfeld: {
    pro: {
      ruhig: { "Wohnumfeld ist besonders leise": "Ja" },
      Gestaltung: { "Wohnumfeld ist aufwendig gestaltet": "Ja" },
      Müllfläche: {
        "Wohnumfeld hat gepflegte Müllstandsfläche": "Ja",
      },
      Garten: [
        { "Wohnumfeld hat eigenen Garten": "Ja" },
        { "Wohnumfeld hat Gemeinschaftsgarten": "Ja" },
      ],
      Citylage: { "Wohnumfeld ist repräsentativ": "Ja" },
      Villenartig: {
        "Wohnumfeld hat villenartige Mehrfamilienhäuser": "Ja",
      },
      Parkplatz: { "Wohnumfeld hat Parkplatz": "Ja" },
    },
    con: {
      
    },
  },
*/
