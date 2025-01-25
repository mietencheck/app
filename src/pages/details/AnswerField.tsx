import { Question } from "flow-machine";

import { Label } from "~/components/ui";
import { FeedbackButton } from "~/components/ui/feedback";
import { AnswerControl, GlossyText } from "~/form/AnswerControl";
import { useLocalizeString } from "~/l10n";

export function LabelAndFeedback({
  question: q,
  children,
}: React.PropsWithChildren<{ question: Question }>) {
  const l = useLocalizeString();
  return (
    <div className="flex flex-col">
      <Label htmlFor={q.id} id={`${q.id}-label`} className="mb-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-lg-book">
            <GlossyText alias={q.alias} text={q.text} />
          </span>
          <span className="text-base text-neutral-faded">
            {q.info ? l(q.info) : ""}
          </span>
        </div>
      </Label>
      {children}
      <div className="mt-4 flex justify-end">
        <FeedbackButton question={q} />
      </div>
    </div>
  );
}

export const AnswerField = ({
  question,
  ...props
}: { question: Question } & Pick<
  React.ComponentProps<typeof AnswerControl>,
  "value" | "onChange"
>) => (
  <LabelAndFeedback question={question}>
    <AnswerControl answer={question.answer} {...props} />
  </LabelAndFeedback>
);
