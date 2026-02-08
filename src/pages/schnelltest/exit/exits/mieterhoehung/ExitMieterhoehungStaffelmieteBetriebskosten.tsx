//import { useLocalizeField } from "~/l10n";

export function ExitMieterhoehungStaffelmieteBetriebskosten() {
  //const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">
        Die Mieterhöhung ist wahrscheinlich zulässig.
      </h2>
      <div className="space-y-3 text-neutral-faded mb-6">
        <p>
          Du hast angegeben, dass in deinem Mietvertrag eine Staffelmiete
          vereinbart ist und dein Vermieter die Mieterhöhung mit gestiegenen
          Betriebskosten begründet.
        </p>
        <p>
          Auch bei einem Staffelmietvertrag dürfen Vermieter die Betriebskosten
          erhöhen, wenn im Mietvertrag eine Betriebskostenpauschale vereinbart
          ist. In diesem Fall erlaubt § 560 BGB, gestiegene Betriebskosten auf
          die Mieter umzulegen. Eine solche Erhöhung ist grundsätzlich
          unabhängig von der vereinbarten Staffelmiete möglich.
        </p>
        <p>
          Wichtig: Sind die Betriebskosten jedoch ungewöhnlich stark gestiegen,
          kann es sinnvoll sein, die Erhöhung genauer prüfen zu lassen. Wie du
          dabei vorgehen kannst, erklären wir in{" "}
          <a className="underline" href="">
            diesem Artikel
          </a>
          .
        </p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <p>Bitte überprüfe zunächst, ob deine Angaben stimmen:</p>
        <ol className="list-outside list-decimal space-y-1.5 ps-8">
          <li className="">
            In deinem Mietvertrag ist eine Betriebskostenpauschale vereinbart
          </li>
          <li>
            Die Mieterhöhung bezieht sich ausdrücklich auf gestiegene
            Betriebskosten
          </li>
          <li>
            Die Erhöhung betrifft nicht die Grundmiete, sondern nur die
            Betriebskosten
          </li>
        </ol>
        <p>Wenn das zutrifft, ist die Mieterhöhung wahrscheinlich rechtens.</p>
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
