import { useInlineLocale } from "~/l10n";

export function ExitMietvertragVorherigeMieterhoehungAndererGrund() {
  const l = useInlineLocale();

  return (
    <>
      <h2>
        {l({
          de: "Vorherige Mieterhoehung (anderer Grund)",
          en: "Previous rent increase (other reason)",
        })}
      </h2>
      <div className="space-y-3 text-gray-11">
        <p>
          {l({
            de: "Du hast angegeben, dass eine vorherige Mieterhoehung aus einem anderen Grund erfolgt ist. Dieser Fall wird aktuell noch nicht automatisch ausgewertet. Bitte lass deinen konkreten Fall rechtlich pruefen.",
            en: "You indicated that a previous rent increase happened for another reason. This case is not yet evaluated automatically. Please have your specific case reviewed legally.",
          })}
        </p>
      </div>
    </>
  );
}
