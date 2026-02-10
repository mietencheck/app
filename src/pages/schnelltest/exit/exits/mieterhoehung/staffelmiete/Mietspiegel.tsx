//import { useLocalizeField } from "~/l10n";

import Disclaimer from "~/pages/schnelltest/partials/Disclaimer";

export function ExitMieterhoehungStaffelmieteWegenMietspiegel() {
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
        Während der vereinbarten Laufzeit des Staffelmietve sind weitere
        Mieterhöhungen nicht erlaubt. Eine Mieterhöhung mit Bezug auf den
        Mietspiegel oder Vergleichsmieten (§ 558 BGB) ist dementsprechend in der
        Laufzeit nicht erlaubt.
      </p>
      <h3>Was nun?</h3>
      <p>Bitte überprüfe zunächst, ob die folgenden Angaben stimmen:</p>
      <ol>
        <li>Im Mietvertrag ist eine Staffelmiete vereinbart.</li>
        <li>Die vereinbarten Mietstaffeln sind noch nicht ausgelaufen.</li>
        <li>
          Die aktuelle Mieterhöhung wird mit dem Mietspiegel, Vergleichsmieten
          oder § 558 BGB begründet.
        </li>
      </ol>
      <p>
        Treffen diese Angaben zu, ist die Mieterhöhung wahrscheinlich unwirksam.
      </p>
      <p>
        Du kannst dich mit diesem Ergebnis an eine Mietberatung wenden oder dem
        Vermieter mitteilen, dass Mieterhöhungen nach § 558 BGB bei einer
        laufenden Staffelmiete nicht zulässig sind.
      </p>
      <Disclaimer />
    </>
  );
}
