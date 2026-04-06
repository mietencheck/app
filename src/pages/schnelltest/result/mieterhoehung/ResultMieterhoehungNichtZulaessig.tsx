import { getGeforderteNettokaltmiete, getNettokaltmiete } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";
import {
  useWorstBestZulaessigeHoechstmiete,
  useWorstBestZulaessigeHoechstmieteDiff,
} from "~/pages/fragebogen/utils";
import { formatEuro } from "~/utils";

export function ResultMieterhoehungNichtZulaessig() {
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const nettokaltmiete =
    getNettokaltmiete(answers, visibleQuestionAliases) || 0;
  const geforderteNettokaltmiete =
    getGeforderteNettokaltmiete(answers, visibleQuestionAliases) || 0;

  const {
    worst: worstZulaessigeHoechstmiete,
    best: bestZulaessigeHoechstmiete,
  } = useWorstBestZulaessigeHoechstmiete();

  const { worst: worstDiff, best: bestDiff } =
    useWorstBestZulaessigeHoechstmieteDiff();
  const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-8">
        Die Mieterhöhung ist wahrscheinlich nicht zulässig.
      </h2>
      <h3 className="text-base-medium mb-2">{l("Was bedeutet das?")}</h3>
      <div className="text-neutral-faded space-y-2 mb-6">
        <p>
          Der Vermieter möchte die Miete von {formatEuro(nettokaltmiete)} auf{" "}
          {formatEuro(geforderteNettokaltmiete)} erhöhen.{" "}
          {worstDiff == bestDiff
            ? l("Ergebnis zulässige Höchstmiete", {
                MIETE: formatEuro(bestZulaessigeHoechstmiete),
              })
            : l("Ergebnis zulässige Höchstmiete zwischen X und Y", {
                LOWESTMIETE: formatEuro(bestZulaessigeHoechstmiete),
                HIGHESTMIETE: formatEuro(worstZulaessigeHoechstmiete),
              })}{" "}
        </p>
        <p>
          Da deine Miete aktuell schon über der zulässigen Höchstmiete liegt,
          ist eine weitere Erhöhung nicht zulässig.
        </p>
      </div>

      <h3 className="text-base-medium mb-2">{l("Was nun?")}</h3>
      <p className="text-neutral-faded mb-6">TODO</p>
    </>
  );
}
