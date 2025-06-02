import {
  Button,
  FormDescription,
  FormField,
  FormLabel,
  LinkButton,
} from "~/components";
import { AdresseForm } from "~/components/AdresseForm/AdresseForm";
import { InputControl } from "~/components/Input/InputControl";
import { postMessageToFloma, useAnswers } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";
import { DetailsRouter } from "~/pages/details/router";
import { useWorstBestZulaessigeHoechstmieteDiff } from "~/pages/details/utils";

import { StepperType } from "..";
import { useEstimatorSeen } from "../utils";

export function SchnelltestQuestion({
  step,
  stepper,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  step: any;
  stepper: StepperType;
}) {
  const answers = useAnswers();
  const l = useLocalizeField();

  const seenEstimator = useEstimatorSeen();
  const { best: bestDiff } = useWorstBestZulaessigeHoechstmieteDiff();
  const showDetailsLinks = seenEstimator && bestDiff > 0;

  return (
    <FormField>
      <h2 className="text-base text-neutral-faded mb-2">
        {l("question")} {stepper.index + 1}
      </h2>
      <FormLabel
        htmlFor={step.id}
        alias={step.alias}
        label={step.text}
        className="heading-20 sm:heading-22"
      />
      {step.info && (
        <FormDescription
          description={step.info}
          className="text-base text-neutral-faded mt-3"
        />
      )}
      <div className="mt-6">
        {step.alias == "Adresse" ? (
          <AdresseForm
            id={step.id}
            value={JSON.parse((answers.get(["Adresse"]) as string) || "null")}
            onChange={(value) => {
              answers.set([step.alias ?? step.id], JSON.stringify(value));
              postMessageToFloma("ActiveStepId", { value: step.id });
            }}
          />
        ) : (
          <InputControl
            autoFocus
            id={step.id}
            alias={step.alias}
            answer={step.answer}
            value={
              (answers.get([step.alias ?? step.id]) ?? step.answer) as never
            }
            onChange={(value) => {
              answers.set([step.alias ?? step.id], value);
              postMessageToFloma("ActiveStepId", { value: step.id });
            }}
          />
        )}
      </div>
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
    </FormField>
  );
}
