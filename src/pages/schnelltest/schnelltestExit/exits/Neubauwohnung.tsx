import { useLocalizeField } from "~/l10n";

import { WerdeAktiv } from "../../partials";

export function Neubauwohnung() {
  const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-6">{l("Exit Neubauwohnung Titel")}</h2>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <p>{l("Exit Neubauwohnung Text 1")}</p>
      </div>
      <div className="space-y-2 mb-6 text-neutral-faded">
        <h3 className="text-base-medium text-neutral">{l("Was nun?")}</h3>
        <p>{l("Was nun? Text")}</p>
      </div>
      <WerdeAktiv />
    </>
  );
}
