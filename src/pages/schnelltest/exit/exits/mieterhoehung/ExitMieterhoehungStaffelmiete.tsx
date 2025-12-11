//import { useLocalizeField } from "~/l10n";

export function ExitMieterhoehungStaffelmiete() {
  //const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">
        TODO: Du musst leider nochmal neu anfangen. Bitte lies den Text
        unterhalb vollständig.
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Bei einer Staffelmiete gilt jede Mieterhöhung als eine Art
          Neuvermietung gewertet. Um diese zu Überprüfen, musst du den
          Fragenbogen für "Miete für aktuelle oder neue Wohnung" ausfüllen.
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <p>
          Um die Rechtmäßigkeit der Miethöhung zu überprüfen, klicke bitte "Neu
          anfangen" unten und wähle dann "Miete für aktuelle oder neue Wohnung"
          in der ersten Frage aus.
        </p>
        <p>
          Wichtig: Bei der Frage zur Nettokaltmiete gibt nicht deine aktuelle,
          sondern die in der Mieterhöhung geforderte Nettokaltmiete an.
        </p>
      </div>
    </>
  );
}
