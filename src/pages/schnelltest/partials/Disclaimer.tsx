import { useInlineLocale } from "~/l10n";

export default function Disclaimer() {
  const l = useInlineLocale();

  return (
    <>
      <h3>{l({ de: "Disclaimer", en: "Disclaimer" })}</h3>
      <p>
        {l({
          de: "Dieses Ergebnis basiert auf deinen Angaben und ersetzt keine rechtliche Beratung. Im Einzelfall kann die rechtliche Bewertung anders ausfallen.",
          en: "This result is based on your information and does not replace legal advice. In individual cases, the legal assessment may differ.",
        })}
      </p>
      <p>
        {l({
          de: "Im Zweifel wende dich bitte an eine ",
          en: "If in doubt, please contact a ",
        })}
        <a href="https://mietencheck.de/de/blog" target="_blank">
          {l({ de: "Mietberatung", en: "tenant advisory service" })}
        </a>
        .
      </p>
    </>
  );
}
