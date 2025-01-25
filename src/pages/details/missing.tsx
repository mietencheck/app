import { Choice, Question } from "flow-machine";
import { useMemo } from "react";

import { ChoiceControl } from "~/form/AnswerControl";
import {
  StepInfoByAlias,
  useAnswers,
  useStarterSteps,
} from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";

import { LabelAndFeedback } from "./AnswerField";
import { MISSING_OPTION_ALIAS, useMissingAnswersInSession } from "./utils";

function useStarterQuestion(alias: keyof StepInfoByAlias) {
  const steps = useStarterSteps();
  const question = useMemo(
    () =>
      steps.find((s) => s.type == "Question" && s.alias == alias) as
        | Question
        | undefined,
    [steps, alias],
  );
  return question;
}

function MissingChoiceField({ alias }: { alias: keyof StepInfoByAlias }) {
  const question = useStarterQuestion(alias);
  const answers = useAnswers();
  if (question?.answer.type != "ChoiceAnswer") return;
  return (
    <LabelAndFeedback question={question}>
      <ChoiceControl
        answer={question.answer as Choice}
        value={
          answers.getWithOptionAlias(question.alias as never) ==
          MISSING_OPTION_ALIAS
            ? ""
            : String(answers.get(question.alias as never))
        }
        options={(question.answer as Choice).options.filter(
          (o) => o.alias !== MISSING_OPTION_ALIAS,
        )}
        onChange={(value) => {
          answers.set(question.alias as never, value);
        }}
      />
    </LabelAndFeedback>
  );
}

export function MissingFieldsPage() {
  const missingAnwersQuestionAliases = useMissingAnswersInSession();
  const l = useLocalizeField();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="heading-24">{l("Fehlende Angaben")}</h2>
      <div className="mb-6 px-4 py-2 bg-amber-2 border-l-2 border-amber-6 text-amber-11">
        {l(
          "Die folgenden Fragen sind notwendig um deine Miete genau zu prüfen, und müssen daher nun vervollständigt werden.",
        )}
      </div>
      {[...missingAnwersQuestionAliases].map((alias) => (
        <MissingChoiceField alias={alias} />
      ))}
    </div>
  );
}
