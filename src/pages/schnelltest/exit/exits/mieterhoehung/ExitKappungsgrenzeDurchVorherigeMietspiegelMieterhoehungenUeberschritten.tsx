//import { useLocalizeField } from "~/l10n";

import { getAusgangsmiete, getNettokaltmieteVor33Monaten } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { formatEuro } from "~/utils";

export function ExitKappungsgrenzeDurchVorherigeMietspiegelMieterhoehungenUeberschritten() {
  //const l = useLocalizeField();
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const ausgangsmiete = getAusgangsmiete(answers, visibleQuestionAliases) || 0;
  const nettokaltmieteVor33Monaten =
    getNettokaltmieteVor33Monaten(answers, visibleQuestionAliases) || 0;

  return (
    <>
      <h2 className="heading-24 mb-4">
        Die Mieterhöhung ist wahrscheinlich nicht rechtmäßig, da die
        Kappungsgrenze überschritten wurde.
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Dein Vermieter darf die Miete innerhalb von drei Jahren maximal um 15
          Prozent erhöhen. Dies ist die sogenannte Kappungsgrenze.
        </p>
        <p>
          Du hast angegeben, dass die Nettokaltmiete vor 33 Monaten{" "}
          {formatEuro(nettokaltmieteVor33Monaten)} betrug. Dein Vermieter dürfte
          die Miete also innerhalb von 3 Jahren maximal auf{" "}
          {formatEuro(nettokaltmieteVor33Monaten * 1.15)} erhöhen. Da deine
          aktuelle Nettokaltmiete mit {formatEuro(ausgangsmiete)} bereits die
          Kappunggsgrenze überschreitet, ist diese Mieterhöhung wahrscheinlich
          nicht rechtswidrig.
        </p>
      </div>

      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <div className="space-y-3 text-neutral-faded mb-6">
          <p>
            Du musst der Mieterhöhung nicht zustimmen. Wir empfehlen dir deinen
            Vermieter auf diese Tatsache hinzuweisen.
          </p>
          <p>Dies kannst du ganz formfrei auf dem Wege deiner Wahl tun.</p>
        </div>
      </div>
    </>
  );
}
