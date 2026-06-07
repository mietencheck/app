import type { MieteErgebnis } from "~/calculation/mieteErgebnis";
import { useInlineLocale } from "~/l10n";
import { formatEuro } from "~/utils";

export function ResultMieteNichtZulaessig({
  result,
}: {
  result: MieteErgebnis;
}) {
  const l = useInlineLocale();
  const { diff, zulaessigeHoechstmiete } = result;
  const nettokaltmiete = zulaessigeHoechstmiete.worst + diff.worst;
  const showRange =
    result.kind === "zu_hoch" && diff.worst > 0 && diff.worst !== diff.best;

  return (
    <>
      <h1>
        {showRange
          ? l({
              de: `Du könntest potenziell ${formatEuro(diff.worst)} bis ${formatEuro(diff.best)} an Miete pro Monat sparen!`,
              en: `You could potentially save ${formatEuro(diff.worst)} to ${formatEuro(diff.best)} in rent per month!`,
            })
          : l({
              de: `Du könntest potenziell bis zu ${formatEuro(diff.best)} an Miete pro Monat sparen!`,
              en: `You could potentially save up to ${formatEuro(diff.best)} in rent per month!`,
            })}
      </h1>
      <p>
        {l({
          de: `Du hast angegeben, dass die Nettokaltmiete bei Abschluss des Mietvertrages ${formatEuro(nettokaltmiete)} betragen hat.`,
          en: `You indicated that the net cold rent is ${formatEuro(nettokaltmiete)}.`,
        })}{" "}
        {!result.hasRange
          ? l({
              de: `Basierend auf deinen Angaben, haben wir für die Wohnung eine zulässige Höchstmiete von ${formatEuro(zulaessigeHoechstmiete.best)} errechnet.`,
              en: `Based on your information, we have calculated a maximum rent of ${formatEuro(zulaessigeHoechstmiete.best)} for the apartment.`,
            })
          : l({
              de: `Basierend auf deinen Angaben, haben wir für die Wohnung eine zulässige Höchstmiete zwischen ${formatEuro(zulaessigeHoechstmiete.best)} und ${formatEuro(zulaessigeHoechstmiete.worst)} errechnet.`,
              en: `Based on your information, we have calculated a maximum permissible rent for the apartment between ${formatEuro(zulaessigeHoechstmiete.best)} and ${formatEuro(zulaessigeHoechstmiete.worst)}.`,
            })}{" "}
      </p>
      <p>
        {l({
          de: "Dies bedeutet, dass du eventuell deine Miete mithilfe der Mietpreisbremse senken kannst.",
          en: "This means that you may be able to reduce your rent with the help of the Rent Control Act.",
        })}{" "}
        {l({
          de: "Bitte beachte, dass dieses Ergebnis nur vorläufig ist.",
          en: "Please note that this result is only preliminary.",
        })}
      </p>
      <h3>{l({ de: "Was nun?", en: "What now?" })}</h3>
      <p>
        {l({
          de: 'Um einen genaueren Wert zu berechnen, musst du den vollständigen Fragebogen zu der Wohnung beantworten. Dies dauert etwa 20 Minuten. Hier für klicke einfach auf "Weiter zu den Details"',
          en: 'To calculate a more accurate value, you must answer the complete questionnaire about the apartment. This takes about 20 minutes. To do this, simply click on "Go to details"',
        })}
      </p>
    </>
  );
}
