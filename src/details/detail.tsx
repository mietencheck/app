import { Group, Step } from "flow-machine";
import { useMemo } from "react";

import { useAnswers, useMainSteps } from "~/form/flow-machine";
import { useLocalizeString } from "~/l10n";

import { AnswerField } from "./AnswerField";
import { getSlugForAlias, usePathname } from "./utils";

function NodeView({ step }: { step: Step }) {
  const l = useLocalizeString();
  const answers = useAnswers();
  switch (step.type) {
    case "Question":
      return (
        <AnswerField
          key={step.id}
          question={step}
          value={answers.getById(step.id) as string}
          onChange={(value) => {
            answers.setById(step.id, value);
          }}
        />
      );

    case "Info":
      return (
        <div className="px-4 py-3 bg-amber-2 border-l-2 border-amber-6 text-amber-11">
          {l(step.alias)}
        </div>
      );

    case "Group":
      if (step.category != "Section") return null;
      return (
        <div key={step.alias} className="flex gap-12 flex-col">
          {step.alias && <h2 className="heading-24">{l(step.alias)}</h2>}
          {step.steps?.map((child) => <NodeView key={child.id} step={child} />)}
        </div>
      );

    default:
      return null;
  }
}

export function DetailPage() {
  const mainSteps = useMainSteps();
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
        <NodeView key={step.id} step={step} />
      ))}
    </div>
  );
}
