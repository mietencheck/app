import { useInlineLocale } from "~/l10n";

export function ExitIndexmietvertragVorherigeMieterhoehungAndererGrund() {
  const l = useInlineLocale();

  return (
    <>
      <h2>
        {l({
          de: "Vorherige Mieterhoehung bei Indexmietvertrag (anderer Grund)",
          en: "Previous rent increase in an index-linked contract (other reason)",
        })}
      </h2>
      <div className="space-y-3 text-gray-11">
        <p>
          {l({
            de: "Du hast angegeben, dass eine vorherige Mieterhoehung bei einem Indexmietvertrag aus einem anderen Grund erfolgt ist. Dieser Fall wird aktuell noch nicht automatisch ausgewertet. Bitte lass deinen konkreten Fall rechtlich pruefen.",
            en: "You indicated that a previous rent increase in an index-linked contract happened for another reason. This case is not yet evaluated automatically. Please have your specific case reviewed legally.",
          })}
        </p>
      </div>
    </>
  );
}
