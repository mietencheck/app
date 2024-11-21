export const merkmale = {
  Bad: {
    pro: {
      Großbad: { "Bad ist groß": "Ja" },
      "Separate Badewanne": { "Bad hat Dusche und Wanne": "Ja" },
      "Bodengleiche Dusche": { "Bad hat bodengleiche Dusche": "Ja" },
      "großes Waschbecken": { "Bad großes Waschbecken": "Ja" },
      "2tes WC": [{ "Mehrere WCs": "Ja" }, { "Getrenntes WC": "Ja" }],
      "Wand-WC": [
        { "Bad hat wandhängendes WC": "Ja" },
        { "Bad hat hochwertiges Stand-WC": "Ja" },
      ],
      "moderne Entlüftung": { "Bad mit moderner Entlüftung": "Ja" },
      Handtuchwärmer: { "Bad mit Strukturheizkörper": "Ja" },
      Fußbodenheizung: { "Bad mit Fußbodenheizung": "Ja" },
      Edelboden: { "Bad Boden und Wand hochwertig": "Ja" },
      Edelausstattung: { "Bad mit hochwertiger Ausstattung": "Ja" },
      Einhebelmischbatterie: {
        "Bad hat Einhebelmischbatterie": "Ja",
      },
    },
    con: {
      "kleines Bad": { "Bad ist klein": "Nein" },
      duschlos: { "Bad hat Duschmöglichkeit": "Nein" },
      Spritzdusche: {
        "Duschen nur in freistehender Badewanne in nicht modernisiertem Bad":
          "Ja",
      },
      "k(l)ein Waschbecken": [
        { "Bad & WC ohne Waschbecken": "Ja" },
        { "Bad nur kleines Waschbecken": "Ja" },
      ],
      "ohne Luft": { "WC ohne Lüftung": "Ja" },
      fensterlos: { "Bad mit WC ohne Fenster": "Ja" },
      heizlos: [
        { "Bad ohne Heizung": "Ja" },
        { "Bad mit alter Heizung": "Ja" },
      ],
      Diele: { "Bad mit Dielenfußboden": "Ja" },
      kaumflies: { "Bad Wände ausreichend gefließt": "Nein" },
      kaumwarm: { "Bad hat Warmwasser": "Nein" },
    },
  },
  Küche: {
    pro: {
      Wohnküche: [
        { "Küche ist groß": "Ja" },
        { "Küche ist separater Raum": "Ja" },
      ],
      EBK: { "Küche hat Einbauküche": "Ja" },
      Edelkochfeld: { "Küche hat Ceran-/Induktionsherd": "Ja" },
      Kühlschrank: { "Küche hat Kühlschrank": "Ja" },
      Dunstabzug: { "Küche hat Dunstabzug": "Ja" },
      "hochwertiger Boden": {
        "Küche hat hochwertigen Fußboden": "Ja",
      },
    },
    con: {
      kochlos: [
        { "Küche hat Kochmöglichkeit": "Nein" },
        { "Küche hat Gas/Elektroherd ohne Backofen": "Nein" },
      ],
      "keine Spüle": { "Küche hat Spüle": "Nein" },
      kaumwarm: { "Küche hat Warmwasser": "Nein" },
      "ohne Heizung": { "Küche hat Heizung": "Nein" },
      fensterlos: { "Küche hat Lüftung": "Nein" },
      "kein Spüleranschluss": { "Küche kann Spülmaschine": "Nein" },
    },
  },
  Wohnung: {
    pro: {
      "großer Wohnraum": { "Wohnung hat großen Wohnraum": "Ja" },
      Einbauschrank: { "Wohnung hat Abstellraum": "Ja" },
      "großes Außen": { "Wohnung hat großen Balkon": "Ja" },
      Isolierverglasung: {
        "Wohnung hat Schallschutzfenster": "Ja",
      },
      Rollladen: { "Wohnung hat Rollläden": "Ja" },
      barrierearm: { "Wohnung ist barrierearm": "Ja" },
      Einbruchssicherung: { "Wohnung hat verstärkte Tür": "Ja" },
      Kaltwasserzähler: {
        "Wohnung hat Kaltwasserzähler": "Ja",
        "Mieter zahlt für Kaltwasserzähler": "Nein",
      },
      Fußbodenheizung: { "Wohnung hat Fußbodenheizung": "Ja" },
      "Heizungsrohre nicht sichtbar": {
        "Wohnung hat sichtbare Heizungsrohe": "Nein",
      },
      "hochwertiger Boden": {
        "Wohnung hat hochwertigen Bodenbelag": "Ja",
      },
      "Rückkanal-Breitband": {
        "Wohnung hat Internetanschluss": "Ja",
      },
      Deckenverkleidung: {
        "Wohnung hat aufwendige Wand- und Deckenverkleidung": "Ja",
      },
    },
    con: {
      "schlechter Schnitt": { "Wohnung hat Durchgangszimmer": "Ja" },
      "kein Balkon": {
        "Wohnung keinen Balkon weil unmöglich": "Nein",
      },
      "1fach Glas": {
        "Wohnung hat einfach verglaste Fenster": "Ja",
      },
      "Elektronik sichtbar": {
        "Wohnung hat nicht sichtbare Elektroinstallation": "Nein",
      },
      "schwache Elektronik": [
        { "Wohnung hat ausreichende Elektroinstallation": "Nein" },
        { "Wohnung hat Raum mit <2 Steckdosen": "Ja" },
      ],
      "kein Breitband": {
        "Wohnung hat Kabelanschluss": "Nein",
      },
      "ohne Waschmaschinen-Anschluss": {
        "Wohnung kann Waschmaschiene": "Nein",
      },
      "Wässerung auf Putz": {
        "Wohnnung hat sichtbare Bewässerungsleitungen": "Ja",
      },
    },
  },
  Gebäude: {
    pro: {
      einbruchsicher: { "Gebäude hat sichere Haustür": "Ja" },
      Gegensprechanlage: {
        "Gebäude hat Gegensprechanlage mit Kamera": "Ja",
      },
      "hochwertiger Eingang": {
        "Gebäude hat Treppenhaus in gutem Zustand": "Ja",
      },
      "gut Instand": { "Gebäude ist in gutem Zustand": "Ja" },
      Aufzug: {
        "Gebäude hat <5 Stockwerke und Fahrstuhl": "Ja",
      },
      "geschlossener Fahrradraum": [
        { "Gebäude hat Fahrradstellplätze mit Anschließmöglichkeit": "Ja" },
        { "Gebäude hat Fahrradabstellraum": "Ja" },
      ],
      Partyraum: { "Gebäude hat zusätzliche Räume": "Ja" },
      Stellplatz: { "Gebäude hat Parkplatz": "Ja" },
      Wärmedämmung: {
        "Gebäude hat gute Wärmedämmung": "Ja",
        "Gebäude hat moderne Heizanlage": "Ja",
      },
      "EVK<120": [
        { Energieverbrauchskennwert: "+" },
        { Energieverbrauchskennwert: "++" },
        { Energieverbrauchskennwert: "+++" },
        { Energiebedarfskennwert: "+" },
        { Energiebedarfskennwert: "++" },
        { Energiebedarfskennwert: "+++" },
      ],
      "EVK<100": [
        { Energieverbrauchskennwert: "++" },
        { Energieverbrauchskennwert: "+++" },
        { Energiebedarfskennwert: "++" },
        { Energiebedarfskennwert: "+++" },
      ],
      "EVK<80": [
        { Energieverbrauchskennwert: "+++" },
        { Energiebedarfskennwert: "+++" },
      ],
    },
    con: {
      "offene Haustür": { "Gebäude ist abschließbar": "Nein" },
      "keine Gegensprechanlage": {
        "Gebäude hat Gegensprechanlage": "Nein",
      },
      "Treppenbereich schlecht": {
        "Gebäude hat Treppenhaus in schlechtem Zustand": "Ja",
      },
      "schlecht instand": {
        "Gebäude ist in schlechtem Zustand": "Ja",
      },
      "kein Aufzug": {
        "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": "Ja",
      },
      "keine Fahrradabstellmöglichkeit": {
        "Gebäude hat Fahrradabstellmöglichkeit": "Nein",
      },
      "kein Keller/Abstellraum": [
        { "Gebäude hat privaten Abstellraum": "Nein" },
        { "Gebäude hat privaten Keller": "Nein" },
      ],
      Seitenlage: { "Gebäude ist dicht bebaut": "Ja" },
      "schleche Wärmedämmung": {
        "Gebäude hat schlechte Wärmedämmung": "Ja",
        "Gebäude hat Heizanlage mit ungünstigem Wirkungsgrad": "Ja",
      },
      // 2015
      "EVK>170": [
        { Energieverbrauchskennwert: "-" },
        { Energiebedarfskennwert: "-" },
      ],
      "EVK>210": [
        { Energieverbrauchskennwert: "-" },
        { Energieverbrauchskennwert: "--" },
        { Energiebedarfskennwert: "-" },
        { Energiebedarfskennwert: "--" },
      ],
      "EVK>250": [
        { Energieverbrauchskennwert: "-" },
        { Energieverbrauchskennwert: "--" },
        { Energieverbrauchskennwert: "---" },
        { Energiebedarfskennwert: "-" },
        { Energiebedarfskennwert: "--" },
        { Energiebedarfskennwert: "---" },
      ],
      // >=2017
      "EVK>155": [
        { Energieverbrauchskennwert: "-" },
        { Energiebedarfskennwert: "-" },
      ],
      "EVK>195": [
        { Energieverbrauchskennwert: "-" },
        { Energieverbrauchskennwert: "--" },
        { Energiebedarfskennwert: "-" },
        { Energiebedarfskennwert: "--" },
      ],
      "EVK>235": [
        { Energieverbrauchskennwert: "-" },
        { Energieverbrauchskennwert: "--" },
        { Energieverbrauchskennwert: "---" },
        { Energiebedarfskennwert: "-" },
        { Energiebedarfskennwert: "--" },
        { Energiebedarfskennwert: "---" },
      ],
    },
  },
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
      Lärm: {
        "Wohnumfeld ist besonders laut": "Ja",
      },
      Verkehrsnähe: {
        "Wohnumfeld ist besonders laut": "Ja",
      },
      Gewerbenähe: {
        "Wohnumfeld ist geräuschs- oder geruchsbelastet": "Ja",
      },
      stinkt: {
        "Wohnumfeld ist geruchsbelastet": "Ja",
      },
      Müll: {
        "Wohnumfeld hat ungepflegte Müllstandsfläche": "Ja",
      },
      "kein Fahrradabstell": {
        "Wohnumfeld hat Fahrradabstellmöglichkeiten": "Nein",
      },
      vernachlässigt: {
        "Wohnumfeld ist stark vernachlässigt": "Ja",
      },
    },
  },
};
