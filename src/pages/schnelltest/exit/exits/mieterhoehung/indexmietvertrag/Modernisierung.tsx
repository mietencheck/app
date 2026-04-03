//import { useLocalizeField } from "~/l10n";

import Disclaimer from "~/pages/schnelltest/partials/Disclaimer";

export function ExitMieterhoehungIndexmieteModernisierung() {
  //const l = useLocalizeField();

  return (
    <>
      <h2>
        Die Mieterhöhung könnte zulässig sein. Überprüfe die Begründung der
        Mieterhöhung.
      </h2>
      <p>
        Du hast angegeben, dass in deinem Mietvertrag eine Indexmiete vereinbart
        ist. Bei einer Indexmiete richtet sich die Miethöhe grundsätzlich nach
        der Entwicklung des Verbraucherpreisindex. Steigt oder sinkt dieser
        Index, darf der Vermieter die Miete entsprechend anpassen.
      </p>
      <p>
        In der Regel sind Mieterhöhung wegen Modernisierung (§ 559 BGB) bei
        einer Indexmiete nicht erlaubt. Es gibt jedoch Ausnahmefälle: Dazu zählt
        zum Beispiel, wenn der Vermieter zu der Modernisierung gesetzlich
        verpflichtet war oder wenn es um bestimmte Maßnahmen an der
        Heizungsanlage geht.
      </p>
      <p>
        Mehr Informationen hierzu findest du in unserem Artikel{" "}
        <a href="[TODO]">hier</a>.
      </p>
      <h3>Was nun?</h3>
      <p>Bitte überprüfe zunächst, ob die folgenden Angaben stimmen:</p>
      <ol>
        <li>Im Mietvertrag ist eine Indexmiete vereinbart.</li>
        <li>
          Die Mieterhöhung ist mit Modernisierungen oder baulicher Maßnahmen
          begründet (§ 559 BGB).
        </li>
        <li>
          Die Modernisierungen oder baulicher Maßnahmen sind nicht gesetztlich
          angeordnet.
        </li>
        <li>
          Die Mieterhöhung erwähnt nicht den Einbau oder Austausch einer
          Heizanlage (§ 555b Nr.1a).
        </li>
      </ol>
      <p>
        Treffen diese Angaben zu, ist die Mieterhöhung wahrscheinlich unwirksam.
      </p>
      <p>
        Du kannst dich mit diesem Ergebnis an eine Mietberatung wenden oder dem
        Vermieter mitteilen, dass Mieterhöhungen nach § 559 BGB bei einer
        Indexmieten nicht zulässig sind.
      </p>
      <p>
        Wenn du dir unsicher bist oder Fragen hast, wende dich mit dem Ergebnis
        bitte an eine Mietberatung.
      </p>
      <Disclaimer />
    </>
  );
}
