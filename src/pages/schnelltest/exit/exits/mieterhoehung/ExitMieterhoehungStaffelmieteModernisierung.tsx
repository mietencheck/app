//import { useLocalizeField } from "~/l10n";

export function ExitMieterhoehungStaffelmieteModernisierung() {
  //const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">
        Die Mieterhöhung ist wahrscheinlich nicht rechtens.
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Wenn eine Staffelmiete im Mietvertrag vereinbart ist, dann sind
          Mieterhöhungen aufgrund von § 559 nicht rechtmäßig. Nur bei Austausch
          der Heizanlage (§ 559e) könnte die Mieterhöhung rechtmäßig sein.
        </p>
        <p>
          Das heißt: Wenn du dir sicher bist, dass eine Staffelmiete in deinem
          Mietvertrag vereinbart ist, dann darf der Vermieter (der ja eh schon
          immer mehr Geld bekommt, wenn eine neue Staffel anfängt) die Miete
          nicht nach § 559 wegen Modernisierungen oder baulichen Maßnahmen an
          deinem Haus erhöhen. ACHTUNG: Wenn der Vermieter die Heizanlage
          ausgetauscht hat, dann kann er theoretisch gem. § 559e die Miete
          erhöhen. Hier gibt es aber besondere Maßgaben zur Berechnung, da lohnt
          es sich vielleicht sich bei einem der Mietervereine beraten zu lassen.
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <p>
          Wenn in deinem Mietvertrag eine Staffelmiete vereinbart ist, dann
          kannst du Mieterhöhungen nach § 559, die deine Miete wegen
          Modernisierungen oder baulichen Maßnahmen erhöhen wollen, ignorieren.
          Bei einer Mieterhöhung aufgrund der Aufstellung einer neuen Heizanlage
          (§ 559e), kann der Vermieter einen Teil auf die Mieter umlegen.
        </p>
      </div>
    </>
  );
}
