import { useInlineLocale } from "~/l10n";
import { formatEuro } from "~/utils";

export function ResultMieterhoehungZulaessig({
  nettokaltmiete,
  geforderteNettokaltmiete,
}: {
  nettokaltmiete: number;
  geforderteNettokaltmiete: number;
}) {
  const l = useInlineLocale();
  return (
    <>
      <h1>
        {l({
          de: "Die Mieterhöhung ist wahrscheinlich zulässig.",
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
        Wir haben die Mieterhöhung auf Einhaltung der formalen Vorausetzungen
        zulässigen Höchstmiete, Kappungsgrenze und Sperrfristen überprüft.
        Hierbei konnten wir keinen Verstoß feststellen.
      </p>
      <p>
        {l({
          de: `Die Mieterhöhung ist dementsprechend wahrscheinlich zulässig.`,
          en: `[DE]`,
        })}
      </p>
      <h3>Was nun?</h3>
      <p>
        Bitte überprüfe deine Angaben stimmen. Wenn das zutrifft, ist die
        Mieterhöhung wahrscheinlich zulässig. Du solltest die gefordete Miete
        also ab dem vereinbarten Zeitpunkt bezahlen.
      </p>
    </>
  );
}
