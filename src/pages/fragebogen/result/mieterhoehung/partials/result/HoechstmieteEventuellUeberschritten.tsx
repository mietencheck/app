import { AlertCircle } from "lucide-react";

import { useInlineLocale } from "~/l10n";
import { formatEuro } from "~/utils";

export function ResultMieterhoehungHoechstmieteEventuellUeberschritten({
  nettokaltmiete,
  geforderteNettokaltmiete,
  worstZulaessigeHoechstmiete,
  bestZulaessigeHoechstmiete,
}: {
  nettokaltmiete: number;
  geforderteNettokaltmiete: number;
  worstZulaessigeHoechstmiete: number;
  bestZulaessigeHoechstmiete: number;
}) {
  const l = useInlineLocale();
  const bestZulaessigeHoechstmieteDiff =
    nettokaltmiete > bestZulaessigeHoechstmiete
      ? geforderteNettokaltmiete - nettokaltmiete
      : geforderteNettokaltmiete - bestZulaessigeHoechstmiete;

  return (
    <>
      <h1>
        {l({
          de: `Die Mieterhöhung könnte bis zu ${formatEuro(bestZulaessigeHoechstmieteDiff)} zu hoch sein und somit in ihrer Höhe nicht zulässig sein.`,
          en: "[DE]",
        })}
      </h1>
      <div className="flex gap-2 bg-purple-3 px-3 py-2 rounded text-purple-11">
        <div className="flex items-center justify-center h-[24px]">
          <AlertCircle size="16" />
        </div>
        Es fehlen je Informationen für ein eindeutiges Ergebnis.
      </div>
      <h3>Was bedeutet das?</h3>
      <p>
        {l({
          de: `Dein Vermieter möchte die Miete von ${formatEuro(nettokaltmiete)} auf ${formatEuro(geforderteNettokaltmiete)} erhöhen.`,
          en: `[DE]`,
        })}{" "}
        {bestZulaessigeHoechstmiete == worstZulaessigeHoechstmiete
          ? l({
              de: `Basierend auf deinen Angaben, haben wir für deine Wohnung eine zulässige Höchstmiete von ${formatEuro(worstZulaessigeHoechstmiete)} errechnet.`,
              en: `[DE]`,
            })
          : l({
              de: `Basierend auf deinen Angaben, haben wir für deine Wohnung eine zulässige Höchstmiete zwischen ${formatEuro(bestZulaessigeHoechstmiete)} und ${formatEuro(worstZulaessigeHoechstmiete)} errechnet.`,
              en: `[DE]`,
            })}{" "}
        {l({
          de: `Die Mieterhöhung könnte also bis zu ${formatEuro(bestZulaessigeHoechstmieteDiff)} zu hoch sein und somit nicht zulässig sein.`,
          en: "[DE]",
        })}
      </p>
      <p>
        Uns fehlen jedoch zur Zeit Informationen, um eine genaue zulässige
        Höchstmiete zu berechnen. Das liegt daran, dass du einige Fragen mit
        "Ich bin mir nicht sicher" beantwortest hast.
      </p>
      <h3>Was nun?</h3>
      <p>
        Um ein definitives Ergebnis zu bekommen, gehe bitte zurück zu den Fragen
        zu den Merkmalsgruppen und versuche möglichst viele Frage mit "Ja" oder
        "Nein" zu beantworten.
      </p>
      <p>
        Wenn du keine der Fragen besser beantworten kannst, wende dich bitte an
        eine <a href="TODO">Mietberatung</a> und fülle die verbliebenen Fragen
        gemeinsam aus.
      </p>
    </>
  );
}
