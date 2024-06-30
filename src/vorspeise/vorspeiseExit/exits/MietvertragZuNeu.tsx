import { useLocalizeField } from "~/l10n";

export function MietvertragZuNeu() {
  const l = useLocalizeField();

  return (
    <>
      <h2 className="heading-24 mb-4">{l("Exit MietvertragZuNeu Titel")}</h2>
      <p className="text-neutral-faded mb-6">
        {l("Exit MietvertragZuNeu Text")}
      </p>
    </>
  );
}
