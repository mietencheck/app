import { useLocalizeField } from "~/l10n";

export function ExitHaeuser() {
  const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">{l("Exit Häuser Titel")}</h2>
      <div className="space-y-3 text-neutral-faded">
        <p>{l("Exit Häuser Text")}</p>
      </div>
    </>
  );
}
