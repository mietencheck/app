import { getLowestHighestPreisspanne } from "~/2024/calculation/preisspanne";
import { FinalAnswers } from "~/form/flow-machine";

import { getLowestHighestSondermerkmalAbzug } from "./sondermerkmale";
import { getLowestHighestSpanneneinordnung } from "./spanneneinordnung";

const calcOrtsueblicheVergleichsmiete = (
  preisspanne: [number, number, number],
  spanneneinordnung: number,
): number => {
  const [avg, lower, upper] = preisspanne;
  if (spanneneinordnung >= 0) {
    return Math.round((avg + (upper - avg) * spanneneinordnung) * 100) / 100;
  } else {
    return Math.round((avg - (avg - lower) * spanneneinordnung) * 100) / 100;
  }
};

export function getLowestHighestOrtsueblicheVergleichsmiete(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): { lowest: number; highest: number } | undefined {
  const preisspanne = getLowestHighestPreisspanne(
    answers,
    visibleQuestionAliases,
  );
  const spanneneinordnung = getLowestHighestSpanneneinordnung(
    answers,
    visibleQuestionAliases,
  );
  const sondermerkmalAbzug = getLowestHighestSondermerkmalAbzug(
    answers,
    visibleQuestionAliases,
  );

  if (!preisspanne) {
    return undefined;
  }

  return {
    lowest: calcOrtsueblicheVergleichsmiete(
      preisspanne.lowest,
      spanneneinordnung.lowest,
    ),
    highest: calcOrtsueblicheVergleichsmiete(
      preisspanne.highest,
      spanneneinordnung.highest,
    ),
  };
}
