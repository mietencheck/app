import Disclaimer from "../../partials/Disclaimer";

export function ExitNeubauwohnung() {
  return (
    <>
      <h2>Für deine Wohnung gilt die Mietpreisbremse wahrscheinlich nicht.</h2>
      <p>
        Wir haben geprüft, ob die Höhe deiner Miete den gesetzlichen Vorgaben
        der Mietpreisbremse entspricht. Du hast angegeben, dass das deine
        Wohnung nach dem 1. Oktober 2014 gebaut wurde.
      </p>
      <p>
        Für Wohnungen, die nach diesem Datum erstmal genutzt und vermietet
        wurden, gilt die Mietpreisbremse beim Mietbeginn nicht (§ 556f Satz 1
        BGB). Das bedeutet, dass die Höhe deiner Miete bei Vertragsabschluss
        wahrscheinlich zulässig war.
      </p>
      <p>
        Wichtig: Diese Ausnahme gilt nur für die Miethöhe bei Mietbeginn. Bei
        Mieterhöhungen gelten andere Gesetze, die einschränken, wie stark die
        Miete erhöht werden darf.
      </p>
      <h3>Was nun?</h3>
      <p>
        Bitte überprüfe, ob du das Baujahr deiner Wohnung korrekt angegeben
        hast. Wenn dies der Fall ist, können wir dir an dieser Stelle leider
        nicht weiter helfen.
      </p>
      <p>
        Solltest du jedoch in der Zukunft eine Mieterhöhung bekommen, empfehlen
        wir dir sie zu überprüfen bevor du ihr zustimmst.
      </p>
      <Disclaimer />
    </>
  );
}
