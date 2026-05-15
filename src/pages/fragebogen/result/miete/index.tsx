import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components";
import { useLocaleState, useLocalizeField } from "~/l10n";
import { SaveSessionDialog } from "~/session";
import { formatEuro } from "~/utils";

import {
  useWorstBestZulaessigeHoechstmiete,
  useWorstBestZulaessigeHoechstmieteDiff,
} from "../../utils";
import {
  AuswertungsDialog,
  AuswertungTabPanel,
  MerkmalTabPanel,
} from "../partials/modal";

export function ResultMiete() {
  const zulaessigeHoechstmiete = useWorstBestZulaessigeHoechstmiete();
  const zulaessigeHoechstmieteDiff = useWorstBestZulaessigeHoechstmieteDiff();

  const [showDetails, setShowDetails] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const l = useLocalizeField();
  const { locale } = useLocaleState();

  if (!zulaessigeHoechstmiete || !zulaessigeHoechstmieteDiff) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <h2 className="heading-24 mb-4">
          Fehler beim Berechnen des Ergebnisses
        </h2>
        <p className="text-gray-11 mb-4">
          Es ist ein Fehler beim Berechnen des Ergebnisses aufgetreten. Bitte
          klick unten auf "Neu anfangen".
        </p>
      </div>
    );
  }

  const {
    worst: worstZulaessigeHoechstmiete,
    best: bestZulaessigeHoechstmiete,
  } = zulaessigeHoechstmiete;
  const { worst: worstDiff, best: bestDiff } = zulaessigeHoechstmieteDiff;

  return (
    <>
      <div id="print" className="w-[768px] hidden print:block p-4">
        <div className="mb-12">
          <h2 className="heading-24 mb-4">
            {worstDiff <= 0
              ? l("Leider ist deine Miete im Rahmen des Mietspiegels.")
              : worstDiff == bestDiff || bestDiff < 0
                ? l("Du zahlst X zu viel", {
                    DIFF: formatEuro(Math.max(worstDiff, 0)),
                  })
                : l("Du zahlst zwischen X und Y zu viel", {
                    WORSTDIFF: formatEuro(Math.max(worstDiff, 0)),
                    BESTDIFF: formatEuro(Math.max(bestDiff, 0)),
                  })}
          </h2>

          <p className="text-base text-gray-11">
            {worstDiff == bestDiff
              ? l("Ergebnis zulässige Höchstmiete", {
                  MIETE: formatEuro(bestZulaessigeHoechstmiete),
                })
              : l("Ergebnis zulässige Höchstmiete zwischen X und Y", {
                  LOWESTMIETE: formatEuro(bestZulaessigeHoechstmiete),
                  HIGHESTMIETE: formatEuro(worstZulaessigeHoechstmiete),
                })}{" "}
            {bestDiff <= 0
              ? l("Ergebnis Mietpreisbremse nicht möglich")
              : l("Ergebnis Mietpreisbremse möglich")}
          </p>
        </div>
        <AuswertungTabPanel />
        <MerkmalTabPanel />
      </div>

      <h2 className="heading-24 mb-4">
        {worstDiff <= 0
          ? l("Leider ist deine Miete im Rahmen des Mietspiegels.")
          : worstDiff == bestDiff || bestDiff < 0
            ? l("Du zahlst X zu viel", {
                DIFF: formatEuro(Math.max(worstDiff, 0)),
              })
            : l("Du zahlst zwischen X und Y zu viel", {
                WORSTDIFF: formatEuro(Math.max(worstDiff, 0)),
                BESTDIFF: formatEuro(Math.max(bestDiff, 0)),
              })}
      </h2>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-base-medium">{l("Was bedeutet das?")}</h3>
          <p className="text-base text-gray-11">
            {worstDiff == bestDiff
              ? l("Ergebnis zulässige Höchstmiete", {
                  MIETE: formatEuro(bestZulaessigeHoechstmiete),
                })
              : l("Ergebnis zulässige Höchstmiete zwischen X und Y", {
                  LOWESTMIETE: formatEuro(bestZulaessigeHoechstmiete),
                  HIGHESTMIETE: formatEuro(worstZulaessigeHoechstmiete),
                })}{" "}
            {bestDiff <= 0
              ? l("Ergebnis Mietpreisbremse nicht möglich")
              : l("Ergebnis Mietpreisbremse möglich")}
          </p>
          <p className="text-base text-gray-11 mb-4">
            {l("Ergebnis Auswertung im Detail ansehen")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogTrigger
                nativeButton
                render={
                  <Button variant="outline" color="gray" type="button">
                    {l("Auswertung ansehen")}
                  </Button>
                }
              />
              <DialogContent className="max-h-[85vh] max-w-2xl overflow-auto">
                <AuswertungsDialog />
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              color="gray"
              onClick={() => {
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
          <h3 className="text-base-medium">
            {l("Speicher dein Ergebnis Titel")}
          </h3>
          <p className="text-base text-gray-11">
            {l("Speicher dein Ergebnis Text 1")}
          </p>
          <p className="text-base text-gray-11 mb-4">
            {l("Speicher dein Ergebnis Text 2")}
          </p>
          <Dialog open={showSessionModal} onOpenChange={setShowSessionModal}>
            <DialogTrigger
              nativeButton
              render={
                <Button className="w-fit">{l("Ergebnis speichern")}</Button>
              }
            />
            <DialogContent className="max-w-xl">
              <SaveSessionDialog onClose={() => setShowSessionModal(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <hr className="border-gray-6 my-8" />
      {worstDiff > 0 && (
        <>
          <div>
            <h2 className="heading-20 mb-4">{l("Was kann ich jetzt tun?")}</h2>
            <p className="text-base text-gray-11 mb-8">
              {l(
                "Du kannst dich gegen deine zu hohe Miete wehren! Damit sparst du nicht nur jeden Monat Geld, sondern tust auch etwas gegen steigende Mieten in unserer Stadt!",
              )}
            </p>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-base-medium">
                  {l("Beratung durch Mieterverein Titel")}
                </AccordionTrigger>
                <AccordionContent className="pt-3 pb-5 pl-7">
                  <div className="space-y-2 text-gray-11">
                    <p>{l("Beratung durch Mieterverein Text 1")}</p>
                    <p>{l("Beratung durch Mieterverein Text 2")}</p>
                    <p>{l("Beratung durch Mieterverein Text 3")}</p>
                    <p>{l("Beratung durch Mieterverein Text 4")}</p>
                  </div>
                  <a
                    className="block text-base underline mt-4 text-gray-12"
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
                <AccordionTrigger className="text-left text-base-medium">
                  {l("Beratung durch Bezirke Titel")}
                </AccordionTrigger>
                <AccordionContent className="pt-3 pb-5 pl-7">
                  <div className="space-y-2 text-gray-11">
                    <p>{l("Beratung durch Bezirke Text 1")}</p>
                    <p>{l("Beratung durch Bezirke Text 2")}</p>
                    <p>{l("Beratung durch Bezirke Text 3")}</p>
                  </div>
                  <a
                    className="block text-base underline mt-4 text-gray-12"
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
                <AccordionTrigger className="text-left text-base-medium">
                  {l("Beratung durch Rechtsanwalt Titel")}
                </AccordionTrigger>
                <AccordionContent className="pt-3 pb-5 pl-7">
                  <div className="space-y-2 text-gray-11">
                    <p>{l("Beratung durch Rechtsanwalt Text 1")}</p>
                    <p>{l("Beratung durch Rechtsanwalt Text 2")}</p>
                    <p>{l("Beratung durch Rechtsanwalt Text 3")}</p>
                  </div>
                  <a
                    className="block text-base underline mt-4 text-gray-12"
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
                <AccordionTrigger className="text-left text-base-medium">
                  {l("Beratung durch Drittanbieter Titel")}
                </AccordionTrigger>
                <AccordionContent className="pt-3 pb-5 pl-7">
                  <div className="space-y-2 text-gray-11">
                    <p>{l("Beratung durch Drittanbieter Text 1")}</p>
                    <p>{l("Beratung durch Drittanbieter Text 2")}</p>
                    <p>{l("Beratung durch Drittanbieter Text 3")}</p>
                    <p>{l("Beratung durch Drittanbieter Text 4")}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </>
      )}
    </>
  );
}
