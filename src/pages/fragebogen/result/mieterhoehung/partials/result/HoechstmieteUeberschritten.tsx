import { useInlineLocale } from "~/l10n";
import { formatEuro } from "~/utils";

export function ResultMieterhoehungNichtZulaessig({
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
  return (
    <>
      <h1>
        {l({
          de: "Die Mieterhöhung ist wahrscheinlich nicht zulässig.",
          en: "[DE]",
        })}
      </h1>
      <h3>
        {l({
          de: "Was bedeutet das?",
          en: "What does that mean?",
        })}
      </h3>
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
            })}
      </p>
      <p>
        {l({
          de: `Da deine aktuelle Nettokaltmiete bereits über der zulässigen Höchstmiete liegt, ist eine weitere Erhöhung deiner Nettokaltmiete wahrscheinlich nicht zulässig.`,
          en: `[DE]`,
        })}
      </p>
      <h3>
        {l({
          de: `Was nun?`,
          en: `[DE]`,
        })}
      </h3>
      <p>Bitte überprüfe zunächst, ob die folgenden Angaben stimmen:</p>
      <ol>
        <li>
          Deine aktuelle Nettokaltmiete beträgt {formatEuro(nettokaltmiete)}.
        </li>
        <li>
          Dein Vermieter möchte die Nettokaltmiete auf{" "}
          {formatEuro(geforderteNettokaltmiete)} anheben.
        </li>
        <li>
          Deine Angaben bezüglich zur Wohnung und Mietvertrag korrekt sind.
          Diese Informationen findest du, wenn du unten "Gesamte Auswertung
          ansehen" klickst.
        </li>
      </ol>
      <p>
        Wenn deine Angaben korrekt sind, ist die Mieterhöhung wahrscheinlich
        zulässig. Du solltest die gefordete Miete also ab dem vereinbarten
        Zeitpunkt bezahlen.
      </p>
    </>
  );
}
