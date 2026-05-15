import { getGeforderteNettokaltmiete, getNettokaltmiete } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { useInlineLocale } from "~/l10n";
import {
  useWorstBestZulaessigeHoechstmiete,
  useWorstBestZulaessigeHoechstmieteDiff,
} from "~/pages/fragebogen/utils";
import { formatEuro } from "~/utils";

export function ResultMieterhoehungPotentiellUnzulaessig() {
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const nettokaltmiete =
    getNettokaltmiete(answers, visibleQuestionAliases) || 0;
  const geforderteNettokaltmiete =
    getGeforderteNettokaltmiete(answers, visibleQuestionAliases) || 0;

  const zulaessigeHoechstmiete = useWorstBestZulaessigeHoechstmiete();
  const zulaessigeHoechstmieteDiff = useWorstBestZulaessigeHoechstmieteDiff();
  const l = useInlineLocale();
  if (!zulaessigeHoechstmiete || !zulaessigeHoechstmieteDiff) {
    return null;
  }
  const {
    worst: worstZulaessigeHoechstmiete,
    best: bestZulaessigeHoechstmiete,
  } = zulaessigeHoechstmiete;
  const { worst: worstDiff, best: bestDiff } = zulaessigeHoechstmieteDiff;

  const excessAmount =
    nettokaltmiete > bestZulaessigeHoechstmiete
      ? formatEuro(geforderteNettokaltmiete - nettokaltmiete)
      : formatEuro(geforderteNettokaltmiete - bestZulaessigeHoechstmiete);

  return (
    <>
      <h2 className="heading-24 mb-8">
        {l({
          de: `Die Mieterhöhung könnte bis zu ${excessAmount} zu hoch und damit unzulässig sein.`,
          en: `The rent increase could be up to ${excessAmount} too high and therefore impermissible.`,
        })}
      </h2>
      <h3 className="text-base-medium mb-2">
        {l({ de: "Was bedeutet das?", en: "What does that mean?" })}
      </h3>
      <div className="text-gray-11 space-y-2 mb-6">
        <p>
          {l({
            de: `Der Vermieter möchte die Miete von ${formatEuro(nettokaltmiete)} auf ${formatEuro(geforderteNettokaltmiete)} erhöhen.`,
            en: `The landlord wants to increase the rent from ${formatEuro(nettokaltmiete)} to ${formatEuro(geforderteNettokaltmiete)}.`,
          })}{" "}
          {worstDiff == bestDiff
            ? l({
                de: `Basierend auf deinen Angaben, haben wir für die Wohnung eine zulässige Höchstmiete von ${formatEuro(bestZulaessigeHoechstmiete)} errechnet.`,
                en: `Based on your information, we have calculated a maximum rent of ${formatEuro(bestZulaessigeHoechstmiete)} for the apartment.`,
              })
            : l({
                de: `Basierend auf deinen Angaben, haben wir für die Wohnung eine zulässige Höchstmiete zwischen ${formatEuro(bestZulaessigeHoechstmiete)} und ${formatEuro(worstZulaessigeHoechstmiete)} errechnet.`,
                en: `Based on your information, we have calculated a maximum permissible rent for the apartment between ${formatEuro(bestZulaessigeHoechstmiete)} and ${formatEuro(worstZulaessigeHoechstmiete)}.`,
              })}{" "}
        </p>
        <p>
          {l({
            de: "Die Mieterhöhung könnte dementsprechend über der zulässigen Höchstmiete liegen und somit in ihrer Höhe unzulässig sein.",
            en: "The rent increase could therefore exceed the permissible maximum rent and thus be impermissible in amount.",
          })}
        </p>
      </div>
      <h3 className="text-base-medium mb-2">
        {l({ de: "Was nun?", en: "What now?" })}
      </h3>
      <div className="text-gray-11 space-y-2 mb-6">
        <p>
          {l({
            de: "Um einen genauen Wert für die zulässige Höchstmiete zu berechnen, musst du den vollständigen Fragebogen zu der Wohnung beantworten. Dies dauert etwa 20 Minuten.",
            en: "To calculate an exact value for the permissible maximum rent, you must answer the complete questionnaire about the apartment. This takes about 20 minutes.",
          })}
        </p>
        <p>
          {l({
            de: 'Hier für klicke einfach auf "Weiter zu den Details"',
            en: 'To do this, simply click on "Go to details"',
          })}
        </p>
      </div>
    </>
  );
}
