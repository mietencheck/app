//import { useLocalizeField } from "~/l10n";

import Disclaimer from "~/pages/schnelltest/partials/Disclaimer";

export function ExitMieterhoehungIndexmieteWegenMietspiegel() {
  //const l = useLocalizeField();

  return (
    <>
      <h2>Die Mieterhöhung ist wahrscheinlich nicht zulässig.</h2>
      <p>
        Du hast angegeben, dass in deinem Mietvertrag eine Indexmiete vereinbart
        ist. Bei einer Indexmiete richtet sich die Miethöhe grundsätzlich nach
        der Entwicklung des Verbraucherpreisindex. Steigt oder sinkt dieser
        Index, darf der Vermieter die Miete entsprechend anpassen.
      </p>
      <p>
        Bei einer Indexmiete sind andere Arten von Mieterhöhungen
        ausgeschlossen. Eine Mieterhöhung mit Bezug auf den Mietspiegel oder
        Vergleichsmieten (§ 558 BGB) ist dementsprechend nicht erlaubt.
      </p>
      <h3>Was nun?</h3>
      <p>Bitte überprüfe zunächst, ob die folgenden Angaben stimmen:</p>{" "}
      <ol>
        <li>Im Mietvertrag ist eine Indexmiete vereinbart.</li>
        <li>
          Die aktuelle Mieterhöhung wird mit dem Mietspiegel, Vergleichsmieten
          oder § 558 BGB begründet.
        </li>
        <li>
          Die Mieterhöhung bezieht sich nicht auf eine Veränderung des
          Preisindexes.
        </li>
      </ol>
      <p>
        Treffen diese Angaben zu, ist die Mieterhöhung wahrscheinlich unwirksam.
      </p>
      <p>
        Du kannst dich mit diesem Ergebnis an eine Mietberatung wenden oder dem
        Vermieter mitteilen, dass Mieterhöhungen nach § 558 BGB bei einer
        Indexmiete nicht zulässig sind.
      </p>
      <Disclaimer />
    </>
  );
}
