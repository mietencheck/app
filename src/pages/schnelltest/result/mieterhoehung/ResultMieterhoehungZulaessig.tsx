import { getAusgangsmiete, getGeforderteNettokaltmiete } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";
import {
  useWorstBestZulaessigeHoechstmiete,
  useWorstBestZulaessigeHoechstmieteDiff,
} from "~/pages/details/utils";
import { formatEuro } from "~/utils";

import { WerdeAktiv } from "../../partials";

export function ResultMieterhöhungZulaessig() {
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const {
    worst: worstZulaessigeHoechstmiete,
    best: bestZulaessigeHoechstmiete,
  } = useWorstBestZulaessigeHoechstmiete();
  const { worst: worstDiff, best: bestDiff } =
    useWorstBestZulaessigeHoechstmieteDiff();
  const aktuelleNettokaltmiete =
    getAusgangsmiete(answers, visibleQuestionAliases) || 0;
  const geforderteNettokaltmiete =
    getGeforderteNettokaltmiete(answers, visibleQuestionAliases) || 0;
  const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-6">
        Die Mieterhöhung ist leider wahrscheinlich zulässig.
      </h2>
      <div className="text-neutral-faded space-y-2 mb-6">
        <p className="text-neutral-faded">
          Der Vermieter möchte die Miete von{" "}
          {formatEuro(aktuelleNettokaltmiete)} auf{" "}
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
          Die Mieterhöhung liegt dementsprechend unter der zulässige Höchstmiete
          und ist somit wahrscheinlich rechtens.
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">{l("Was nun?")}</h3>
        <p>
          Auch wenn die Mieterhöhung zulässig ist, kannst du dich trotzdem für
          bezahlbare Mieten einsetzen.
        </p>
      </div>
      <WerdeAktiv />
    </>
  );
}
