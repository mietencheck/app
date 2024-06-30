import { useState } from "react";
import { DialogTrigger } from "react-aria-components";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "~/components/ui";
import { ModalDialog } from "~/components/ui/ModalDialog";
import { useLocaleState, useLocalizeField } from "~/l10n";
import { SaveSessionModal } from "~/session";
import { formatEuro } from "~/utils";

import { useIsCompleted, useMieteDiff, useWorstBestMiete } from "../utils";
import {
  AuswertungsModal,
  AuswertungTabPanel,
  MerkmalTabPanel,
} from "./AuswertungModal";

export function ResultPage() {
  const { worst: worstMiete, best: bestMiete } = useWorstBestMiete();
  const { worst: worstDiff, best: bestDiff } = useMieteDiff();

  const [showDetails, setShowDetails] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const isCompleted = useIsCompleted();

  const debugginginfo = localStorage.getItem("mb-flow");
  const l = useLocalizeField();
  const { locale } = useLocaleState();

  if (!isCompleted && location.hash !== "#debug") {
    return (
      <>
        <div className="flex flex-col gap-6">
          <h2 className="heading-24">
            {l("Fragebogen nicht vollständig ausgefüllt Titel")}
          </h2>

          <div className="text-neutral-faded">
            {l("Fragebogen nicht vollständig ausgefüllt Text")}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div id="print" className="w-[768px] hidden print:block p-4">
        <div className="mb-12">
          <h2 className="heading-24 mb-4">
            {bestDiff <= 0
              ? l("Leider ist deine Miete im Rahmen des Mietspiegels.")
              : worstDiff == bestDiff
                ? l("Du zahlst X zu viel", {
                    DIFF: formatEuro(Math.max(bestDiff, 0)),
                  })
                : l("Du zahlst zwischen X und Y zu viel", {
                    WORSTDIFF: formatEuro(Math.max(worstDiff, 0)),
                    BESTDIFF: formatEuro(Math.max(bestDiff, 0)),
                  })}
          </h2>

          <p className="text-base text-neutral-faded">
            {worstDiff == bestDiff
              ? l("Ergebnis zulässige Höchstmiete", {
                  MIETE: formatEuro(bestMiete),
                })
              : l("Ergebnis zulässige Höchstmiete zwischen X und Y", {
                  BESTMIETE: formatEuro(bestMiete),
                  WORSTMIETE: formatEuro(worstMiete),
                })}{" "}
            {bestDiff <= 0
              ? l("Ergebnis Mietpreisbremse nicht möglich")
              : l("Ergebnis Mietpreisbremse möglich")}
          </p>
        </div>
        <AuswertungTabPanel />
        <MerkmalTabPanel />
        <div className="mt-12">
          <h2 className="heading-24 mb-6">Entwickler Informationen</h2>
          <p className="text-sm text-neutral-faded">{debugginginfo}</p>
        </div>
      </div>

      <h2 className="heading-24 mb-4">
        {bestDiff <= 0
          ? l("Leider ist deine Miete im Rahmen des Mietspiegels.")
          : worstDiff == bestDiff
            ? l("Du zahlst X zu viel", {
                DIFF: formatEuro(Math.max(bestDiff, 0)),
              })
            : l("Du zahlst zwischen X und Y zu viel", {
                WORSTDIFF: formatEuro(Math.max(worstDiff, 0)),
                BESTDIFF: formatEuro(Math.max(bestDiff, 0)),
              })}
      </h2>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-base-book">{l("Was bedeutet das?")}</h3>
          <p className="text-base text-neutral-faded">
            {worstDiff == bestDiff
              ? l("Ergebnis zulässige Höchstmiete", {
                  MIETE: formatEuro(bestMiete),
                })
              : l("Ergebnis zulässige Höchstmiete zwischen X und Y", {
                  BESTMIETE: formatEuro(bestMiete),
                  WORSTMIETE: formatEuro(worstMiete),
                })}{" "}
            {bestDiff <= 0
              ? l("Ergebnis Mietpreisbremse nicht möglich")
              : l("Ergebnis Mietpreisbremse möglich")}
          </p>
          <p className="text-base text-neutral-faded mb-4">
            {l("Ergebnis Auswertung im Detail ansehen")}
          </p>
          <div className="flex flex-wrap gap-3">
            <DialogTrigger isOpen={showDetails} onOpenChange={setShowDetails}>
              <Button size="sm" className="w-fit">
                {l("Auswertung ansehen")}
              </Button>
              <ModalDialog>
                <AuswertungsModal onClose={() => setShowDetails(false)} />
              </ModalDialog>
            </DialogTrigger>
            <Button
              color="neutral"
              size="sm"
              className="w-fit"
              onPress={() => {
                const element = document.getElementById("print");
                const clonedElement = element?.cloneNode(true) as HTMLElement;
                clonedElement.style.display = "block";
                // @ts-expect-error missing types for html2pdf.js
                import("html2pdf.js").then(({ default: html2pdf }) => {
                  const options = {
                    margin: 2,
                    filename: "Mietencheck Auswertung.pdf",
                  };
                  html2pdf().set(options).from(clonedElement).save();
                });
              }}
            >
              {l("Auswertung als PDF herunterladen")}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-base-book">
            {l("Speicher dein Ergebnis Titel")}
          </h3>
          <p className="text-base text-neutral-faded">
            {l("Speicher dein Ergebnis Text 1")}
          </p>
          <p className="text-base text-neutral-faded mb-4">
            {l("Speicher dein Ergebnis Text 2")}
          </p>
          <DialogTrigger
            isOpen={showSessionModal}
            onOpenChange={setShowSessionModal}
          >
            <Button color="primary" variant="solid" size="sm" className="w-fit">
              {l("Ergebnis speichern")}
            </Button>
            <ModalDialog>
              <SaveSessionModal onClose={() => setShowSessionModal(false)} />
            </ModalDialog>
          </DialogTrigger>
        </div>
      </div>

      <hr className="my-8" />
      {bestDiff > 0 && (
        <>
          <div>
            <h2 className="heading-20 mb-4">{l("Was kann ich jetzt tun?")}</h2>
            <p className="text-base text-neutral-faded mb-8">
              {l(
                "Du kannst dich gegen deine zu hohe Miete wehren! Damit sparst du nicht nur jeden Monat Geld, sondern tust auch etwas gegen steigende Mieten in unserer Stadt!",
              )}
            </p>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  {l("Beratung durch Mieterverein Titel")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-neutral-faded">
                    <p>{l("Beratung durch Mieterverein Text 1")}</p>
                    <p>{l("Beratung durch Mieterverein Text 2")}</p>
                    <p>{l("Beratung durch Mieterverein Text 3")}</p>
                    <p>{l("Beratung durch Mieterverein Text 4")}</p>
                  </div>
                  <a
                    className="block text-base-book underline mt-4 text-neutral"
                    href={
                      locale == "de"
                        ? "https://blog.mietencheck.de/de/2024-05-28-kostenlose-beratung-beim-berliner-mieterverein-oder-einer-anderen-mieterinnenvereinigung/"
                        : "https://blog.mietencheck.de/en/2024-05-28-kostenlose-beratung-beim-berliner-mieterverein-oder-einer-anderen-mieterinnenvereinigung/"
                    }
                    target="_blank"
                  >
                    {l("Mehr Informationen")}
                  </a>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  {l("Beratung durch Bezirke Titel")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-neutral-faded">
                    <p>{l("Beratung durch Bezirke Text 1")}</p>
                    <p>{l("Beratung durch Bezirke Text 2")}</p>
                    <p>{l("Beratung durch Bezirke Text 3")}</p>
                  </div>
                  <a
                    className="block text-base-book underline mt-4 text-neutral"
                    href={
                      locale == "de"
                        ? "https://blog.mietencheck.de/de/2024-05-28-kostenlose-beratung-bei-einem-berliner-bezirke/"
                        : "https://blog.mietencheck.de/en/2024-05-30-berlin-districts-free-tenant-counselling/"
                    }
                    target="_blank"
                  >
                    {l("Mehr Informationen")}
                  </a>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  {l("Beratung durch Rechtsanwalt Titel")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-neutral-faded">
                    <p>{l("Beratung durch Rechtsanwalt Text 1")}</p>
                    <p>{l("Beratung durch Rechtsanwalt Text 2")}</p>
                    <p>{l("Beratung durch Rechtsanwalt Text 3")}</p>
                  </div>
                  <a
                    className="block text-base-book underline mt-4 text-neutral"
                    href={
                      locale == "de"
                        ? "https://blog.mietencheck.de/de/2024-05-28-kostenpflichtige-beratung-durch-rechtsanwaltin/"
                        : "https://blog.mietencheck.de/en/2024-05-30-getting-a-lawyer-on-board/"
                    }
                    target="_blank"
                  >
                    {l("Mehr Informationen")}
                  </a>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  {l("Beratung durch Drittanbieter Titel")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-neutral-faded">
                    <p>{l("Beratung durch Drittanbieter Text 1")}</p>
                    <p>{l("Beratung durch Drittanbieter Text 2")}</p>
                    <p>{l("Beratung durch Drittanbieter Text 3")}</p>
                    <p>{l("Beratung durch Drittanbieter Text 4")}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <hr className="my-8" />
        </>
      )}

      <div>
        <h2 className="heading-20 mb-4">
          {l("Wie kann ich mich für bezahlbare Mieten einsetzen?")}
        </h2>
        <p className="text-base text-neutral-faded mb-8">
          {l(
            "Egal, ob du dich entscheidest, gegen deine zu hohe Miete vorzugehen oder nicht - du bist nicht alleine! Wir sind stärker, wenn wir uns zusammentun:",
          )}
        </p>

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
              <p className="text-neutral-faded mb-2">
                {l("Engagiere dich Text")}
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
                {l("Mehr zu Deutsche Wohnen & Co enteignen")}
              </a>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
