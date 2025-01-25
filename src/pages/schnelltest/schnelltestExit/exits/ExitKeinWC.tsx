import { useLocalizeField } from "~/l10n";

export function ExitKeinWC() {
  const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">{l("Exit Kein WC Titel")}</h2>
      <div className="space-y-3 text-neutral-faded">
        <p>{l("Exit Kein WC Text")}</p>
      </div>
    </>
  );
}
