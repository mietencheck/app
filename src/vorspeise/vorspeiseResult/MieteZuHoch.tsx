import {
  useLowestHighestZulaessigeHoechstmiete,
  useNettokaltmieteZulaessigeHoechstmieteDiff,
} from "~/details/utils";
import { useLocalizeField } from "~/l10n";
import { formatEuro } from "~/utils";

export function MieteZuHoch() {
  const {
    highest: highestZulaessigeHoechstmiete,
    lowest: lowestZulaessigeHoechstmiete,
  } = useLowestHighestZulaessigeHoechstmiete();
  const { lowest: lowestDiff, highest: highestDiff } =
    useNettokaltmieteZulaessigeHoechstmieteDiff();
  const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-8">
        {lowestDiff > 0 && highestDiff !== lowestDiff
          ? l("Du könntest zwischen X und Y zu viel zahlen", {
              LOWESTDIFF: formatEuro(lowestDiff),
              HIGHESTDIFF: formatEuro(highestDiff),
            })
          : l("Du könntest X zu viel zahlen", {
              DIFF: formatEuro(highestDiff),
            })}
      </h2>
      <h3 className="text-base-medium mb-2">{l("Was bedeutet das?")}</h3>
      <div className="text-neutral-faded space-y-2 mb-6">
        <p>
          {highestDiff == lowestDiff
            ? l("Ergebnis zulässige Höchstmiete", {
                MIETE: formatEuro(lowestZulaessigeHoechstmiete),
              })
            : l("Ergebnis zulässige Höchstmiete zwischen X und Y", {
                BESTMIETE: formatEuro(lowestZulaessigeHoechstmiete),
                WORSTMIETE: formatEuro(highestZulaessigeHoechstmiete),
              })}{" "}
          {lowestDiff <= 0
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
