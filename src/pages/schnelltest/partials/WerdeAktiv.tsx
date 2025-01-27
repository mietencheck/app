import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components";
import { useLocaleState, useLocalizeField } from "~/l10n";

export function WerdeAktiv() {
  const l = useLocalizeField();
  const { locale } = useLocaleState();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          {l("Informiere deine Nachbar*innen Titel")}
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-neutral-faded mb-2">
            {l("Informiere deine Nachbar*innen Text 1")}
          </p>
          <p className="text-neutral-faded mb-4">
            {l("Informiere deine Nachbar*innen Text 2")}
          </p>
          <a
            className="underline"
            href={
              locale == "de"
                ? "https://blog.mietencheck.de/de/2024-05-28-was-du-tun-kannst/"
                : "https://blog.mietencheck.de/en/2024-05-28-was-du-tun-kannst/"
            }
            target="_blank"
          >
            {l("Mehr Informationen")}
          </a>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          {l("Schaffe ein Bewusstsein für die Mietenkrise Titel")}
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-neutral-faded mb-2">
            {l("Schaffe ein Bewusstsein für die Mietenkrise Text")}
          </p>
          <a
            className="underline"
            href={
              locale == "de"
                ? "https://blog.mietencheck.de/de/2024-05-28-was-du-tun-kannst/"
                : "https://blog.mietencheck.de/en/2024-05-28-was-du-tun-kannst/"
            }
            target="_blank"
          >
            {l("Teile dein Ergebnis")}
          </a>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>{l("Engagiere dich Titel")}</AccordionTrigger>
        <AccordionContent>
          <p className="text-neutral-faded mb-2">{l("Engagiere dich Text")}</p>
          <a
            className="underline"
            href={
              locale == "de"
                ? "https://blog.mietencheck.de/de/2024-05-28-was-du-tun-kannst/"
                : "https://blog.mietencheck.de/en/2024-05-28-was-du-tun-kannst/"
            }
            target="_blank"
          >
            {l("Mehr zu Deutsche Wohnen & Co enteignen")}
          </a>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
