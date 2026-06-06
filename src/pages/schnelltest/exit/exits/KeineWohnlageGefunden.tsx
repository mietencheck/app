import { useInlineLocale } from "~/l10n";

export function ExitKeineWohnlageGefunden() {
  const l = useInlineLocale();

  return (
    <>
      <h2 className="heading-24 mb-4">
        {l({
          de: "Leider konnten wir für deine Wohnung keine Wohnlage ermitteln.",
          en: "Unfortunately, we could not determine the location quality (Wohnlage) for your apartment.",
        })}
      </h2>
      <div className="space-y-3">
        <p className="text-gray-11">
          {l({
            de: "Für die von dir angegebene Adresse und den relevanten Mietspiegel-Zeitraum liegen uns keine Wohnlagedaten vor. Ohne diese Angabe können wir leider keine Einschätzung vornehmen.",
            en: "We do not have location quality data for the address and rent index period you provided. Without this information, we unfortunately cannot provide an assessment.",
          })}
        </p>
        <p className="text-gray-11">
          {l({
            de: "Bitte überprüfe deine Angaben. Falls der Fehler bestehen bleibt, empfehlen wir dir, mit einem*r Rechtsanwält*in oder Mietrechtsexperten*in zu sprechen, um dich für deinen konkreten Fall beraten zu lassen.",
            en: "Please verify your answers. If the error remains, we recommend that you speak to a lawyer or tenancy law expert for advice on your specific case.",
          })}
        </p>
      </div>
    </>
  );
}
