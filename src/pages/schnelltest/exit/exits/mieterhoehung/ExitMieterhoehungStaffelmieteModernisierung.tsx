//import { useLocalizeField } from "~/l10n";

export function ExitMieterhoehungStaffelmieteModernisierung() {
  //const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">
        Die Mieterhöhung ist wahrscheinlich nicht zulässig.
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Du hast angegeben, dass in deinem Mietvertrag eine Staffelmiete
          vereinbart ist. Mieterhöhungen wegen Modernisierungen oder baulicher
          Maßnahmen (§ 559 BGB) sind in Staffelmietverträgen nicht erlaubt. Da
          dein Vermieter die Mieterhöhung genau damit begründet hat, ist sie
          deswegen wahrscheinlich nicht rechtens.
        </p>
        <p>
          Wichtig: Es gibt eine Ausnahme beim Einbau oder Austausch der
          Heizanlage (§ 559e BGB). In diesem Fall kann unter bestimmten
          Voraussetzungen ein Teil der Kosten auf die Miete umgelegt werden.
          Weitere Informationen dazu, findest du{" "}
          <a className="underline" href="">
            hier
          </a>
          .
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <p>Bitte überprüfe zunächst, ob deine Angaben stimmen:</p>
        <ol className="list-outside list-decimal space-y-1.5 ps-8">
          <li className="">Im Mietvertrag ist eine Staffelmiete vereinbart.</li>
          <li>
            Die Mieterhöhung ist mit Modernisierungen oder baulicher Maßnahmen
            begründet (§ 559 BGB).
          </li>
          <li>
            Die Mieterhöhung erwähnt nicht den Einbau oder Austausch einer
            Heizanlage (§ 559e BGB).
          </li>
        </ol>
        <p>
          Wenn dies der Fall ist, dann ist die Mieterhöhung ist wahrscheinlich
          nicht zulässig. Wie du in diesem Fall weiter vorgehen solltest,
          erklären wir in{" "}
          <a className="underline" href="">
            diesem Artikel
          </a>
          .
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Disclamer</h3>
        <p>
          Bitte denk dran, dass dies keine rechtliche Beratung ist. Wenn du
          Fragen oder Unklarheiten hast, wende dich bitte an eine
          Mietrechtsexpertin.
        </p>
        <p>
          Deine Optionen hierfür erklären wir{" "}
          <a className="underline" href="">
            hier
          </a>
          .
        </p>
      </div>
    </>
  );
}
