import { ReactNode, useState } from "react";

import { Button, Dialog, DialogContent, DialogTrigger } from "~/components";
import { useLocalizeField } from "~/l10n";
import { SaveSessionDialog } from "~/session";

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
            <Dialog open={showSessionModal} onOpenChange={setShowSessionModal}>
              <DialogTrigger
                nativeButton={false}
                render={
                  <Button variant="solid">
                    <span className="hidden sm:block">
                      {l("Fortschritt speichern")}
                    </span>
                    <span className="sm:hidden">{l("Speichern")}</span>
                  </Button>
                }
              />
              <DialogContent className="max-w-xl">
                <SaveSessionDialog onClose={() => setShowSessionModal(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}
