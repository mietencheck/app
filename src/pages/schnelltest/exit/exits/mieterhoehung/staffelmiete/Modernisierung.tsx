//import { useLocalizeField } from "~/l10n";

import Disclaimer from "~/pages/schnelltest/partials/Disclaimer";

export function ExitMieterhoehungStaffelmieteModernisierung() {
  //const l = useLocalizeField();

  return (
    <>
      <h2>Die Mieterhöhung ist wahrscheinlich nicht zulässig.</h2>
      <p>
        Du hast angegeben, dass in deinem Mietvertrag eine Staffelmiete
        vereinbart ist. Bei dieser Vertragsart sind zukünftige Mieterhöhungen
        bereits im Mietvertrag festgelegt. Es ist also geregelt, wann deine
        Miete um wie viel Euro steigt.
      </p>
      <p>
        Während der vereinbarten Laufzeit der Staffelmiete sind weitere
        Mieterhöhungen nicht erlaubt. Eine Mieterhöhungen wegen Modernisierungen
        oder baulicher Maßnahmen (§ 559 BGB) ist dementsprechend in der Laufzeit
        nicht erlaubt.
      </p>
      <p>
        Wichtig: Es gibt eine Ausnahme beim Einbau oder Austausch der Heizanlage
        (§ 559e BGB). In diesem Fall kann unter bestimmten Voraussetzungen ein
        Teil der Kosten auf die Miete umgelegt werden. Weitere Informationen
        dazu, findest du <a href="[TODO]">hier</a>.
      </p>
      <h3>Was nun?</h3>
      <p>Bitte überprüfe zunächst, ob deine Angaben stimmen:</p>
      <ol>
        <li>Im Mietvertrag ist eine Staffelmiete vereinbart.</li>
        <li>Die vereinbarten Mietstaffeln sind noch nicht ausgelaufen.</li>
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
        Treffen diese Angaben zu, ist die Mieterhöhung wahrscheinlich unwirksam.
      </p>
      <p>
        Du kannst dich mit diesem Ergebnis an eine Mietberatung wenden oder dem
        Vermieter mitteilen, dass Mieterhöhungen nach § 559 BGB bei einer
        laufenden Staffelmiete nicht zulässig sind.
      </p>
      <Disclaimer />
    </>
  );
}
