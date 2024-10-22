import { entries, fromEntries, mapValues } from "remeda";

import { AllPDFFields, fieldKeysByYear } from "~/pdf/fields";

import { FinalAnswers, vertragsDatumToMietspiegelJahr } from "../flow-machine";
import { getSpannenEinordnung, SpannenEinordnung } from "./SpannenEinordnung";
import { checkMerkmalState, FieldAnswers, lerp, MerkmalState } from "./utils";

type ExtractMerkmalKeys<Group extends string, Sign extends string> =
  Extract<
    AllPDFFields,
    `[${Group}${Sign}] ${string}`
  > extends `[${Group}${Sign}] ${infer S}`
    ? S
    : never;

type MerkmalAnswers<Group extends string, Sign extends "+" | "-"> = Record<
  ExtractMerkmalKeys<Group, Sign>,
  FieldAnswers | FieldAnswers[]
>;

type MerkmalGruppe = "Bad" | "Küche" | "Wohnung" | "Gebäude" | "Umfeld";

export const merkmaleByGruppe = {
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
} satisfies {
  [Key in MerkmalGruppe]: {
    pro: MerkmalAnswers<Key, "+">;
    con: MerkmalAnswers<Key, "-">;
  };
};

type MerkmalFields = Record<string, FieldAnswers | FieldAnswers[]>;

type MerkmalStateMap = Partial<Record<string, MerkmalState>>;

type MerkmalPrefix = {
  group: string;
  sign: string;
};

export const getMerkmalStateMap = (
  prefix: MerkmalPrefix,
  merkmalFields: MerkmalFields,
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): MerkmalStateMap => {
  const datum = answers.Vertragsdatum;
  const mietspiegelJahr = datum ? vertragsDatumToMietspiegelJahr[datum] : null;
  return fromEntries(
    entries(merkmalFields)
      .filter(([key]) =>
        mietspiegelJahr
          ? fieldKeysByYear[mietspiegelJahr].has(
              `[${prefix.group}${prefix.sign}] ${key}`,
            )
          : false,
      )
      .map(([key, a]) => [
        key,
        checkMerkmalState(a, answers, visibleQuestionAliases),
      ]),
  );
};

const countMerkmalStates = (
  prefix: MerkmalPrefix,
  group: MerkmalFields,
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): [number, number] => {
  const stateEntries = Object.entries(
    getMerkmalStateMap(prefix, group, answers, visibleQuestionAliases),
  );
  return [
    stateEntries.filter(([, v]) => v == "checked").length,
    stateEntries.filter(([, v]) => v == "maybe").length,
  ];
};

export const getAllCheckedMerkmale = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) =>
  entries(merkmaleByGruppe).flatMap(([group, { pro, con }]) =>
    (
      [
        [pro, "+"],
        [con, "-"],
      ] satisfies [MerkmalFields, string][]
    ).flatMap(([fields, sign]) =>
      entries(
        getMerkmalStateMap(
          { group, sign },
          fields,
          answers,
          visibleQuestionAliases,
        ),
      )
        .filter(([, value]) => value == "checked")
        .map(([key]) => `[${group}${sign}] ${key}`),
    ),
  );

export const getMerkmalGruppeSpannen = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): Record<MerkmalGruppe, [number, number]> =>
  mapValues(merkmaleByGruppe, ({ pro, con }, group) => {
    const [checkedPros, maybePros] = countMerkmalStates(
      { group, sign: "+" },
      pro,
      answers,
      visibleQuestionAliases,
    );
    const [checkedCons, maybeCons] = countMerkmalStates(
      { group, sign: "-" },
      con,
      answers,
      visibleQuestionAliases,
    );
    const checkSum = checkedPros - checkedCons;

    return [checkSum + maybePros, checkSum - maybeCons] satisfies [
      number,
      number,
    ];
  });

export function getWorstBestMerkmalsGruppenInProzent(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { worst: number; best: number } {
  const spannen = Object.values(
    getMerkmalGruppeSpannen(answers, visibleQuestionAliases),
  );
  return spannen.reduce(
    (total, [worst, best]) => {
      return {
        worst: total.worst + (worst > 0 ? 0.2 : worst < 0 ? -0.2 : 0),
        best: total.best + (best > 0 ? 0.2 : best < 0 ? -0.2 : 0),
      };
    },
    { worst: 0, best: 0 },
  );
}

export const lerpSpanne = (
  { center, min, max }: SpannenEinordnung,
  change: number,
) => lerp(center, change > 0 ? max : min, Math.abs(change));

export function getWorstBestSpannenResults(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) {
  const change = getWorstBestMerkmalsGruppenInProzent(
    answers,
    visibleQuestionAliases,
  );
  return getSpannenEinordnung(answers).flatMap((spanne) => {
    const worstResult = lerpSpanne(spanne, change.worst);
    const bestResult = lerpSpanne(spanne, change.best);
    return {
      ...spanne,
      worstResult,
      worstDiff: worstResult - spanne.center,
      bestResult,
      bestDiff: bestResult - spanne.center,
    };
  });
}

export function getWorstBestMerkmalsgruppen(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) {
  const spannenResults = getWorstBestSpannenResults(
    answers,
    visibleQuestionAliases,
  );
  return {
    worst: Math.max(...spannenResults.map((s) => s.worstDiff)),
    best: Math.min(...spannenResults.map((s) => s.bestDiff)),
  };
}
