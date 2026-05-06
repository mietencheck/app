import { useInlineLocale } from "~/l10n";

export function ExitIndexmietvertragVorherigeMieterhoehungFreiwillig() {
  const l = useInlineLocale();

  return (
    <>
      <h2>
        {l({
          de: "Vorherige Mieterhoehung bei Indexmietvertrag (freiwillige Zustimmung)",
          en: "Previous rent increase in an index-linked contract (voluntary consent)",
        })}
      </h2>
      <div className="space-y-3 text-gray-11">
        <p>
          {l({
            de: "Du hast angegeben, dass eine vorherige Mieterhoehung bei einem Indexmietvertrag auf freiwilliger Zustimmung beruhte. Dieser Fall wird aktuell noch nicht automatisch ausgewertet. Bitte lass deinen konkreten Fall rechtlich pruefen.",
            en: "You indicated that a previous rent increase in an index-linked contract was based on voluntary consent. This case is not yet evaluated automatically. Please have your specific case reviewed legally.",
          })}
        </p>
      </div>
    </>
  );
}
