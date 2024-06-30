import { entries } from "remeda";

import { FinalAnswers } from "~/form/flow-machine";
import {
  getWorstBestSondermerkmalZuschlag,
  sondermerkmalZuschläge2015,
} from "~/form/rechner/Sondermerkmale";
import type { DE } from "~/l10n";

function makeKey<NS extends string, N extends string>(namespace: NS, name: N) {
  return (namespace + ":" + name) as `${NS}:${N}`;
}

export function getWorstBestSondermerkmalZuschläge(
  aliasedAnswers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) {
  return entries.strict(sondermerkmalZuschläge2015).map(([key, tuple]) => {
    const { state, worst, best } = getWorstBestSondermerkmalZuschlag(
      tuple,
      aliasedAnswers,
      visibleQuestionAliases,
    );
    return {
      labelKey: makeKey("sonder", key) satisfies keyof typeof DE,
      answer: { checked: "Ja", maybe: "Vielleicht", unchecked: "Nein" }[state],
      best,
      worst,
    };
  });
}
