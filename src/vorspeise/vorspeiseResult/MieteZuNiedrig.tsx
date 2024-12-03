import {
  useLowestHighestZulaessigeHoechstmiete,
  useLowestHighestZulaessigeHoechstmieteDiff,
} from "~/details/utils";
import { useLocalizeField } from "~/l10n";
import { formatEuro } from "~/utils";

import { WerdeAktiv } from "../partials";

export function MieteZuNiedrig() {
  const {
    highest: highestZulaessigeHoechstmiete,
    lowest: lowestZulaessigeHoechstmiete,
  } = useLowestHighestZulaessigeHoechstmiete();
  const { highest: highestDiff, lowest: lowestDiff } =
    useLowestHighestZulaessigeHoechstmieteDiff();
  const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-6">
        {l("Leider ist deine Miete im Rahmen des Mietspiegels.")}
      </h2>
      <div className="text-neutral-faded space-y-2 mb-6">
        <p className="text-neutral-faded">
          {highestDiff == lowestDiff
            ? l("Ergebnis zulässige Höchstmiete", {
                MIETE: formatEuro(lowestZulaessigeHoechstmiete),
              })
            : l("Ergebnis zulässige Höchstmiete zwischen X und Y", {
                LOWESTMIETE: formatEuro(lowestZulaessigeHoechstmiete),
                HIGHESTMIETE: formatEuro(highestZulaessigeHoechstmiete),
              })}{" "}
        </p>
        <p>
          {l(
            "Da deine Miete unter diese Spanne liegt, kann die Mietpreisbremse leider nicht angewendet werden.",
          )}
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">{l("Was nun?")}</h3>
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
