import { getGeforderteNettokaltmiete, getNettokaltmiete } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";
import {
  useWorstBestZulaessigeHoechstmiete,
  useWorstBestZulaessigeHoechstmieteDiff,
} from "~/pages/fragebogen/utils";
import { formatEuro } from "~/utils";

export function ResultMieterhoehungPotentiellUnzulaessig() {
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const nettokaltmiete =
    getNettokaltmiete(answers, visibleQuestionAliases) || 0;
  const geforderteNettokaltmiete =
    getGeforderteNettokaltmiete(answers, visibleQuestionAliases) || 0;

  const zulaessigeHoechstmiete = useWorstBestZulaessigeHoechstmiete();
  const zulaessigeHoechstmieteDiff = useWorstBestZulaessigeHoechstmieteDiff();
  const l = useLocalizeField();
  if (!zulaessigeHoechstmiete || !zulaessigeHoechstmieteDiff) {
    return null;
  }
  const {
    worst: worstZulaessigeHoechstmiete,
    best: bestZulaessigeHoechstmiete,
  } = zulaessigeHoechstmiete;
  const { worst: worstDiff, best: bestDiff } = zulaessigeHoechstmieteDiff;

  return (
    <>
      <h2 className="heading-24 mb-8">
        Die Mieterhöhung könnte bis zu{" "}
        {nettokaltmiete > bestZulaessigeHoechstmiete
          ? formatEuro(geforderteNettokaltmiete - nettokaltmiete)
          : formatEuro(
              geforderteNettokaltmiete - bestZulaessigeHoechstmiete,
            )}{" "}
        zu hoch und damit unzulässig sein.
      </h2>
      <h3 className="text-base-medium mb-2">{l("Was bedeutet das?")}</h3>
      <div className="text-gray-11 space-y-2 mb-6">
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
          Die Mieterhöhung könnte dementsprechend über der zulässigen
          Höchstmiete liegen und somit in ihrer Höhe unzulässig sein.
        </p>
      </div>

      <h3 className="text-base-medium mb-2">{l("Was nun?")}</h3>
      <div className="text-gray-11 space-y-2 mb-6">
        <p>
          Um einen genauen Wert für die zulässige Höchstmiete zu berechnen,
          musst du den vollständigen Fragebogen zu der Wohnung beantworten. Dies
          dauert etwa 20 Minuten.
        </p>
        <p>Hier für klicke einfach auf "Weiter zu den Details"</p>
      </div>
    </>
  );
}
