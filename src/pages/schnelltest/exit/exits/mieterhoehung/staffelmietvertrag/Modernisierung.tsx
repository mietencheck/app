//import { useLocalizeField } from "~/l10n";

import Disclaimer from "~/pages/schnelltest/partials/Disclaimer";

export function ExitMieterhoehungStaffelmietvertragModernisierung() {
  //const l = useLocalizeField();

  return (
    <>
      <h2>Die Mieterhöhung ist wahrscheinlich nicht zulässig.</h2>
      <p>
        Wir haben überprüft, ob deine anstehende Mieterhöhung den gesetzlichen
        Vorschriften entspricht. Du hast angegeben, dass in deinem Mietvertrag
        eine Staffelmiete vereinbart und die Mieterhöhung mit einer
        Modernisierung begründet ist.
      </p>
      <p>
        Während der vereinbarten Laufzeit einer Staffelmiete sind bestimmte
        Arten von Mieterhöhungen gesetzlich nicht zugelassen. Zu diesen gehören
        auch Mieterhöhung, welche mit Modernisierungen oder baulicher Maßnahmen
        (§ 559 BGB) begründet sind.
      </p>
      <p>
        Das bedeutet, dass die Mieterhöhung wahrscheinlich nicht zulässig ist.
      </p>
      <p>
        Wichtig: Es gibt eine Ausnahme beim Einbau oder Austausch der Heizanlage
        (§ 559e BGB). In diesem Fall kann unter bestimmten Voraussetzungen ein
        Teil der Kosten auf die Miete umgelegt werden. Weitere Informationen
        dazu, findest du <a href="http://localhost:5173/[TODO]">hier</a>.
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
          Die Mieterhöhung ist mit Modernisierungen oder baulicher Maßnahmen
          begründet (§ 559 BGB).
        </li>
        <li>
          Die Mieterhöhung erwähnt nicht den Einbau oder Austausch einer
          Heizanlage (§ 559e BGB).
        </li>
      </ol>
      <p>
        Treffen diese Angaben zu, ist die Mieterhöhung wahrscheinlich nicht
        zulässig.
      </p>
      <p>
        Wir empfehlen dir, dich mit diesem Ergebnis an eine Mietberatung zu
        wenden oder deinem Vermieter mitzuteilen, dass Mieterhöhungen nach § 559
        BGB bei einer laufenden Staffelmiete nicht zulässig sind.
      </p>
      <Disclaimer />
    </>
  );
}
