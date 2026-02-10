//import { useLocalizeField } from "~/l10n";

import Disclaimer from "~/pages/schnelltest/partials/Disclaimer";

export function ExitMieterhoehungBetriebskosten() {
  //const l = useLocalizeField();

  return (
    <>
      <h2>Die Mieterhöhung ist wahrscheinlich zulässig.</h2>
      <p>
        Wenn im Mietvertrag eine Betriebskostenpauschale vereinbart ist, dürfen
        Vermieter gestiegene Betriebskosten generell auf den Mieter umlegen (§
        560 BGB). Die Mieterhöhung ist also wahrscheinlich rechtens.
      </p>
      <p>
        Wichtig: Sind die Betriebskosten ungewöhnlich stark gestiegen, kann es
        sinnvoll sein, die Erhöhung genauer prüfen zu lassen. Wende dich hierzu
        bitte an eine Mietberatung.
      </p>
      <h3>Was nun?</h3>
      <p>Bitte überprüfe zunächst, ob die folgenden Angaben stimmen:</p>
      <ol>
        <li>
          In deinem Mietvertrag ist eine Betriebskostenpauschale vereinbart
        </li>
        <li>
          Die Mieterhöhung bezieht sich ausdrücklich auf gestiegene
          Betriebskosten
        </li>
        <li>
          Die Erhöhung betrifft nicht die Grundmiete, sondern nur die
          Betriebskosten
        </li>
      </ol>
      <p>
        Wenn das zutrifft, ist die Mieterhöhung wahrscheinlich zulässig. Du
        solltest die gefordete Miete also ab dem vereinbarten Zeitpunkt
        bezahlen.
      </p>
      <p>
        Wenn du Fragen hast oder unsicher bist, wende dich mit diesem Ergebnis
        an eine <a href="TODO">Mietberatung</a>.
      </p>
      <Disclaimer />
    </>
  );
}
