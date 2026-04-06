//import { useLocalizeField } from "~/l10n";

import { getGeforderteNettokaltmiete, getNettokaltmiete } from "~/form/api";
import { useAnswers, useVisibleQuestionAliases } from "~/form/flow-machine";
import { formatEuro, formatPercent } from "~/utils";

export function ExitKappungsgrenzeDurchAktuelleMieterhoehungUeberschritten() {
  //const l = useLocalizeField();
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();

  const nettokaltmiete =
    getNettokaltmiete(answers, visibleQuestionAliases) || 0;
  const geforderteNettokaltmiete =
    getGeforderteNettokaltmiete(answers, visibleQuestionAliases) || 0;

  return (
    <>
      <h2 className="heading-24 mb-4">
        Die Mieterhöhung ist in ihrer Höhe nicht rechtmäßig, da die
        Kappungsgrenze überschritten wurde.
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Vermieter dürfen die Miete innerhalb von drei Jahren insgesamt um
          maximal 15 Prozent erhöhen. Dies ist die sogenannte Kappungsgrenze.
        </p>
        <p>
          Du hast angegeben, dass der Vermieter deine aktuelle Nettokaltmiete
          von {formatEuro(nettokaltmiete)} auf{" "}
          {formatEuro(geforderteNettokaltmiete)} erhöhen will. Dies entspricht
          einer Steigerung von{" "}
          {formatPercent(geforderteNettokaltmiete / nettokaltmiete - 1)}. Die
          Kappungsgrenze ist somit überschritten.
        </p>
        <p>
          Wichtig: Das bedeutet nicht, dass der Vermieter die Miete generell
          nicht erhöhen darf. [TODO]
        </p>
      </div>

      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <div className="space-y-3 text-neutral-faded mb-6">
          <p>
            Du musst der Mieterhöhung nicht zustimmen. Wir empfehlen dir deinen
            Vermieter auf diese Tatsache hinzuweisen.
          </p>
          <p>[TODO]</p>
        </div>
      </div>
    </>
  );
}
