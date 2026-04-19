import Disclaimer from "../../partials/Disclaimer";

export function ExitNeubauwohnung() {
  return (
    <>
      <h2>
        Deine Wohnung gilt als eine Neubauwohnung, für welche die
        Mietpreisbremse nicht greift.
      </h2>
      <p>
        Wir überprüfen in diesem Fragebogen, ob die Höhe deiner Miete den
        gesetzlichen Vorschriften der Mietpreisbremse entspricht. Du hast
        angegeben, dass deine Wohnung erst nach 1. Januar 2014 erstmals genutzt
        und vermietet wurde.
      </p>
      <p>
        Damit gilt deine Wohnung leider als eine Neubauwohnung, für welche die
        Gesetze der Mietpreisbremse nicht greifen.
      </p>
      <h3>Was nun?</h3>
      <p>Bitte überprüfe zunächst, ob die folgenden Angaben stimmen:</p>
      <ol>
        <li>
          Deine Wohnung wurde erst nach 1. Januar 2014 erstmals genutzt und
          vermietet.
        </li>
      </ol>
      <p>
        Trifft diese Angaben zu, gilt deine Wohnung als Neubauwohnung und die
        Gesetze der Mietpreisbremse greifen für diese nicht.
      </p>
      <p>
        Dies bedeutet jedoch nicht, dass dein Vermieter die Miete nach belieben
        erhöhen kann. Solltest du in der Zukunft eine Mieterhöhung bekommen,
        überprüfe sie hier auf Mietencheck bevor du ihr zustimmst.
      </p>
      <Disclaimer />
    </>
  );
}
