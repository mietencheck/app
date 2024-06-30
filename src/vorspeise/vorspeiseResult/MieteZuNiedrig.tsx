import { useMieteDiff, useWorstBestMiete } from "~/details/utils";
import { useLocalizeField } from "~/l10n";
import { formatEuro } from "~/utils";

import { WerdeAktiv } from "../partials";

export function MieteZuNiedrig() {
  const { worst: worstMiete, best: bestMiete } = useWorstBestMiete();
  const { worst: worstDiff, best: bestDiff } = useMieteDiff();
  const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-6">
        {l("Leider ist deine Miete ist im Rahmen des Mietspiegels.")}
      </h2>
      <div className="text-neutral-faded space-y-2 mb-6">
        <p className="text-neutral-faded">
          {worstDiff == bestDiff
            ? l("Ergebnis zulässige Höchstmiete", {
                MIETE: formatEuro(bestMiete),
              })
            : l("Ergebnis zulässige Höchstmiete zwischen X und Y", {
                BESTMIETE: formatEuro(bestMiete),
                WORSTMIETE: formatEuro(worstMiete),
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
