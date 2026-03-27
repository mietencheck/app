import { useInlineLocale } from "~/l10n";

export function ExitMietvertragZuAlt() {
  const l = useInlineLocale();

  return (
    <>
      <h2>
        {l({
          de: "Leider gilt die Mietpreisbremse nur für Mietverträge, die nach dem 01.06.2015 abgeschlossenen wurden.",
          en: "Unfortunately, the Rent Control Act only applies to rental agreements concluded after June 1, 2015.",
        })}
      </h2>
      <p>
        {l({
          de: "Das Gesetz der Mietpreisbremse gilt in Berlin nur für Wohnungen, deren Mietvertrag ab dem 01.06.2015 abgeschlossen wurden. Da du angegeben hast, das du deinen Mietvertrag vor diesem Datum unterschrieben hast, können wir dir an dieser Stelle leider nicht weiter helfen.",
          en: "In Berlin, the Rent Control Act only applies to apartments whose rental agreement was signed after June 1, 2015. As you have stated that you signed your rental agreement before this date, we are unfortunately unable to help you here.",
        })}
      </p>
      <h3>{l({ de: "Was nun?", en: "What now?" })}</h3>
      <p>
        {l({
          de: "Auch wenn die Mietpreisbremse für die Wohnung nicht gilt, kannst du dich trotzdem für bezahlbare Mieten einsetzen.",
          en: "Even if the Rent Control Act does not apply to the apartment, you can still campaign for affordable rents.",
        })}
      </p>
    </>
  );
}
