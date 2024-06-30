import { mapValues } from "remeda";

import { getWorstBestSondermerkmalZuschläge } from "~/details/result/AuswertungModal/utils";

import { FinalAnswers } from "../flow-machine";
import { getWorstBestSpannenResults } from "./MerkmalsGruppen";
import { getWorstBestSondermerkmale } from "./Sondermerkmale";

export function getWorstBestOrtsüblicheVergleichsmiete(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { worst: number; best: number } | null {
  const spannenResults = getWorstBestSpannenResults(
    answers,
    visibleQuestionAliases,
  );
  const sondermerkmale = getWorstBestSondermerkmalZuschläge(
    answers,
    visibleQuestionAliases,
  );
  const sondermerkmaleTotal = getWorstBestSondermerkmale(sondermerkmale);

  return {
    worst:
      Math.max(...spannenResults.map((s) => s.worstResult)) +
      sondermerkmaleTotal.worst,
    best:
      Math.min(...spannenResults.map((s) => s.bestResult)) +
      sondermerkmaleTotal.best,
  };
}

export function getWorstBestZulässigeHöchstmiete(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { worst: number; best: number } | null {
  const vergleichsmiete = getWorstBestOrtsüblicheVergleichsmiete(
    answers,
    visibleQuestionAliases,
  );
  if (!vergleichsmiete) return null;
  return mapValues(vergleichsmiete, (p) => p * Number(answers.Qm) * 1.1);
}
