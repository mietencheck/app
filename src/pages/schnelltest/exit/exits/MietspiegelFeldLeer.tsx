import { useInlineLocale } from "~/l10n";

export function ExitMietspiegelFeldLeer() {
  const l = useInlineLocale();

  return (
    <>
      <h2 className="heading-24 mb-4">
        {l({
          de: "Leider gibt es für deine Wohnung keine Werte in dem Mietspiegel.",
          en: "Unfortunately, there are no values for your apartment in the rent index.",
        })}
      </h2>
      <div className="space-y-3">
        <p className="text-neutral-faded">
          {l({
            de: "Leider gibt es in jedem Berliner Mietspiegel einige Fälle, für welche keine ortsübliche Vergleichsmiete angegeben ist. Dies liegt daran, dass nicht genügend Daten vorlagen, um hier eine statistisch sichere ortsübliche Vergleichsmiete zu berechnen.",
            en: "Unfortunately, there are some cases in every Berlin rent index for which no local comparative rent is given. This is because there was not enough data available to calculate a statistically reliable local comparative rent.",
          })}
        </p>
        <p className="text-base-book">
          {l({
            de: "Dies bedeutet jedoch nicht, dass die Mietpreisbremse nicht für deine Wohnung gilt!",
            en: "However, this does not mean that the Rent Control Act (Mietpreisbremse) does not apply to your apartment!",
          })}
        </p>
        <p className="text-neutral-faded">
          {l({
            de: "Wir empfehlen dir, mit einem*r Rechtsanwält*in oder Mietrechtsexperten*in zu sprechen, um dich für deinen konkreten Fall beraten zu lassen.",
            en: "We recommend that you speak to a lawyer or tenancy law expert for advice on your specific case.",
          })}
        </p>
      </div>
    </>
  );
}
