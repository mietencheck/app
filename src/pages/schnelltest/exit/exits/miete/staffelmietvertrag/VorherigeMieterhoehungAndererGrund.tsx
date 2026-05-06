import { useInlineLocale } from "~/l10n";

export function ExitStaffelmietvertragVorherigeMieterhoehungAndererGrund() {
  const l = useInlineLocale();

  return (
    <>
      <h2>
        {l({
          de: "Vorherige Mieterhoehung bei Staffelmietvertrag (anderer Grund)",
          en: "Previous rent increase in a graduated-rent contract (other reason)",
        })}
      </h2>
      <div className="space-y-3 text-gray-11">
        <p>
          {l({
            de: "Du hast angegeben, dass eine vorherige Mieterhoehung bei einem Staffelmietvertrag aus einem anderen Grund erfolgt ist. Dieser Fall wird aktuell noch nicht automatisch ausgewertet. Bitte lass deinen konkreten Fall rechtlich pruefen.",
            en: "You indicated that a previous rent increase in a graduated-rent contract happened for another reason. This case is not yet evaluated automatically. Please have your specific case reviewed legally.",
          })}
        </p>
      </div>
    </>
  );
}
