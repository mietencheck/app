//import { useLocalizeField } from "~/l10n";

import { getAusgangsmiete, getGeforderteNettokaltmiete } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { formatEuro } from "~/utils";

export function ExitKappungsgrenzeDurchVorherigeMietspiegelMieterhoehungenUeberschritten() {
  //const l = useLocalizeField();
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const ausgangsmiete = getAusgangsmiete(answers, visibleQuestionAliases) || 0;
  const geforderteNettokaltmiete =
    getGeforderteNettokaltmiete(answers, visibleQuestionAliases) || 0;

  return (
    <>
      <h2 className="heading-24 mb-4">
        Die Mieterhöhung ist wahrscheinlich nicht rechtmäßig
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Dein Vermieter darf die Miete innerhalb von drei Jahren maximal um 15
          Prozent erhöhen. Dies ist die sogenannte Kappungsgrenze. Dieser Betrag
          ist hier vollständig überschritten. Die Mieterhöhung ist daher
          rechtswidrig.
        </p>
        <p>
          Basierend auf deinen AngabAusgangsmiete: {formatEuro(ausgangsmiete)}
        </p>
        <p>geforderteNettokaltmiete: {formatEuro(geforderteNettokaltmiete)}</p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <div className="space-y-3 text-neutral-faded mb-6">
          <p>
            Du musst der Mieterhöhung nicht zustimmen. Wir empfehlen dir deinen
            Vermieter kurz vor dem Ende der First, welche dein Vermieter dir zur
            Zustimmung gegeben hat, auf diese Tatsache hinzuweisen.
          </p>
          <p>Dies kannst du ganz formfrei auf dem Wege deiner Wahl tun.</p>
        </div>
      </div>
    </>
  );
}
