//import { useLocalizeField } from "~/l10n";

export function ExitMieterhoehungStaffelmieteUeberStaffel() {
  //const l = useLocalizeField();

  return (
    <>
      <h2>Die Mieterhöhung ist wahrscheinlich nicht zulässig.</h2>
      <p>
        Du hast angegeben, dass in deinem Mietvertrag eine Staffelmiete
        vereinbart ist. Das bedeutet: Die Miethöhe darf sich nur zu den
        Zeitpunkten und in der Höhe erhöhen, die im Vertrag festgelegt sind.
      </p>
      <p>
        Die geforderte Mieterhöhung liegt über der vertraglich vereinbarten
        Staffel. Eine höhere Erhöhung ist in diesem Fall nicht erlaubt.
      </p>
      <h3>Was nun?</h3>
      <p>
        Überprüfe noch einmal, ob es sich nicht doch um eine Mieterhöhung
        aufgrund der vereinbarten Staffelmiete handelt. Ein Anhaltspunkt dafür
        kann sein, dass der Vermieter sich auf eine vertraglich vereinbarte
        Mieterhöhung oder die vertraglich vereinbarte neue Staffel beruft. Es
        ist wichtig, dass du grundsätzlich deine Miete erstmal unter Vorbehalt
        bezahlst, wenn der Erhöhungsbetrag mit bereits im Mietvertrag
        vereinbarten Mietsteigerungen übereinstimmt! Zur Zahlung dieser Miethöhe
        bist du dann wegen dem Vertrag erstmal verpflichtet.
      </p>
      <p>
        Wenn du dir sicher bist, dass es sich um eine zusätzliche Mieterhöhung
        zur Staffelmiete nach § 558 oder § 559 handelt, kannst du der
        Mieterhöhung formlos widersprechen. Wenn du dir nicht sicher bist, dann
        lass dich beim Berliner Mieterverein, der Berliner Mietergemeinschaft
        oder Berliner Mieterschutzbund beraten.
      </p>
    </>
  );
}
