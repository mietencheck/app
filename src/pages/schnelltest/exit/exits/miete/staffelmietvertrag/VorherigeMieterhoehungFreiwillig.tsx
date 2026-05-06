import { useInlineLocale } from "~/l10n";

export function ExitStaffelmietvertragVorherigeMieterhoehungFreiwillig() {
  const l = useInlineLocale();

  return (
    <>
      <h2>
        {l({
          de: "Vorherige Mieterhoehung bei Staffelmietvertrag (freiwillige Zustimmung)",
          en: "Previous rent increase in a graduated-rent contract (voluntary consent)",
        })}
      </h2>
      <div className="space-y-3 text-gray-11">
        <p>
          {l({
            de: "Du hast angegeben, dass eine vorherige Mieterhoehung bei einem Staffelmietvertrag auf freiwilliger Zustimmung beruhte. Dieser Fall wird aktuell noch nicht automatisch ausgewertet. Bitte lass deinen konkreten Fall rechtlich pruefen.",
            en: "You indicated that a previous rent increase in a graduated-rent contract was based on voluntary consent. This case is not yet evaluated automatically. Please have your specific case reviewed legally.",
          })}
        </p>
      </div>
    </>
  );
}
