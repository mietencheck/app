import { useInlineLocale } from "~/l10n";

export function ExitReihenhaus() {
  const l = useInlineLocale();

  return (
    <>
      <h2 className="heading-24 mb-4">
        {l({
          de: "Leider enthält der Berliner Mietspiegel keine Werte für Ein- und Zweifamilienhäuser sowie Reihenhäusern.",
          en: "Unfortunately, the rent index does not contain any values for detached and semi-detached houses or terraced houses.",
        })}
      </h2>
      <div className="space-y-3 text-neutral-faded">
        <p>
          {l({
            de: "Dies bedeutet jedoch nicht, dass die Mietpreisbremse nicht für deine Wohnung gilt. Wir empfehlen dir, mit einem*r Rechtsanwält*in oder Mietrechtsexperten*in deinen konkreten Fall zu besprechen.",
            en: "However, this does not mean that the Rent Control Act (Mietpreisbremse) does not apply to your apartment. We recommend that you discuss your specific case with a lawyer or tenancy law expert.",
          })}
        </p>
      </div>
    </>
  );
}
