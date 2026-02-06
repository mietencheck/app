//import { useLocalizeField } from "~/l10n";

export function ExitMieterhoehungStaffelmiete() {
  //const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">
        Um deine Miete zu prüfen musst du leider nochmal neu anfangen. Bitte
        lies den Text unterhalb vollständig.
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Ist eine Staffelmiete im Mietvertrag vereinbart, so gilt jede neue
          Staffel (also der neue Wert, sinngemäß als Beispiel: „Ab 01.05.25 sind
          950 Euro zu zahlen.“) als Vereinbarung einer „quasi“ Neuvermietung.
          Daher gilt diese neue Miethöhe nicht als Mieterhöhung, sondern die
          Mietpreisbremse ist anzuwenden. Ob deine neue Miete nach der
          Mietpreisbremse nicht rechtmäßig ist, kannst du herausfinden, wenn du
          auf den Fragebogen für "Miete für aktuelle oder neue Wohnung" klickst.
          Dort kannst du schauen, ob deine neue Staffel 10% über der
          Vergleichsmiete liegt und damit zu hoch.
        </p>
        <p>
          AUFGEPASST! Deine neue Staffelmiete musst du immer schon von dem
          Zeitpunkt an zahlen, die im Mietvertrag steht! Dein Vermieter muss
          dich nicht darauf hinweisen. Auch wenn die Staffelmiete zu hoch ist,
          solltest du sie unter Vorbehalt weiterzahlen und dich rechtlich
          beraten lassen.
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
