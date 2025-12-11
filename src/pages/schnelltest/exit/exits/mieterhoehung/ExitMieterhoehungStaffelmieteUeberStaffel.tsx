//import { useLocalizeField } from "~/l10n";

export function ExitMieterhoehungStaffelmieteUeberStaffel() {
  //const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">
        TODO: Die Mieterhöhung ist wahrscheinlich teilweise unzulässig{" "}
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Wenn eine Staffelmiete vereinbart ist, darf der Vermieter nicht
          zusätzlich noch die Miete aufgrund des Mietspiegels erhöhen. In diesem
          Falle ist die zusätzliche Mieterhöhung rechtswidrig.
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <p>
          Überprüfe noch einmal, ob es sich nicht doch um eine Mieterhöhung
          aufgrund der vereinbarten Staffelmiete handelt. Ein Anhaltspunkt dafür
          kann sein, dass Vermieter sich auf vertraglich vereinbarte
          Mieterhöhung beruft oder der Erhöhungsbetrag mit bereits im
          Mietvertrag vereinbarten Mietsteigerungen übereinstimmt.
        </p>
        <p>
          Wenn du dir sicher bist, dass es sich um eine zusätzliche Mieterhöhung
          handelt, kannst du sie ignorieren oder der Mieterhöhung formlos
          widersprechen.
        </p>
      </div>
    </>
  );
}
