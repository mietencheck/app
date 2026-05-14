import { useFormspark } from "@formspark/use-formspark";
import { Question } from "flow-machine";
import { useState } from "react";
import { pick } from "remeda";

import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  TextArea,
} from "~/components";
import { useLocaleState, useLocalizeField, useLocalizeString } from "~/l10n";

export const FeedbackButton = ({ question }: { question: Question }) => {
  const { locale } = useLocaleState();
  const l = useLocalizeField();
  const lString = useLocalizeString();
  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [submit] = useFormspark({ formId: "wQqxaUVcM" });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button
            variant="link"
            color="gray"
            type="button"
            className="decoration-1 font-normal"
          >
            {l("not_understand")}
          </Button>
        }
      />
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{l("not_understand")}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Label htmlFor="reason">
            Was hast du an der Frage "{lString(question.text)}" nicht
            verstanden?
          </Label>
          <TextArea
            id="reason"
            rows={5}
            placeholder=""
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="light" type="button">
                Abbrechen
              </Button>
            }
          />
          <Button
            variant="solid"
            color="purple"
            type="button"
            onClick={() => {
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
