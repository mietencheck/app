import { Step } from "flow-machine";

import { Button, FormField, FormLabel, InputControl } from "~/components";
import { AdresseForm } from "~/components/AdresseForm/AdresseForm";
import { postMessageToFloma, useAnswers, useSteps } from "~/form/flow-machine";
import { useLocalizeString } from "~/l10n";

import { useWorstBestZulaessigeHoechstmieteDiff } from "../details/utils";

function Node({ step }: { step: Step }) {
  const l = useLocalizeString();
  const answers = useAnswers();

  switch (step.type) {
    case "Group":
      if (step.category == "Page" && step.alias) {
        return (
          <>
            <h2 className="heading-24">{l(step.alias)}</h2>
            {step.steps?.map((child) => <Node key={child.id} step={child} />)}
          </>
        );
      }
      return step.steps?.map((child) => <Node key={child.id} step={child} />);
    case "Question": {
      if (
        step.alias == "Ost" ||
        step.alias == "Wohnlage" ||
        step.alias == "Baujahr"
      ) {
        return null;
      }

      return (
        <FormField>
          <FormLabel
            htmlFor={step.id}
            alias={step.alias}
            label={step.text}
            className="text-lg-book"
          />
          <div className="mt-4">
            {step.alias == "Adresse" ? (
              <AdresseForm
                id={step.id}
                value={JSON.parse(
                  (answers.get(["Adresse"]) as string) || "null",
                )}
                onChange={(value) => {
                  answers.set([step.alias || step.id], JSON.stringify(value));
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
                  answers.set([step.alias || step.id], step.answer) as never
                }
                onChange={(value) => {
                  answers.set([step.alias || step.id], value);
                  postMessageToFloma("ActiveStepId", { value: step.id });
                }}
              />
            )}
          </div>
        </FormField>
      );
    }
    default:
      return null;
  }
}

export function BeratungPage() {
  const steps = useSteps();
  const l = useLocalizeString();
  const { worst, best } = useWorstBestZulaessigeHoechstmieteDiff();

  return (
    <>
      <header className="sticky top-0 bg-white border-b border-gray-6 shadow print:hidden z-10">
        <div className="py-3 container max-w-screen-lg flex items-center justify-between">
          <a href="/" className="heading-16">
            mietencheck.de
          </a>
          <div className="flex gap-3 items-center">
            <Button color="neutral">{l("Speichern")}</Button>
          </div>
        </div>
      </header>
      <div className="container max-w-screen-lg flex">
        <div className="hidden lg:block sm:w-60 py-6 flex-shrink-0"></div>
        <div className="py-6 sm:py-8 flex flex-grow flex-col gap-12">
          {steps.map((step) => (
            <Node key={step.id} step={step} />
          ))}
        </div>
      </div>
      {worst && (
        <footer className="sticky bottom-0 bg-white border-t border-gray-6 shadow print:hidden z-10">
          <div className="py-3 container max-w-screen-lg flex items-center justify-between">
            <div className="text-base-book"></div>
            <div>
              <span className="text-neutral-faded">Mögliche Ersparnis: </span>
              {best <= 0 ? (
                <span>0€</span>
              ) : worst == best || worst < 0 ? (
                <span>0€ bis {best}€</span>
              ) : (
                <span>
                  {worst}€ bis {best}€
                </span>
              )}
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
