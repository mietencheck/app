import { useState } from "react";

import { Button, Dialog, DialogContent, DialogTrigger } from "~/components";
import { useLocalizeField } from "~/l10n";
import { SaveSessionDialog } from "~/session";

import { Header } from "./Header";
import { LanguageSelect } from "./LanguageSelect";

export function FragebogenHeader() {
  const l = useLocalizeField();
  const [showSessionModal, setShowSessionModal] = useState(false);

  return (
    <Header
      actions={
        <>
          <LanguageSelect />
          <Dialog open={showSessionModal} onOpenChange={setShowSessionModal}>
            <DialogTrigger
              nativeButton
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
        </>
      }
    />
  );
}
