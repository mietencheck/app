import { useLocalizeField } from "~/l10n";

export function ExitMöbliert() {
  const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">{l("Exit Möbliert Titel")}</h2>
      <div className="space-y-3 text-neutral-faded">
        <p>{l("Exit Möbliert Text")}</p>
      </div>
    </>
  );
}
