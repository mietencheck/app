import { useInlineLocale } from "~/l10n";

import Disclaimer from "../../partials/Disclaimer";

export function ExitNeubauwohnung() {
  const l = useInlineLocale();

  return (
    <>
      <h2>
        {l({
          de: "Für deine Wohnung gilt die Mietpreisbremse wahrscheinlich nicht.",
          en: "The Rent Control Act probably does not apply to your apartment.",
        })}
      </h2>
      <p>
        {l({
          de: "Wir haben geprüft, ob die Höhe deiner Miete den gesetzlichen Vorgaben der Mietpreisbremse entspricht. Du hast angegeben, dass das deine Wohnung nach dem 1. Oktober 2014 gebaut wurde.",
          en: "We checked whether your rent amount complies with the legal rules of the Rent Control Act. You indicated that your apartment was built after October 1, 2014.",
        })}
      </p>
      <p>
        {l({
          de: "Für Wohnungen, die nach diesem Datum erstmal genutzt und vermietet wurden, gilt die Mietpreisbremse beim Mietbeginn nicht (§ 556f Satz 1 BGB). Das bedeutet, dass die Höhe deiner Miete bei Vertragsabschluss wahrscheinlich zulässig war.",
          en: "For apartments that were first occupied and rented out after this date, the Rent Control Act does not apply at the start of the tenancy (Section 556f sentence 1 BGB). This means the rent amount at contract signing was probably lawful.",
        })}
      </p>
      <p>
        {l({
          de: "Wichtig: Diese Ausnahme gilt nur für die Miethöhe bei Mietbeginn. Bei Mieterhöhungen gelten andere Gesetze, die einschränken, wie stark die Miete erhöht werden darf.",
          en: "Important: This exception only applies to the rent amount at the start of the tenancy. For rent increases, other laws apply that limit how much rent may be increased.",
        })}
      </p>
      <h3>{l({ de: "Was nun?", en: "What now?" })}</h3>
      <p>
        {l({
          de: "Bitte überprüfe, ob du das Baujahr deiner Wohnung korrekt angegeben hast. Wenn dies der Fall ist, können wir dir an dieser Stelle leider nicht weiter helfen.",
          en: "Please check whether you entered the construction year of your apartment correctly. If that is the case, we unfortunately cannot help further at this point.",
        })}
      </p>
      <p>
        {l({
          de: "Solltest du jedoch in der Zukunft eine Mieterhöhung bekommen, empfehlen wir dir sie zu überprüfen bevor du ihr zustimmst.",
          en: "If you receive a rent increase in the future, we recommend reviewing it before you agree to it.",
        })}
      </p>
      <Disclaimer />
    </>
  );
}
