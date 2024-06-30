import { useMieteDiff, useWorstBestMiete } from "~/details/utils";
import { StepInfoByAlias, useAnswers } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";
import { formatEuro } from "~/utils";

export function MieteZuHoch() {
  const answers = useAnswers();
  const aliasedState = answers.getAliasedState();

  const baujahr = aliasedState["Baujahr"] as NonNullable<
    StepInfoByAlias["Baujahr"]["answer"]
  >;

  const { worst: worstMiete, best: bestMiete } = useWorstBestMiete();
  const { worst: worstDiff, best: bestDiff } = useMieteDiff();
  const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-8">
        {worstDiff > 0
          ? l("Du könntest zwischen X und Y zu viel zahlen", {
              WORSTDIFF: formatEuro(worstDiff),
              BESTDIFF: formatEuro(bestDiff),
            })
          : l("Du könntest X zu viel zahlen", { DIFF: formatEuro(bestDiff) })}
      </h2>
      <h3 className="text-base-medium mb-2">{l("Was bedeutet das?")}</h3>
      <div className="text-neutral-faded space-y-2 mb-6">
        <p>
          {worstDiff == bestDiff
            ? l("Ergebnis zulässige Höchstmiete", {
                MIETE: formatEuro(bestMiete),
              })
            : l("Ergebnis zulässige Höchstmiete zwischen X und Y", {
                BESTMIETE: formatEuro(bestMiete),
                WORSTMIETE: formatEuro(worstMiete),
              })}{" "}
          {bestDiff <= 0
            ? l("Ergebnis Mietpreisbremse nicht möglich")
            : l("Ergebnis Mietpreisbremse möglich")}
        </p>
        <p>{l("Bitte beachte, dass dieses Ergebnis nur vorläufig ist.")}</p>
      </div>
      {baujahr == "Nicht sicher" && (
        <>
          <h3 className="heading-16 mb-2">
            {l("Achtung: Uns fehlen Daten für eine verlässliche Prognose")}
          </h3>
          <div className="text-neutral-faded space-y-2 mb-6">
            <p>
              {aliasedState["Dachgeschoss Ausgebaut"] == "Ja"
                ? l("Fehlende Daten Haus")
                : l("Fehlende Daten Dachgeschoss")}
            </p>
          </div>
        </>
      )}

      <h3 className="text-base-medium mb-2">{l("Was nun?")}</h3>
      <p className="text-neutral-faded mb-6">{l("Vorspeise Was Nun Text")}</p>
    </>
  );
}
