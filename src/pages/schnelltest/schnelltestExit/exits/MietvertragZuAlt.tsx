import { useLocalizeField } from "~/l10n";

import { WerdeAktiv } from "../../partials";

export function MietvertragZuAlt() {
  const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-6">{l("Exit MietvertragZuAlt Titel")}</h2>
      <div className="text-neutral-faded mb-6">
        <p>{l("Exit MietvertragZuAlt Text")}</p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">Was nun?</h3>
        <p>
          Auch wenn die Mietpreisbremse für die Wohnung nicht gilt, kannst du
          dich trotzdem für bezahlbare Mieten einsetzen.
        </p>
      </div>
      <WerdeAktiv />
    </>
  );
}
