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
const WAERMEDAEMMUNG =
  "Textprüfung behandelt die ODER-Alternativen gemeinsam: Die Baujahrgrenze betrifft die moderne Heizanlage, nicht die zusätzliche Wärmedämmung. Der Fragebogen erlaubt zusätzliche Wärmedämmung auch bei neueren Gebäuden; die getrennten Alternativen werden durch Merkmal-Eligibility-Tests geprüft.";
const WC_ODER =
  "Text: „Wandhängendes WC … (gilt nicht für die Baualtersklassen ab 2002) oder hochwertiges Stand-WC“. Die Einschränkung betrifft nur das wandhängende WC. Zu prüfen: Fragt der Fragebogen ab 2002 nur noch nach dem Stand-WC?";
const STRUKTURHEIZKOERPER =
  "Text: „gilt für Baualtersklassen bis einschließlich 2001; sofern zusätzlich elektrisch betreibbar: alle Baujahre“. Zu prüfen: Fragt der Fragebogen ab 2002 nach der elektrischen Betreibbarkeit?";
const HEIZUNGSROHRE_2024 =
  "Fragebogen ist vermutlich korrekt. Der Merkmaltext in src/mietspiegel/merkmale/2024.json ist unvollständig: Das PDF 2024 enthält „(gilt für Baualtersklassen bis einschließlich 1990)“.";
const FUENFTES_OG_2024 =
  "Fragebogen ist vermutlich korrekt. Der Merkmaltext in src/mietspiegel/merkmale/2024.json ist unvollständig: Das PDF enthält „gilt nicht für die Baualtersklassen bis 1949“.";

export const merkmalReviewDecisions: Record<string, ReviewDecision> = {
  "2015 | [Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen | -1918":
    {
      status: "bestätigt",
      hinweis:
        "Mietspiegel 2015, S. 15/21: Bis 1918 wird der Aufzug ausschließlich als Sondermerkmal erfasst, um eine Doppelzählung zu vermeiden. Die Textprüfung löst diese Sondermerkmal-Bedingung nicht auf.",
    },
  "2024 | [Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen | 2010-2015":
    {
      status: "offen",
      hinweis:
        "Der Fragebogen schließt Baujahre ab 2010 jetzt korrekt aus. Im Merkmaltext 2024 fehlt diese Einschränkung des PDFs noch.",
    },
  "2024 | [Gebäude+] Gebäude hat zusätzliche Wärmedämmung | 2010-2015": {
    status: "offen",
    hinweis: WAERMEDAEMMUNG,
  },
  "2026 | [Gebäude+] Gebäude hat zusätzliche Wärmedämmung | 2010-2015": {
    status: "offen",
    hinweis: WAERMEDAEMMUNG,
  },
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
};

export const decisionKey = (jahr: string, merkmal: string, period: string) =>
  `${jahr} | ${merkmal} | ${period}`;
