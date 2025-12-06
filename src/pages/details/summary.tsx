import { Link } from "@swan-io/chicane";
import { AnswerValueType, Question } from "flow-machine";
import { mapKeys, mapValues, pipe } from "remeda";

import { useAnswers, useSchnelltestSteps } from "~/form/flow-machine";
import { questionTextVars } from "~/form/question-text";
import { useLocalizeField, useLocalizeString } from "~/l10n";
import { AppRouter } from "~/router";
import {
  formatAddresse as formatAdresse,
  formatDate,
  formatEuro,
  isKeyOfObject,
  parseAdresse,
  replaceWith,
} from "~/utils";

function AnswerView({
  question: q,
  answerValue,
}: {
  question: Question;
  answerValue: AnswerValueType;
}) {
  const l = useLocalizeString();
  if (q.alias == "Adresse" && typeof answerValue == "string") {
    return formatAdresse(parseAdresse(answerValue));
  }
  if (q.alias == "Kaltmiete" && typeof answerValue == "number") {
    return formatEuro(answerValue);
  }
  if (
    q.alias == "Datum Mieterhöhungsschreiben" &&
    typeof answerValue == "string"
  ) {
    return formatDate(answerValue);
  }
  if (q.answer.type == "ChoiceAnswer") {
    return l(q.answer.options.find((o) => o.id == answerValue)?.text ?? "");
  }
  if (q.answer.type == "MultiChoiceAnswer" && Array.isArray(answerValue)) {
    return q.answer.options
      .filter((o) => answerValue.includes(o.id))
      .map((o) => l(o.text))
      .join(", ");
  }
  return answerValue as string;
}

export function SummaryPage() {
  const answers = useAnswers();
  const steps = useSchnelltestSteps();
  const lField = useLocalizeField();
  const lString = useLocalizeString();

  console.log(steps);
  return (
    <>
      <h1 className="heading-28">{lField("Bisherige Angaben")}</h1>
      <h2 className="heading-20">
        {lField("Bitte überprüfe deine bisherigen Angaben")}
      </h2>
      <div className="border border-gray-7 rounded divide-y divide-gray-7">
        {steps
          .filter(
            (s): s is Question =>
              s.type == "Question" &&
              s.alias != "Ost" &&
              s.alias != "Wohnlage" &&
              s.alias != "Baujahr" &&
              s.alias !=
                "Kappungsgrenze überschritten durch aktuelle Mieterhöhung" &&
              s.alias !=
                "Kappungsgrenze überschritten durch Mietspiegel Mieterhöhungen in letzten 33 Monaten" &&
              s.alias !=
                "Kappungsgrenze überschritten durch Mietspiegel Mieterhöhungen ausgenommen anderer Gründe in letzten 33 Monate",
          )
          .map((q) => (
            <div
              className="flex align-top justify-between p-4 gap-8"
              key={q.id}
            >
              <div>
                <p className="text-base-book mb-1">
                  {replaceWith(
                    lString(q.text),
                    q.alias && isKeyOfObject(q.alias, questionTextVars)
                      ? pipe(
                          questionTextVars[q.alias]!,
                          mapKeys((k) => `$${k}$`),
                          mapValues((f) => f(answers)),
                        )
                      : {},
                  )}
                </p>
                <p className="text-neutral-faded flex flex-row justify-between">
                  <AnswerView
                    question={q}
                    answerValue={
                      (answers.get([q.alias || q.id]) as string) || null
                    }
                  />
                </p>
              </div>
              <Link
                to={`${AppRouter.Schnelltest()}#${q.id}`}
                className="self-start text-purple-11 underline hover:text-purple-11"
              >
                {lField("Ändern")}
              </Link>
            </div>
          ))}
      </div>
    </>
  );
}
