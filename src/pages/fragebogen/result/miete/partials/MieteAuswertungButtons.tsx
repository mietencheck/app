import { useState } from "react";

import { Button, Dialog, DialogContent, DialogTrigger } from "~/components";
import { useInlineLocale } from "~/l10n";

import { AuswertungsDialog } from "../../partials/modal";

export function MieteAuswertungButtons() {
  const [showDetails, setShowDetails] = useState(false);
  const l = useInlineLocale();

  return (
    <div className="flex flex-wrap gap-3">
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogTrigger
          nativeButton
          render={
            <Button variant="outline">
              {l({ de: "Auswertung ansehen", en: "View details" })}
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
        type="button"
        onClick={() => {
          const element = document.getElementById("print");
          if (!element) return;

          const host = document.createElement("div");
          host.setAttribute("aria-hidden", "true");
          Object.assign(host.style, {
            position: "fixed",
            left: "-10000px",
            top: "0",
            width: "768px",
          });

          const clone = element.cloneNode(true) as HTMLElement;
          clone.classList.remove("hidden");
          clone.style.display = "block";
          host.appendChild(clone);
          document.body.appendChild(host);

          // @ts-expect-error html2pdf.js ships without TypeScript types
          void import("html2pdf.js")
            .then((mod) => {
              const html2pdf = mod.default ?? mod;
              const options = {
                margin: 10,
                filename: "Mietencheck Auswertung.pdf",
              };
              return html2pdf().set(options).from(clone).save();
            })
            .catch((err) => {
              console.error("PDF export failed:", err);
            })
            .finally(() => {
              host.remove();
            });
        }}
      >
        {l({
          de: "Auswertung als PDF herunterladen",
          en: "Download details as PDF",
        })}
      </Button>
    </div>
  );
}
