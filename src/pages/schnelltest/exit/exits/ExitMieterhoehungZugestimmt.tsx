//import { useLocalizeField } from "~/l10n";

export function ExitMieterhoehungZugestimmt() {
  //const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">
        Leider können wir dir nicht weiterhelfen, weil du der Mieterhöhung
        bereits zugestimmt hast.
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          In diesem Falle ist es sehr schwer die Mieterhöhung wieder
          zurückzunehmen, selbst wenn sie nicht rechtmäßig war und du jetzt eine
          überhöhte Miete zahlst.
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <p>
          Unter Umständen kann es sich aber trotzdem lohnen, die Mieterhöhung
          bei einer kostenlosen Mieterberatung überprüfen zu lassen. Spätestens
          wenn du deine nächste Mieterhöhung erhältst, solltest du diese
          überprüfen bevor du ihr zustimmst. Zudem kannst du immer noch deine
          ursprüngliche Miethöhe überprüfen. Die Mieterhöhung bleibt dann zwar
          wirksam, die Basis wird aber vielleicht reduziert.
        </p>
      </div>
    </>
  );
}
