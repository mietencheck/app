//import { useLocalizeField } from "~/l10n";

import Disclaimer from "~/pages/schnelltest/partials/Disclaimer";

export function ExitMieterhoehungStaffelmietvertragBetriebskosten() {
  //const l = useLocalizeField();

  return (
    <>
      <h2>Die Mieterhöhung ist wahrscheinlich zulässig.</h2>
      <p>
        Wir haben überprüft, ob deine anstehende Mieterhöhung den gesetzlichen
        Vorschriften entspricht. Du hast angegeben, dass in deinem Mietvertrag
        eine Staffelmiete vereinbart und die Mieterhöhung mit gestiegenen
        Betriebskosten begründet ist.
      </p>
      <p>
        Bestimmte Arten von Mieterhöhungen sind bei Staffelmiete gesetzlich
        ausgeschlossen. Mieterhöhungen wegen gestiegener Betriebskosten gehören
        da jedoch nicht zu. Wenn in deinem Mietvertrag eine
        Betriebskostenpauschale vereinbart ist, darf dein Vermieter gestiegene
        Betriebskosten auf dich umgelegen (§ 560 BGB).
      </p>
      <p>Dies bedeutet, dass die Mieterhöhung wahrscheinlich zulässig ist.</p>
      <p>
        Wichtig: Sind die Betriebskosten ungewöhnlich stark gestiegen, kann es
        sinnvoll sein, die Erhöhung genauer prüfen zu lassen. Wende dich hierzu
        bitte an eine Mietberatung.
      </p>
      <h3>Was nun?</h3>
      <p>Bitte überprüfe zunächst, ob deine folgenden Angaben stimmen:</p>
      <ol>
        <li>
          In deinem Mietvertrag ist eine Betriebskostenpauschale vereinbart.
        </li>
        <li>
          Die Mieterhöhung bezieht sich ausdrücklich nur auf die gestiegene
          Betriebskosten (§ 560 BGB).
        </li>
        <li>
          Die Erhöhung betrifft nicht die Grundmiete, sondern nur die
          Betriebskosten.
        </li>
        <li>Die Betriebskosten sind nicht ungewöhnlich stark gestiegen.</li>
      </ol>
      <p>
        Treffen diese Angaben zu, ist die Mieterhöhung wahrscheinlich zulässig.
      </p>
      <p>
        Wir empfehlen dir, die neue Miethöhe ab dem vereinbarten Zeitpunkt zu
        bezahlen.
      </p>
      <Disclaimer />
    </>
  );
}
