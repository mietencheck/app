import { useInlineLocale } from "~/l10n";

export function ExitMietvertragVorherigeMieterhoehungFreiwillig() {
  const l = useInlineLocale();

  return (
    <>
      <h2>
        {l({
          de: "Vorherige Mieterhoehung (freiwillige Zustimmung)",
          en: "Previous rent increase (voluntary consent)",
        })}
      </h2>
      <div className="space-y-3 text-gray-11">
        <p>
          {l({
            de: "Du hast angegeben, dass eine vorherige Mieterhoehung auf freiwilliger Zustimmung beruhte. Dieser Fall wird aktuell noch nicht automatisch ausgewertet. Bitte lass deinen konkreten Fall rechtlich pruefen.",
            en: "You indicated that a previous rent increase was based on voluntary consent. This case is not yet evaluated automatically. Please have your specific case reviewed legally.",
          })}
        </p>
      </div>
    </>
  );
}
