import { getWorstBestZulaessigeHoechstmiete } from "../../src/calculation/zulaessigeHoechstmiete.js";
import { getVisibleQuestionAliases } from "../../src/form/flow-machine.js";

export function onRequestPost() {
  const answers = {};
  const visibleQuestionAliases = getVisibleQuestionAliases(answers);
  const zulaessigeHoechstmiete = getWorstBestZulaessigeHoechstmiete(
    answers,
    visibleQuestionAliases,
  );

  return new Response(
    JSON.stringify({ message: "hi", zulaessigeHoechstmiete }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
