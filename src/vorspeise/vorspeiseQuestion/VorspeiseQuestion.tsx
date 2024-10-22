import { Button, Label, LinkButton } from "~/components";
import { DetailsRouter } from "~/details/router";
import { useMieteDiff } from "~/details/utils";
import { AdresseForm } from "~/form/adresse/AdresseForm";
import { AnswerControl, GlossyText } from "~/form/AnswerControl";
import { postMessageToFloma, useAnswers } from "~/form/flow-machine";
import { useLocalizeField, useLocalizeString } from "~/l10n";

import { StepperType } from "..";
import { useEstimatorSeen } from "../utils";

const GlossyLabel = ({
  id,
  alias,
  text,
  children,
}: React.PropsWithChildren<{
  id: string;
  alias: string | null;
  text: string;
}>) => (
  <div className="flex flex-col">
    <Label htmlFor={id} id={`${id}-label`} className="heading-20 sm:heading-22">
      <GlossyText alias={alias} text={text} />
    </Label>
    {children}
  </div>
);

export function VorspeiseQuestion({
  step,
  stepper,
}: {
  step: any;
  stepper: StepperType;
}) {
  const answers = useAnswers();
  const l = useLocalizeField();
  const lString = useLocalizeString();

  const seenEstimator = useEstimatorSeen();
  const { best: bestDiff } = useMieteDiff();
  const showDetailsLinks = seenEstimator && bestDiff > 0;

  return (
    <>
      <h2 className="text-base text-neutral-faded mb-2">
        {l("question")} {stepper.index + 1}
      </h2>
      <GlossyLabel
        key={step.id}
        id={step.id}
        alias={step.alias}
        text={step.text}
      >
        {step.info && (
          <p className="text-neutral-faded mt-3">{lString(step.info)}</p>
        )}
        <div className="mt-6">
          {step.alias == "Adresse" ? (
            <AdresseForm
              id={step.id}
              value={JSON.parse((answers.get("Adresse") as string) || "null")}
              onChange={(value) => {
                answers.setById(step.id, JSON.stringify(value));
                postMessageToFloma("ActiveStepId", { value: step.id });
              }}
            />
          ) : (
            <AnswerControl
              autoFocus
              answer={step.answer}
              value={answers.getById(step.id, step.answer) as never}
              // TODO: duct tape #81
              hiddenOptionAliases={step.id == "4vsma" ? ["Nicht sicher"] : []}
              onChange={(value) => {
                answers.setById(step.id, value);
                postMessageToFloma("ActiveStepId", { value: step.id });
              }}
            />
          )}
        </div>
      </GlossyLabel>
      <div className="flex flex-row flex-wrap justify-center gap-3 mt-10">
        {stepper.back && <Button onPress={stepper.back}>{l("Back")}</Button>}
        <Button
          {...(showDetailsLinks ? {} : { color: "primary", variant: "solid" })}
          type="submit"
        >
          {l("next_question")}
        </Button>
        {showDetailsLinks && (
          <LinkButton
            color="primary"
            variant="solid"
            to={DetailsRouter.Summary()}
          >
            {l("go_to_details")}
          </LinkButton>
        )}
      </div>
    </>
  );
}
