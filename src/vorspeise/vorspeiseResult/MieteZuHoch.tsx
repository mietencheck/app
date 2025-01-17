import {
  useWorstBestZulaessigeHoechstmiete,
  useWorstBestZulaessigeHoechstmieteDiff,
} from "~/details/utils";
import { useLocalizeField } from "~/l10n";
import { formatEuro } from "~/utils";

export function MieteZuHoch() {
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
        {worstDiff > 0 && worstDiff !== bestDiff
          ? l("Du könntest zwischen X und Y zu viel zahlen", {
              WORSTDIFF: formatEuro(worstDiff),
              BESTDIFF: formatEuro(bestDiff),
            })
          : l("Du könntest X zu viel zahlen", {
              DIFF: formatEuro(bestDiff),
            })}
      </h2>
      <h3 className="text-base-medium mb-2">{l("Was bedeutet das?")}</h3>
      <div className="text-neutral-faded space-y-2 mb-6">
        <p>
          {worstDiff == bestDiff
            ? l("Ergebnis zulässige Höchstmiete", {
                MIETE: formatEuro(bestZulaessigeHoechstmiete),
              })
            : l("Ergebnis zulässige Höchstmiete zwischen X und Y", {
                LOWESTMIETE: formatEuro(bestZulaessigeHoechstmiete),
                HIGHESTMIETE: formatEuro(worstZulaessigeHoechstmiete),
              })}{" "}
          {bestDiff <= 0
            ? l("Ergebnis Mietpreisbremse nicht möglich")
            : l("Ergebnis Mietpreisbremse möglich")}
        </p>
        <p>{l("Bitte beachte, dass dieses Ergebnis nur vorläufig ist.")}</p>
      </div>

      <h3 className="text-base-medium mb-2">{l("Was nun?")}</h3>
      <p className="text-neutral-faded mb-6">{l("Vorspeise Was Nun Text")}</p>
    </>
  );
}
