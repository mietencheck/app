import { useInlineLocale } from "~/l10n";

export function ExitMoeblierteWohnung() {
  const l = useInlineLocale();

  return (
    <>
      <h2 className="heading-24 mb-4">
        {l({
          de: "Leider sind möblierte Wohnungen ein Sonderfall, bei dem wir dir nicht weiterhelfen können.",
          en: "Unfortunately, furnished apartments are a special case and we cannot help you with that.",
        })}
      </h2>
      <div className="space-y-3 text-neutral-faded">
        <p>
          {l({
            de: "Leider ist die Rechtsprechung bei möblierten Wohnungen nicht einheitlich. Wir empfehlen dir, deinen Fall mit einem*r Mietrechtsexperten*in zu besprechen.",
            en: "Unfortunately, the case law regarding furnished apartments is not uniform. We recommend that you discuss your case with a tenancy law expert.",
          })}
        </p>
      </div>
    </>
  );
}
