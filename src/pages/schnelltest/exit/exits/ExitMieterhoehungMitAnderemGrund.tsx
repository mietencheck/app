//import { useLocalizeField } from "~/l10n";

export function ExitMieterhoehungMitAnderemGrund() {
  //const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">
        Leider funktioniert unsere Website nur für Mieterhöhung, die aufgrund
        des Mietspiegels ausgesprochen werden.
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Mieterhöhungen aus anderem Grund, etwa wegen Modernisierung oder
          freiwillige Mieterhöhungen, können wir leider nicht abdecken.
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <p>
          Unter Umständen kann es sich trotzdem lohnen, die Mieterhöhung bei
          einer kostenlosen Mieterberatung überprüfen zu lassen. Denn auch diese
          Mieterhöhungen könnte nicht rechtmäßig sein.
        </p>
      </div>
    </>
  );
}
