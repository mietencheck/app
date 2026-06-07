import type { MieteErgebnis } from "~/calculation/mieteErgebnis";
import { useInlineLocale } from "~/l10n";
import { formatEuro } from "~/utils";

import { AuswertungTabPanel, MerkmalTabPanel } from "../partials/modal";
import { BeratungSection } from "./partials/BeratungSection";
import { MieteAuswertungButtons } from "./partials/MieteAuswertungButtons";

export function ResultMieteNichtZulaessig({
  result,
}: {
  result: MieteErgebnis;
}) {
  const l = useInlineLocale();
  const { diff, zulaessigeHoechstmiete } = result;
  const showRange =
    result.kind === "zu_hoch" && diff.worst > 0 && diff.worst !== diff.best;

  const headline = showRange
    ? l({
        de: `Du zahlst wahrscheinlich zwischen ${formatEuro(diff.worst)} und ${formatEuro(diff.best)} zu viel Miete pro Monat.`,
        en: `You're probably paying between ${formatEuro(diff.worst)} and ${formatEuro(diff.best)} too much rent per month.`,
      })
    : l({
        de: `Du zahlst wahrscheinlich ${formatEuro(diff.best)} zu viel Miete pro Monat.`,
        en: `You're probably paying ${formatEuro(diff.best)} too much rent per month.`,
      });

  return (
    <>
      <div id="print" className="w-[768px] hidden print:block p-4">
        <div className="mb-12">
          <h2 className="heading-24 mb-4">{headline}</h2>
          <p className="text-base text-gray-11">
            {!result.hasRange
              ? l({
                  de: `Basierend auf deinen Angaben, haben wir für die Wohnung eine zulässige Höchstmiete von ${formatEuro(zulaessigeHoechstmiete.best)} errechnet.`,
                  en: `Based on your information, we have calculated a maximum rent of ${formatEuro(zulaessigeHoechstmiete.best)} for the apartment.`,
                })
              : l({
                  de: `Basierend auf deinen Angaben, haben wir für die Wohnung eine zulässige Höchstmiete zwischen ${formatEuro(zulaessigeHoechstmiete.best)} und ${formatEuro(zulaessigeHoechstmiete.worst)} errechnet.`,
                  en: `Based on your information, we have calculated a maximum permissible rent for the apartment between ${formatEuro(zulaessigeHoechstmiete.best)} and ${formatEuro(zulaessigeHoechstmiete.worst)}.`,
                })}{" "}
            {l({
              de: "Dies bedeutet, dass du eventuell deine Miete mithilfe der Mietpreisbremse senken kannst.",
              en: "This means that you may be able to reduce your rent with the help of the Rent Control Act.",
            })}
          </p>
        </div>
        <AuswertungTabPanel />
        <MerkmalTabPanel />
      </div>

      <h2 className="heading-24 mb-4">{headline}</h2>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-base-medium">
            {l({ de: "Was bedeutet das?", en: "What does that mean?" })}
          </h3>
          <p className="text-base text-gray-11">
            {!result.hasRange
              ? l({
                  de: `Basierend auf deinen Angaben, haben wir für die Wohnung eine zulässige Höchstmiete von ${formatEuro(zulaessigeHoechstmiete.best)} errechnet.`,
                  en: `Based on your information, we have calculated a maximum rent of ${formatEuro(zulaessigeHoechstmiete.best)} for the apartment.`,
                })
              : l({
                  de: `Basierend auf deinen Angaben, haben wir für die Wohnung eine zulässige Höchstmiete zwischen ${formatEuro(zulaessigeHoechstmiete.best)} und ${formatEuro(zulaessigeHoechstmiete.worst)} errechnet.`,
                  en: `Based on your information, we have calculated a maximum permissible rent for the apartment between ${formatEuro(zulaessigeHoechstmiete.best)} and ${formatEuro(zulaessigeHoechstmiete.worst)}.`,
                })}{" "}
            {l({
              de: "Dies bedeutet, dass die Höhe deiner Miete wahrscheinlich nicht rechtens ist.",
              en: "This means that the amount of your rent is probably not lawful.",
            })}
          </p>
          <p className="text-base text-gray-11 mb-8">
            {l({
              de: 'Wenn du im Detail verstehen möchtest, wie die Werte zustande gekommen bist, klicke einfach auf "Auswertung ansehen".',
              en: 'If you want to understand in detail how the values were calculated, simply click on "View details".',
            })}
          </p>
          <MieteAuswertungButtons />
        </div>
      </div>

      <BeratungSection />
    </>
  );
}
