import { useLocalizeField } from "~/l10n";
import {
  useWorstBestZulaessigeHoechstmiete,
  useWorstBestZulaessigeHoechstmieteDiff,
} from "~/pages/fragebogen/utils";
import { formatEuro } from "~/utils";

import { WerdeAktiv } from "../../partials";

export function ResultMieteZulaessig() {
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
      <h2 className="heading-24 mb-6">
        {l("Leider ist deine Miete im Rahmen des Mietspiegels.")}
      </h2>
      <div className="text-gray-11 space-y-2 mb-6">
        <p className="text-gray-11">
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
          {l(
            "Da deine Miete unter diese Spanne liegt, kann die Mietpreisbremse leider nicht angewendet werden.",
          )}
        </p>
      </div>
      <div className="space-y-2 mb-6 text-gray-11">
        <h3 className="text-base-medium text-gray-12">{l("Was nun?")}</h3>
        <p>
          {l(
            "Auch wenn die Mietpreisbremse für die Wohnung nicht gilt, kannst du dich trotzdem für bezahlbare Mieten einsetzen.",
          )}
        </p>
      </div>
      <WerdeAktiv />
    </>
  );
}
