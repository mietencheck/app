import { useFormspark } from "@formspark/use-formspark";
import { Question } from "flow-machine";
import { useState } from "react";
import { DialogTrigger } from "react-aria-components";
import { pick } from "remeda";

import { IconButton, TextArea } from "~/components/ui";
import { useLocaleState, useLocalizeField, useLocalizeString } from "~/l10n";

import { Button } from ".";
import { CloseIcon } from "./Icons/Close";
import { ModalDialog } from "./ModalDialog";

export const FeedbackButton = ({ question }: { question: Question }) => {
  const { locale } = useLocaleState();
  const l = useLocalizeField();
  const lString = useLocalizeString();
  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [submit] = useFormspark({ formId: "wQqxaUVcM" });
  return (
    <DialogTrigger isOpen={isOpen}>
      <Button
        variant="inline"
        className="!font-400 underline"
        onPress={() => setIsOpen(true)}
      >
        {l("not_understand")}
      </Button>
      <ModalDialog className="flex flex-col">
        <header className="border-b border-neutral-subtle px-4 sm:px-6 py-3 flex flex-row justify-between items-center">
          <h2 className="title-16">{l("not_understand")}</h2>
          <IconButton
            size="sm"
            variant="ghost"
            onPress={() => setIsOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </header>
        <div className="flex flex-col p-4 sm:p-6">
          <label htmlFor="reason" className="text-base mb-3">
            Was hast du an der Frage "{lString(question.text)}" nicht
            verstanden?
          </label>
          <TextArea
            id="reason"
            rows={5}
            placeholder="..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="px-4 sm:px-6 py-3 border-t border-neutral-subtle flex flex-row gap-2 justify-between">
          <Button onPress={() => setIsOpen(false)}>Abbrechen</Button>
          <Button
            variant="solid"
            color="primary"
            onPress={() => {
              submit({
                message,
                locale,
                question: pick(question, ["id", "alias", "text"]),
              });
              setIsOpen(false);
            }}
          >
            Absenden
          </Button>
        </div>
      </ModalDialog>
    </DialogTrigger>
  );
};
