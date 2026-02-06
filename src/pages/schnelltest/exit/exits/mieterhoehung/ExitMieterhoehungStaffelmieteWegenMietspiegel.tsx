//import { useLocalizeField } from "~/l10n";

export function ExitMieterhoehungStaffelmieteWegenMietspiegel() {
  //const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">
        Die Mieterhöhung ist wahrscheinlich nicht rechtens.
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Wenn eine Staffelmiete im Mietvertrag vereinbart ist, dann sind
          Mieterhöhungen aufgrund von § 558 nicht rechtmäßig.
        </p>
        <p>
          Wenn du dir sicher bist, dass eine Staffelmiete in deinem Mietvertrag
          vereinbart ist, dann darf der Vermieter (der ja eh schon immer mehr
          Geld bekommt, wenn eine neue Staffel anfängt) die Miete nicht nach §
          558 auf die ortsübliche Vergleichsmiete erhöhen.
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <p>
          Wenn in deinem Mietvertrag eine Staffelmiete vereinbart ist, dann
          kannst du Mieterhöhungen nach § 558, die deine Miete auf die
          ortsübliche Vergleichsmiete oder auf den Mietspiegel erhöhen wollen,
          ignorieren.
        </p>
      </div>
    </>
  );
}
