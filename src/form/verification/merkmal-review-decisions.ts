/**
 * Outstanding findings from the text heuristic. A source-description gap is
 * distinct from a demonstrated flow defect or an unresolved source application.
 * Entries disappear when the descriptions, flow or heuristic are corrected;
 * the review test rejects both unreviewed findings and stale decisions.
 */
export type ReviewDecision = {
  status: "offen" | "bestätigt";
  ursache:
    | "Quellenbeschreibungslücke"
    | "Ungeklärte Quellenanwendung"
    | "Fragebogenabweichung";
  hinweis: string;
};

const SONDERMERKMAL_BODEN =
  "Vermutlich beabsichtigt: In genau diesen Baualtersklassen fragt der Fragebogen 2015 stattdessen das Sondermerkmal „Hochwertiger Bodenbelag“ ab (Tabelle 10.1), um Doppelzählung zu vermeiden.";
const HEIZUNGSROHRE_2024 =
  "Der Fragebogen berücksichtigt die Quellenbeschränkung. Der Merkmaltext in src/mietspiegel/merkmale/2024.json ist unvollständig: Das PDF 2024 enthält „(gilt für Baualtersklassen bis einschließlich 1990)“.";
const FUENFTES_OG_2024 =
  "Der Fragebogen berücksichtigt die Quellenbeschränkung. Der Merkmaltext in src/mietspiegel/merkmale/2024.json ist unvollständig: Das PDF enthält „gilt nicht für die Baualtersklassen bis 1949“.";

export const merkmalReviewDecisions: Record<string, ReviewDecision> = {
  "2024 | [Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen | 2010-2015":
    {
      status: "offen",
      ursache: "Quellenbeschreibungslücke",
      hinweis:
        "Der Fragebogen schließt Baujahre ab 2010 jetzt korrekt aus. Im Merkmaltext 2024 fehlt diese Einschränkung des PDFs noch.",
    },
  "2015 | [Wohnung+] Wohnung hat hochwertigen Boden | -1918": {
    status: "offen",
    ursache: "Ungeklärte Quellenanwendung",
    hinweis: SONDERMERKMAL_BODEN,
  },
  "2015 | [Wohnung+] Wohnung hat hochwertigen Boden | 1919-1949": {
    status: "offen",
    ursache: "Ungeklärte Quellenanwendung",
    hinweis: SONDERMERKMAL_BODEN,
  },
  "2015 | [Wohnung+] Wohnung hat hochwertigen Boden | 1950-1964": {
    status: "offen",
    ursache: "Ungeklärte Quellenanwendung",
    hinweis: SONDERMERKMAL_BODEN,
  },
  "2015 | [Wohnung+] Wohnung hat hochwertigen Boden | W:1973-1990": {
    status: "offen",
    ursache: "Ungeklärte Quellenanwendung",
    hinweis: SONDERMERKMAL_BODEN,
  },
  "2015 | [Wohnung+] Wohnung hat hochwertigen Boden | 1991-2002": {
    status: "offen",
    ursache: "Ungeklärte Quellenanwendung",
    hinweis: SONDERMERKMAL_BODEN,
  },

  "2024 | [Wohnung+] Wohnung hat nicht sichtbare Heizungsrohre | 1991-2001": {
    status: "offen",
    ursache: "Quellenbeschreibungslücke",
    hinweis: HEIZUNGSROHRE_2024,
  },
  "2024 | [Wohnung+] Wohnung hat nicht sichtbare Heizungsrohre | 2002-2009": {
    status: "offen",
    ursache: "Quellenbeschreibungslücke",
    hinweis: HEIZUNGSROHRE_2024,
  },
  "2024 | [Wohnung+] Wohnung hat nicht sichtbare Heizungsrohre | 2010-2015": {
    status: "offen",
    ursache: "Quellenbeschreibungslücke",
    hinweis: HEIZUNGSROHRE_2024,
  },
  "2024 | [Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug | -1918":
    {
      status: "offen",
      ursache: "Quellenbeschreibungslücke",
      hinweis: FUENFTES_OG_2024,
    },
  "2024 | [Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug | 1919-1949":
    {
      status: "offen",
      ursache: "Quellenbeschreibungslücke",
      hinweis: FUENFTES_OG_2024,
    },
};

export const decisionKey = (jahr: string, merkmal: string, period: string) =>
  `${jahr} | ${merkmal} | ${period}`;
