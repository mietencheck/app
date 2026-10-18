/**
 * Human review decisions for every place where the questionnaire deviates
 * from the construction-period restrictions stated in the Mietspiegel text.
 *
 * The review test fails when a deviation appears that is not listed here, or
 * when an entry no longer matches a deviation. Reviewers set `status` to
 * "bestätigt" (deviation is intended, with a reason) or fix the flow/data,
 * after which the entry is removed.
 */
export type ReviewDecision = {
  status: "offen" | "bestätigt";
  hinweis: string;
};

const SONDERMERKMAL_BODEN =
  "Vermutlich beabsichtigt: In genau diesen Baualtersklassen fragt der Fragebogen 2015 stattdessen das Sondermerkmal „Hochwertiger Bodenbelag“ ab (Tabelle 10.1), um Doppelzählung zu vermeiden.";
const BAD_GROSS_OST =
  "Vermutete Ursache: „Bad größer als 8 m²“ wird nur nach „Bad mindestens 4 m²“ gefragt; diese Frage entfällt für 1973–1990 Ost (Kleines Bad gilt dort nicht). Das Merkmal „Großes Bad“ ist aber laut Text nicht eingeschränkt.";
const WAERMEDAEMMUNG =
  "Zu prüfen: Fragebogen fragt in der jüngsten Baualtersklasse nicht nach zusätzlicher Wärmedämmung/moderner Heizanlage, der Text schränkt das Merkmal nur über den Einbauzeitpunkt ein.";
const WC_ODER =
  "Text: „Wandhängendes WC … (gilt nicht für die Baualtersklassen ab 2002) oder hochwertiges Stand-WC“. Die Einschränkung betrifft nur das wandhängende WC. Zu prüfen: Fragt der Fragebogen ab 2002 nur noch nach dem Stand-WC?";
const STRUKTURHEIZKOERPER =
  "Text: „gilt für Baualtersklassen bis einschließlich 2001; sofern zusätzlich elektrisch betreibbar: alle Baujahre“. Zu prüfen: Fragt der Fragebogen ab 2002 nach der elektrischen Betreibbarkeit?";
const HEIZUNGSROHRE_2024 =
  "Fragebogen ist vermutlich korrekt. Der Merkmaltext in src/mietspiegel/merkmale/2024.json ist unvollständig: Das PDF 2024 enthält „(gilt für Baualtersklassen bis einschließlich 1990)“.";
const HEIZUNGSROHRE_2026 =
  "Verdacht auf Fehler im Fragebogen: Das PDF 2026 schränkt das Merkmal auf Baualtersklassen bis einschließlich 1990 ein, der Fragebogen erlaubt es auch danach (2024 ist korrekt eingeschränkt).";
const FUENFTES_OG_2024 =
  "Fragebogen ist vermutlich korrekt. Der Merkmaltext in src/mietspiegel/merkmale/2024.json ist unvollständig: Das PDF enthält „gilt nicht für die Baualtersklassen bis 1949“.";
const AUFZUG_2026 =
  "Verdacht auf Fehler im Fragebogen: „Personenaufzug bei weniger als fünf Obergeschossen; gilt nicht für die Baualtersklassen ab 2010“. Gleiches gilt laut PDF für 2024; dort fehlt die Einschränkung zusätzlich im Merkmaltext (2024.json), daher wird 2024 hier nicht erkannt.";
const BODENGLEICHE_DUSCHE =
  "Bekannte Lücke im Fragebogen: Die Frage wird nur für Vertragsdatum 2024–2026 gestellt, nicht für Mietspiegel 2026. Korrektur im floma.io-Editor.";
const SCHALLSCHUTZ_2017 =
  "Zu prüfen: Laut Text nur für vor 2002 bezugsfertige Wohnungen; der Fragebogen 2017 fragt auch für 2003–2015.";

export const merkmalReviewDecisions: Record<string, ReviewDecision> = {
  "2015 | [Wohnung+] Wohnung hat hochwertigen Boden | -1918": {
    status: "offen",
    hinweis: SONDERMERKMAL_BODEN,
  },
  "2015 | [Wohnung+] Wohnung hat hochwertigen Boden | 1919-1949": {
    status: "offen",
    hinweis: SONDERMERKMAL_BODEN,
  },
  "2015 | [Wohnung+] Wohnung hat hochwertigen Boden | 1950-1964": {
    status: "offen",
    hinweis: SONDERMERKMAL_BODEN,
  },
  "2015 | [Wohnung+] Wohnung hat hochwertigen Boden | W:1973-1990": {
    status: "offen",
    hinweis: SONDERMERKMAL_BODEN,
  },
  "2015 | [Wohnung+] Wohnung hat hochwertigen Boden | 1991-2002": {
    status: "offen",
    hinweis: SONDERMERKMAL_BODEN,
  },
  "2015 | [Gebäude+] Gebäude hat zusätzliche Wärmedämmung | 2003-2013": {
    status: "offen",
    hinweis: WAERMEDAEMMUNG,
  },

  "2017 | [Bad+] Bad ist groß | O:1973-1990": {
    status: "offen",
    hinweis: BAD_GROSS_OST,
  },
  "2017 | [Wohnung+] Wohnung hat Schallschutzfenster/Wärmeschutzverglasung | 2003-2015":
    { status: "offen", hinweis: SCHALLSCHUTZ_2017 },
  "2017 | [Gebäude+] Gebäude hat zusätzliche Wärmedämmung | 2003-2015": {
    status: "offen",
    hinweis: WAERMEDAEMMUNG,
  },

  "2019 | [Bad+] Bad ist groß | O:1973-1990": {
    status: "offen",
    hinweis: BAD_GROSS_OST,
  },
  "2019 | [Gebäude+] Gebäude hat zusätzliche Wärmedämmung | 2003-2017": {
    status: "offen",
    hinweis: WAERMEDAEMMUNG,
  },

  "2021 | [Bad+] Bad ist groß | O:1973-1990": {
    status: "offen",
    hinweis: BAD_GROSS_OST,
  },
  "2021 | [Gebäude+] Gebäude hat zusätzliche Wärmedämmung | 2003-2017": {
    status: "offen",
    hinweis: WAERMEDAEMMUNG,
  },

  "2023 | [Bad+] Bad ist groß | O:1973-1990": {
    status: "offen",
    hinweis: BAD_GROSS_OST,
  },
  "2023 | [Gebäude+] Gebäude hat zusätzliche Wärmedämmung | 2003-2017": {
    status: "offen",
    hinweis: WAERMEDAEMMUNG,
  },

  "2024 | [Bad+] Bad ist groß | O:1973-1990": {
    status: "offen",
    hinweis: BAD_GROSS_OST,
  },
  "2024 | [Bad+] Bad hat wandhängendes WC | 2002-2009": {
    status: "offen",
    hinweis: WC_ODER,
  },
  "2024 | [Bad+] Bad hat wandhängendes WC | 2010-2015": {
    status: "offen",
    hinweis: WC_ODER,
  },
  "2024 | [Bad+] Bad hat Strukturheizkörper | 2002-2009": {
    status: "offen",
    hinweis: STRUKTURHEIZKOERPER,
  },
  "2024 | [Bad+] Bad hat Strukturheizkörper | 2010-2015": {
    status: "offen",
    hinweis: STRUKTURHEIZKOERPER,
  },
  "2024 | [Wohnung+] Wohnung hat nicht sichtbare Heizungsrohre | 1991-2001": {
    status: "offen",
    hinweis: HEIZUNGSROHRE_2024,
  },
  "2024 | [Wohnung+] Wohnung hat nicht sichtbare Heizungsrohre | 2002-2009": {
    status: "offen",
    hinweis: HEIZUNGSROHRE_2024,
  },
  "2024 | [Wohnung+] Wohnung hat nicht sichtbare Heizungsrohre | 2010-2015": {
    status: "offen",
    hinweis: HEIZUNGSROHRE_2024,
  },
  "2024 | [Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug | -1918":
    { status: "offen", hinweis: FUENFTES_OG_2024 },
  "2024 | [Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug | 1919-1949":
    { status: "offen", hinweis: FUENFTES_OG_2024 },

  "2026 | [Bad+] Bad ist groß | O:1973-1990": {
    status: "offen",
    hinweis: BAD_GROSS_OST,
  },
  "2026 | [Bad+] Bad hat wandhängendes WC | 2002-2009": {
    status: "offen",
    hinweis: WC_ODER,
  },
  "2026 | [Bad+] Bad hat wandhängendes WC | 2010-2015": {
    status: "offen",
    hinweis: WC_ODER,
  },
  "2026 | [Bad+] Bad hat Strukturheizkörper | 2002-2009": {
    status: "offen",
    hinweis: STRUKTURHEIZKOERPER,
  },
  "2026 | [Bad+] Bad hat Strukturheizkörper | 2010-2015": {
    status: "offen",
    hinweis: STRUKTURHEIZKOERPER,
  },
  "2026 | [Bad+] Bad hat bodengleiche Dusche | -1918": {
    status: "offen",
    hinweis: BODENGLEICHE_DUSCHE,
  },
  "2026 | [Bad+] Bad hat bodengleiche Dusche | 1919-1949": {
    status: "offen",
    hinweis: BODENGLEICHE_DUSCHE,
  },
  "2026 | [Bad+] Bad hat bodengleiche Dusche | 1950-1964": {
    status: "offen",
    hinweis: BODENGLEICHE_DUSCHE,
  },
  "2026 | [Bad+] Bad hat bodengleiche Dusche | 1965-1972": {
    status: "offen",
    hinweis: BODENGLEICHE_DUSCHE,
  },
  "2026 | [Bad+] Bad hat bodengleiche Dusche | W:1973-1985": {
    status: "offen",
    hinweis: BODENGLEICHE_DUSCHE,
  },
  "2026 | [Bad+] Bad hat bodengleiche Dusche | W:1986-1990": {
    status: "offen",
    hinweis: BODENGLEICHE_DUSCHE,
  },
  "2026 | [Bad+] Bad hat bodengleiche Dusche | O:1973-1990": {
    status: "offen",
    hinweis: BODENGLEICHE_DUSCHE,
  },
  "2026 | [Bad+] Bad hat bodengleiche Dusche | 1991-2001": {
    status: "offen",
    hinweis: BODENGLEICHE_DUSCHE,
  },
  "2026 | [Bad+] Bad hat bodengleiche Dusche | 2002-2009": {
    status: "offen",
    hinweis: BODENGLEICHE_DUSCHE,
  },
  "2026 | [Bad+] Bad hat bodengleiche Dusche | 2010-2015": {
    status: "offen",
    hinweis: BODENGLEICHE_DUSCHE,
  },
  "2026 | [Wohnung+] Wohnung hat nicht sichtbare Heizungsrohre | 1991-2001": {
    status: "offen",
    hinweis: HEIZUNGSROHRE_2026,
  },
  "2026 | [Wohnung+] Wohnung hat nicht sichtbare Heizungsrohre | 2002-2009": {
    status: "offen",
    hinweis: HEIZUNGSROHRE_2026,
  },
  "2026 | [Wohnung+] Wohnung hat nicht sichtbare Heizungsrohre | 2010-2015": {
    status: "offen",
    hinweis: HEIZUNGSROHRE_2026,
  },
  "2026 | [Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen | 2010-2015":
    { status: "offen", hinweis: AUFZUG_2026 },
};

export const decisionKey = (jahr: string, merkmal: string, period: string) =>
  `${jahr} | ${merkmal} | ${period}`;
