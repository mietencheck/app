import { Group, Step } from "flow-machine";
import { useMemo } from "react";

import {
  FeedbackButton,
  FormDescription,
  FormField,
  FormLabel,
  InputControl,
} from "~/components";
import {
  postMessageToFloma,
  useAnswers,
  useDetailsSteps,
} from "~/form/flow-machine";
import { useLocalizeString } from "~/l10n";

import { getSlugForAlias, usePathname } from "../utils";

export function Node({ step }: { step: Step }) {
  const l = useLocalizeString();
  const answers = useAnswers();

  switch (step.type) {
    case "Question": {
      return (
        <FormField>
          <FormLabel
            htmlFor={step.id}
            alias={step.alias}
            label={step.text}
            className="text-lg"
          />
          {step.info && (
            <FormDescription
              alias={step.alias}
              description={step.info}
              className="text-base text-gray-11 mt-1.5"
            />
          )}
          <div className="mt-4">
            <InputControl
              autoFocus
              id={step.id}
              alias={step.alias}
              answer={step.answer}
              value={answers.get([step.alias || step.id]) as string}
              onChange={(value) => {
                answers.set([step.alias || step.id], value);
                postMessageToFloma("ActiveStepId", { value: step.id });
              }}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <FeedbackButton question={step} />
          </div>
        </FormField>
      );
    }

    case "Info":
      return (
        <div className="px-4 py-3 bg-yellow-2 border-l-2 border-yellow-6 text-yellow-11">
          {l(step.alias)}
        </div>
      );

    case "Group":
      if (step.category != "Section") return null;
      return (
        <div key={step.alias} className="flex gap-12 flex-col">
          {step.alias && <h2 className="heading-24">{l(step.alias)}</h2>}
          {step.steps?.map((child) => (
            <Node key={child.id} step={child} />
          ))}
        </div>
      );

    default:
      return null;
  }
}

export function Questions() {
  const mainSteps = useDetailsSteps();
  const l = useLocalizeString();
  const pathname = usePathname();
  const group = useMemo(
    () =>
      mainSteps
        .filter((s): s is Group => s.type == "Group" && s.category == "Page")
        .flatMap((group) => [group, ...(group.steps ?? [])])
        .find(
          (s) =>
            s.type == "Group" &&
            encodeURIComponent(pathname).endsWith(
              getSlugForAlias(s.alias ?? ""),
            ),
        ) as Group | undefined,
    [mainSteps, pathname],
  );

  if (!group) return null;

  return (
    <div className="flex flex-col gap-12">
      {group.alias && <p className="heading-28">{l(group.alias)}</p>}
      {group.steps.map((step) => (
        <Node key={step.id} step={step} />
      ))}
    </div>
  );
}
