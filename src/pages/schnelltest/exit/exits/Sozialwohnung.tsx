import { useInlineLocale } from "~/l10n";

export function ExitSozialwohnung() {
  const l = useInlineLocale();

  return (
    <>
      <h2 className="heading-24 mb-4">
        {l({
          de: "Leider gilt das Gesetz der Mietpreisbremse nicht für Sozialwohnungen.",
          en: "Unfortunately, the Rent Control Act (Mietpreisbremse) does not apply to social housing.",
        })}
      </h2>
      <div className="space-y-3 text-neutral-faded">
        <p>
          {l({
            de: "Leider können wir dir an dieser Stelle nicht weiter helfen.",
            en: "Unfortunately, we cannot help you any further at this point.",
          })}
        </p>
      </div>
    </>
  );
}
