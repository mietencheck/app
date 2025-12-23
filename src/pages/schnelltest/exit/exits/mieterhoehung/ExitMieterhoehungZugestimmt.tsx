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
          Es ist sehr schwer eine Mieterhöhung rückgängig zu machen, der du ihr
          bereits zugestimmt hast. Das gilt auch, wenn die Erhöhung nicht
          rechtmäßig war und du jetzt eine zu hohe Miete zahlst.
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <p>
          Unter Umständen kann es sich trotzdem lohnen, die Mieterhöhung bei
          einer kostenlosen Mieterberatung überprüfen zu lassen.
        </p>
        <p>
          Wenn du die nächste Mieterhöhung bekommst, lass sie prüfen, bevor du
          zustimmst.
        </p>
      </div>
    </>
  );
}
