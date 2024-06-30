import { AllPDFFields } from "~/pdf/fields";
import { isKeyOfObject, parseAdresse } from "~/utils";

import {
  FinalAnswers,
  getMietspiegelJahr,
  getOstWestBaujahr,
} from "../flow-machine";
import { OstWestBaujahr } from "../mietspiegel";
import { checkMerkmalState, FieldAnswers, MerkmalState } from "./utils";

type SonderAnswerZuschlagTuple = [
  FieldAnswers | FieldAnswers[],
  Partial<Record<OstWestBaujahr, number>>,
];

export const sondermerkmalZuschläge2015 = {
  "hochwertiger Boden": [
    { "Sondermerkmal Bodenbelag": "Ja" },
    {
      "-1918": 0.56,
      "1919-1949": 0.83,
      "1950-1964": 1.1,
      "W:1973-1990": 0.46,
      "1991-2002": 0.79,
    },
  ],
  "moderne Küche": [
    { "Sondermerkmal Moderne Küche": "Ja" },
    {
      "-1918": 1.37,
      "1950-1964": 1.04,
      "1965-1972": 0.5,
      "W:1973-1990": 0.4,
      "1991-2002": 0.42,
    },
  ],
  Badewanne: [
    { "Sondermerkmal Dusche Und Badewanne": "Ja" },
    { "-1918": 0.63 },
  ],
  "Kleines Bad": [
    { "Sondermerkmal Badezimmer Klein": "Ja" },
    { "1991-2002": -0.32 },
  ],
  "Modernes Bad": [
    { "Sondermerkmal Modernes Bad": "Ja" },
    {
      "-1918": 0.34,
      "1919-1949": 0.4,
      "1950-1964": 0.28,
      "1965-1972": 0.12,
      "O:1973-1990": 0.16,
    },
  ],
  Schallschutz: [
    { "Sondermerkmal Schallschutzfenster": "Ja" },
    { "-1918": 0.28 },
  ],
  Aufzug: [{ "Sondermerkmal Aufzug": "Ja" }, { "-1918": 0.64 }],
} satisfies Record<
  Extract<AllPDFFields, `[S] ${string}`> extends `[S] ${infer S}` ? S : never,
  SonderAnswerZuschlagTuple
>;

export function getWorstBestSondermerkmalZuschlag(
  [fieldAnswers, jahrZuschlag]: SonderAnswerZuschlagTuple,
  aliasedAnswers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { state: MerkmalState; best: number; worst: number } {
  if (aliasedAnswers.Vertragsdatum == "<2015") {
    return { state: "unchecked", best: 0, worst: 0 };
  }
  const mietspiegelJahr = getMietspiegelJahr(aliasedAnswers.Vertragsdatum)!;
  const lage = aliasedAnswers.Adresse
    ? parseAdresse(aliasedAnswers.Adresse).lage
    : undefined;
  const ostWestBaujahr = getOstWestBaujahr(
    aliasedAnswers.Baujahr,
    lage?.[mietspiegelJahr]?.ost ?? false,
  );
  const zuschlag =
    ostWestBaujahr && isKeyOfObject(ostWestBaujahr, jahrZuschlag)
      ? (jahrZuschlag[ostWestBaujahr] as number)
      : Math.max(...Object.values(jahrZuschlag));
  const state = checkMerkmalState(
    fieldAnswers,
    aliasedAnswers,
    visibleQuestionAliases,
  );
  const possibleZuschläge = zuschlag
    ? {
        checked: [zuschlag],
        maybe: [zuschlag, 0],
        unchecked: [0],
      }[state]
    : [0];
  return {
    state,
    best: ostWestBaujahr ? Math.min(...possibleZuschläge) : 0,
    worst: Math.max(...possibleZuschläge),
  };
}

export function getWorstBestSondermerkmale(
  merkmale: { worst: number; best: number }[],
) {
  return merkmale.reduce(
    (total: { worst: number; best: number }, { worst, best }) => {
      return {
        worst: total.worst + worst,
        best: total.best + best,
      };
    },
    { worst: 0, best: 0 },
  );
}
