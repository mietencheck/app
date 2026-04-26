import { useInlineLocale } from "~/l10n";

import Disclaimer from "../../partials/Disclaimer";

export function ExitWohnungOhneWC() {
  const l = useInlineLocale();

  return (
    <>
      <h2>
        {l({
          de: "Wir können die Höhe der Miete deiner Wohnung leider nicht bewerten.",
          en: "Unfortunately, we cannot assess the rent amount for your apartment.",
        })}
      </h2>
      <p>
        {l({
          de: "Wir haben geprüft, ob die Höhe deiner Miete den gesetzlichen Vorgaben der Mietpreisbremse entspricht. Du hast angegeben, dass es kein WC in deiner Wohnung gibt.",
          en: "We checked whether your rent amount complies with the legal rules of the Rent Control Act. You indicated that there is no toilet in your apartment.",
        })}
      </p>
      <p>
        {l({
          de: "Die zulässige Miethöhe wird in Berlin üblicherweise anhand des Berliner Mietspiegels bestimmt. Dieser enthält jedoch keine Angaben für Wohnungen ohne WC. Wir können die Miethöhe für deine Wohnung daher nicht bewerten.",
          en: "In Berlin, the permissible rent is usually determined using the Berlin rent index. However, it does not include values for apartments without a toilet. We therefore cannot assess the rent amount for your apartment.",
        })}
      </p>
      <p>
        {l({
          de: "Wichtig: Das bedeutet nicht, dass die Mietpreisbremse in deinem Fall nicht gilt. Dein Fall ist lediglich etwas komplizierter.",
          en: "Important: This does not mean that the Rent Control Act does not apply in your case. Your case is simply more complex.",
        })}
      </p>
      <h3>{l({ de: "Was nun?", en: "What now?" })}</h3>
      <p>
        {l({
          de: "Wir empfehlen dir, deinen konkreten Fall rechtlich prüfen zu lassen. Du findest ",
          en: "We recommend having your specific case reviewed legally. You can find ",
        })}
        <a href="[TODO]">{l({ de: "hier", en: "here" })}</a>
        {l({
          de: " einen Artikel, wo du dies am besten tun kannst.",
          en: " an article on the best way to do this.",
        })}
      </p>
      <Disclaimer />
    </>
  );
}
