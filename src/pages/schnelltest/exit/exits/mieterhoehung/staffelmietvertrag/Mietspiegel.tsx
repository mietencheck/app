//import { useLocalizeField } from "~/l10n";

import Disclaimer from "~/pages/schnelltest/partials/Disclaimer";

export function ExitMieterhoehungStaffelmietvertragMietspiegel() {
  //const l = useLocalizeField();

  return (
    <>
      <h2>Die Mieterhöhung ist wahrscheinlich nicht zulässig.</h2>
      <p>
        Wir haben überprüft, ob deine anstehende Mieterhöhung den gesetzlichen
        Vorschriften entspricht. Du hast angegeben, dass in deinem Mietvertrag
        eine Staffelmiete vereinbart und die Mieterhöhung mit dem Mietspiegel
        begründet ist.
      </p>
      <p>
        Während der vereinbarten Laufzeit einer Staffelmiete sind bestimmte
        Arten von Mieterhöhungen gesetzlich nicht zugelassen. Zu diesen gehören
        auch Mieterhöhung, welche mit den Mietspiegel (§ 558 BGB) begründet
        sind.
      </p>
      <p>
        Die vorliegende Mieterhöhung ist demenstprechend wahrscheinlich nicht
        zulässig.
      </p>
      <h3>Was nun?</h3>
      <p>Bitte überprüfe zunächst, ob deine folgenden Angaben stimmen:</p>
      <ol>
        <li>Im Mietvertrag ist eine Staffelmiete vereinbart.</li>
        <li>
          Du befindest dich noch innerhalb der Laufzeit der vereinbarten
          Mietstaffeln.
        </li>
        <li>
          Die aktuelle Mieterhöhung wird mit dem Mietspiegel, Vergleichsmieten
          oder § 558 BGB begründet.
        </li>
      </ol>
      <p>
        Treffen diese Angaben zu, ist die Mieterhöhung wahrscheinlich nicht
        zulässig.
      </p>
      <p>
        Wir empfehlen dir, dich mit diesem Ergebnis an eine Mietberatung zu
        wenden oder deinem Vermieter mitzuteilen, dass Mieterhöhungen nach § 558
        BGB bei einer laufenden Staffelmiete nicht zulässig sind.
      </p>
      <Disclaimer />
    </>
  );
}
