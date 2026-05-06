//import { useLocalizeField } from "~/l10n";

export function ExitKappungsgrenzeUeberschritten() {
  //const l = useLocalizeField();
  return (
    <>
      <h2 className="heading-24 mb-4">
        Die Mieterhöhung ist in ihrer Höhe nicht rechtmäßig, da die
        Kappungsgrenze überschritten ist.
      </h2>
      <div className="space-y-3 text-gray-11 mb-6">
        <p>
          Dein Vermieter darf die Miete innerhalb von drei Jahren maximal um 15
          Prozent erhöhen. Dies ist die sogenannte Kappungsgrenze.
        </p>
        <p>
          Du hast angegeben, dass die Kappungsgrenze überschritten ist.
          Dementsprechend ist die Mieterhöhung in ihrer Höhe wahrscheinlich
          nicht rechtmäßig.
        </p>
        <p>
          Wichtig: Die Mieterhöhung ist zwar in ihrer Höhe nicht rechtmäßig, der
          Vemieter aber trotzdem die Miete bis zur Kappungsgrenze erhöhen.
        </p>
      </div>

      <div className="space-y-2 mb-6 text-gray-11">
        <h3 className="text-base-medium text-gray-12">Was nun?</h3>
        <div className="space-y-3 text-gray-11 mb-6">
          <p>
            Du musst der Mieterhöhung nicht zustimmen. Wir empfehlen dir, den
            Vermieter diese Tatsache hinzuweisen.
          </p>
          <p>
            Wir empfehlen dir außerdem, die genaue Kappungsgrenze zu berechnen.
            Wie dies funtkioniert, haben wir in{" "}
            <a className="underline" href="">
              diesem Artikel
            </a>{" "}
            erklärt.
          </p>
        </div>
      </div>
    </>
  );
}
