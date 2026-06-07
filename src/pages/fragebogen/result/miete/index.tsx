import { useInlineLocale } from "~/l10n";

import { useMieteErgebnis } from "../../utils";
import { ResultMieteNichtZulaessig } from "./ResultMieteNichtZulaessig";
import { ResultMieteZulaessig } from "./ResultMieteZulaessig";

export function ResultMiete() {
  const result = useMieteErgebnis();
  const l = useInlineLocale();

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <h2 className="heading-24 mb-4">
          {l({
            de: "Fehler beim Berechnen des Ergebnisses",
            en: "Error calculating the result",
          })}
        </h2>
        <p className="text-gray-11 mb-4">
          {l({
            de: 'Es ist ein Fehler beim Berechnen des Ergebnisses aufgetreten. Bitte klick unten auf "Neu anfangen".',
            en: 'An error occurred while calculating the result. Please click "Start over" below.',
          })}
        </p>
      </div>
    );
  }

  if (result.kind === "zulaessig") {
    return <ResultMieteZulaessig result={result} />;
  }

  return <ResultMieteNichtZulaessig result={result} />;
}
