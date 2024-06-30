import { FinalAnswers } from "../flow-machine";

export const MERKMAL_RESET_ANSWERS = {
  // Bad+
  "Bad ist groß": "Nein",
  "Bad hat Dusche und Wanne": "Nein",
  "Bad großes Waschbecken": "Nein",
  "Mehrere WCs": "Nein",
  "Getrenntes WC": "Nein",
  "Bad hat wandhängendes WC": "Nein",
  "Bad mit moderner Entlüftung": "Nein",
  "Bad mit Strukturheizkörper": "Nein",
  "Bad mit Fußbodenheizung": "Nein",
  "Bad Boden und Wand hochwertig": "Nein",
  "Bad mit hochwertiger Ausstattung": "Nein",
  "Bad hat Einhebelmischbatterie": "Nein",

  // Bad-
  "Bad ist klein": "Ja",
  "Bad hat Duschmöglichkeit": "Ja",
  "Duschen nur in freistehender Badewanne in nicht modernisiertem Bad": "Nein",
  "Bad & WC ohne Waschbecken": "Nein",
  "Bad nur kleines Waschbecken": "Nein",
  "WC ohne Lüftung": "Nein",
  "Bad mit WC ohne Fenster": "Nein",
  "Bad ohne Heizung": "Nein",
  "Bad mit alter Heizung": "Nein",
  "Bad mit Dielenfußboden": "Nein",
  "Bad Wände ausreichend gefließt": "Ja",
  "Bad hat Warmwasser": "Ja",

  // Küche+
  "Küche ist groß": "Nein",
  "Küche ist separater Raum": "Nein",
  "Küche hat Einbauküche": "Nein",
  "Küche hat Ceran-/Induktionsherd": "Nein",
  "Küche hat Kühlschrank": "Nein",
  "Küche hat Dunstabzug": "Nein",
  "Küche hat hochwertigen Fußboden": "Nein",

  // Küche-
  "Küche hat Kochmöglichkeit": "Ja",
  "Küche hat Gas/Elektroherd ohne Backofen": "Nein",
  "Küche hat Spüle": "Ja",
  "Küche hat Warmwasser": "Ja",
  "Küche hat Heizung": "Ja",
  "Küche hat Lüftung": "Ja",
  "Küche kann Spülmaschine": "Ja",

  // Wohnung+
  "Wohnung hat großen Wohnraum": "Nein",
  "Wohnung hat Abstellraum": "Nein",
  "Wohnung hat großen Balkon": "Nein",
  "Wohnung hat Schallschutzfenster": "Nein",
  "Wohnung hat Rollläden": "Nein",
  "Wohnung ist barrierearm": "Nein",
  "Wohnung hat verstärkte Tür": "Nein",
  "Wohnung hat Kaltwasserzähler": "Nein",
  "Wohnung hat Fußbodenheizung": "Nein",
  "Wohnung hat sichtbare Heizungsrohe": "Nein",
  "Wohnung hat hochwertigen Bodenbelag": "Nein",
  "Wohnung hat Internetanschluss": "Nein",
  "Wohnung hat aufwendige Wand- und Deckenverkleidung": "Nein",

  // Wohnung-
  "Wohnung hat Durchgangszimmer": "Nein",
  "Wohnung keinen Balkon weil unmöglich": "Ja",
  "Wohnung hat einfach verglaste Fenster": "Nein",
  "Wohnung hat nicht sichtbare Elektroinstallation": "Ja",
  "Wohnung hat Kabelanschluss": "Ja",
  "Wohnung kann Waschmaschiene": "Ja",
  "Wohnnung hat sichtbare Bewässerungsleitungen": "Nein",
  "Wohnung hat ausreichende Elektroinstallation": "Ja",
  "Wohnung hat Raum mit <2 Steckdosen": "Nein",

  // Gebäude+
  "Gebäude hat sichere Haustür": "Nein",
  "Gebäude hat Gegensprechanlage mit Kamera": "Nein",
  "Gebäude hat Treppenhaus in gutem Zustand": "Nein",
  "Gebäude ist in gutem Zustand": "Nein",
  "Gebäude hat <5 Stockwerke und Fahrstuhl": "Nein",
  "Gebäude hat Fahrradstellplätze mit Anschließmöglichkeit": "Nein",
  "Gebäude hat Fahrradabstellraum": "Nein",
  "Gebäude hat zusätzliche Räume": "Nein",
  "Gebäude hat Parkplatz": "Nein",
  "Gebäude hat gute Wärmedämmung": "Nein",
  "Gebäude hat moderne Heizanlage": "Nein",
  Energieverbrauchskennwert: "0",
  Energiebedarfskennwert: "0",

  // Gebäude-
  "Gebäude ist abschließbar": "Ja",
  "Gebäude hat Gegensprechanlage": "Ja",
  "Gebäude hat Treppenhaus in schlechtem Zustand": "Nein",
  "Gebäude ist in schlechtem Zustand": "Nein",
  "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Ja",
  "Gebäude hat Fahrradabstellmöglichkeit": "Ja",
  "Gebäude hat privaten Abstellraum": "Ja",
  "Gebäude hat privaten Keller": "Ja",
  "Gebäude ist dicht bebaut": "Nein",
  "Gebäude hat schlechte Wärmedämmung": "Nein",
  "Gebäude hat Heizanlage mit ungünstigem Wirkungsgrad": "Nein",

  // Umfeld+
  "Wohnumfeld ist besonders leise": "Nein",
  "Wohnumfeld ist aufwendig gestaltet": "Nein",
  "Wohnumfeld hat gepflegte Müllstandsfläche": "Nein",
  "Wohnumfeld hat eigenen Garten": "Nein",
  "Wohnumfeld hat Gemeinschaftsgarten": "Nein",
  "Wohnumfeld ist repräsentativ": "Nein",
  "Wohnumfeld hat villenartige Mehrfamilienhäuser": "Nein",
  "Wohnumfeld hat Parkplatz": "Nein",

  // Umfeld-
  "Wohnumfeld ist besonders laut": "Nein",
  "Wohnumfeld ist geräuschs- oder geruchsbelastet": "Nein",
  "Wohnumfeld ist geruchsbelastet": "Nein",
  "Wohnumfeld hat ungepflegte Müllstandsfläche": "Nein",
  "Wohnumfeld hat Fahrradabstellmöglichkeiten": "Ja",
  "Wohnumfeld ist stark vernachlässigt": "Nein",

  // Sondermerkmale
  "Sondermerkmal Bodenbelag": "Nein",
  "Sondermerkmal Modernes Bad": "Nein",
  "Sondermerkmal Moderne Küche": "Nein",
  "Sondermerkmal Dusche Und Badewanne": "Nein",
  "Sondermerkmal Badezimmer Klein": "Nein",
  "Sondermerkmal Schallschutzfenster": "Nein",
  "Sondermerkmal Aufzug": "Nein",

  // Sonderausstattung
  "Badezimmer in Wohnung": "Ja",
  "Wohnung hat Sammelheizung": "Ja",
} satisfies FinalAnswers;
