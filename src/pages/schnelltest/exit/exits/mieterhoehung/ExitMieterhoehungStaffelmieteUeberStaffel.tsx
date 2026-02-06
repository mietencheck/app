//import { useLocalizeField } from "~/l10n";

export function ExitMieterhoehungStaffelmieteUeberStaffel() {
  //const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">
        Die Mieterhöhung ist wahrscheinlich unzulässig
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Wenn eine Staffelmiete vereinbart ist, darf der Vermieter die Miete
          nicht aufgrund des Mietspiegels oder einer Modernisierung erhöhen.
          Mieterhöhungen nach § 558 und § 559 sind also nicht rechtmäßig. Dein
          Vermieter darf aber vielleicht eine Mieterhöhung aufgrund Erhöhung der
          Betriebskosten schicken. In Fragen der Betriebskosten können wir dir
          leider nicht weiterhelfen.
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <p>
          Überprüfe noch einmal, ob es sich nicht doch um eine Mieterhöhung
          aufgrund der vereinbarten Staffelmiete handelt. Ein Anhaltspunkt dafür
          kann sein, dass der Vermieter sich auf eine vertraglich vereinbarte
          Mieterhöhung oder die vertraglich vereinbarte neue Staffel beruft. Es
          ist wichtig, dass du grundsätzlich deine Miete erstmal unter Vorbehalt
          bezahlst, wenn der Erhöhungsbetrag mit bereits im Mietvertrag
          vereinbarten Mietsteigerungen übereinstimmt! Zur Zahlung dieser
          Miethöhe bist du dann wegen dem Vertrag erstmal verpflichtet.
        </p>
        <p>
          Wenn du dir sicher bist, dass es sich um eine zusätzliche Mieterhöhung
          zur Staffelmiete nach § 558 oder § 559 handelt, kannst du der
          Mieterhöhung formlos widersprechen. Wenn du dir nicht sicher bist,
          dann lass dich beim Berliner Mieterverein, der Berliner
          Mietergemeinschaft oder Berliner Mieterschutzbund beraten.
        </p>
      </div>
    </>
  );
}
