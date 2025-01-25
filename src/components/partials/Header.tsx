import { ReactNode, useState } from "react";
import { DialogTrigger } from "react-aria-components";

import { Button, ModalDialog } from "~/components/ui";
import { useLocalizeField } from "~/l10n";
import { SaveSessionModal } from "~/session";

import { LanguageSelect } from "./LanguageSelect";

export function Header({ children }: { children?: ReactNode }) {
  const l = useLocalizeField();
  const [showSessionModal, setShowSessionModal] = useState(false);
  return (
    <header className="sticky top-0 bg-white border-b border-gray-6 shadow print:hidden z-10">
      <div className="container py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <a href="/" className="heading-16">
            {l("project_name")}
          </a>
          <div className="flex gap-3">
            <LanguageSelect />
            <DialogTrigger
              isOpen={showSessionModal}
              onOpenChange={setShowSessionModal}
            >
              <Button color="neutral">
                <span className="hidden sm:block">
                  {l("Fortschritt speichern")}
                </span>
                <span className="sm:hidden">{l("Speichern")}</span>
              </Button>
              <ModalDialog>
                <SaveSessionModal onClose={() => setShowSessionModal(false)} />
              </ModalDialog>
            </DialogTrigger>
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}
