import type { MieteErgebnis } from "~/calculation/mieteErgebnis";
import { useInlineLocale } from "~/l10n";
import { formatEuro } from "~/utils";

import Disclaimer from "../../partials/Disclaimer";

export function ResultMieteZulaessig({ result }: { result: MieteErgebnis }) {
  const l = useInlineLocale();
  const { diff, zulaessigeHoechstmiete } = result;
  const nettokaltmiete = zulaessigeHoechstmiete.worst + diff.worst;

  return (
    <>
      <h1>
        {l({
          de: "Leider ist deine Miete im Rahmen des Mietspiegels.",
          en: "Unfortunately, your rent is within the rent index.",
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
          de: "Da deine Nettokaltmiete unter diese Spanne liegt, kann die Mietpreisbremse leider nicht angewendet werden.",
          en: "Since your net cold rent is below this range, the Rent Control Act unfortunately cannot be applied.",
        })}
      </p>
      <Disclaimer />
    </>
  );
}
