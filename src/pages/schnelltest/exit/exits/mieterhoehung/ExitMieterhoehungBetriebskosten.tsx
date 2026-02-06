//import { useLocalizeField } from "~/l10n";

export function ExitMieterhoehungBetriebskosten() {
  //const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">
        Die Mieterhöhung ist wahrscheinlich rechtmäßig.
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Deine Mieterhöhungen wegen der Erhöhung der Betriebskosten können wir
          leider nicht genau überprüfen, weil die Betriebskosten sehr
          individuell sind. Wenn du das Gefühl hast, dass deine Betriebskosten
          sehr stark gestiegen sind, dann lasse dich beim Berliner Mieterverein,
          der Berliner Mietergemeinschaft oder dem Berliner Mietschutzbund
          beraten.
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <p>
          Grundsätzlich müssen sowohl die Vorauszahlung einer
          Betriebskosten-Pauschale, als auch die Nachzahlung von Betriebskosten
          immer sofort gezahlt werden. Nur wenn du das Gefühl hast, deine
          Betriebskosten wurden falsch berechnet, solltest du dich beraten
          lassen.
        </p>
      </div>
    </>
  );
}
