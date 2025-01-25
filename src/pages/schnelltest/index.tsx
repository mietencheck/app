import React, { useEffect, useMemo } from "react";
import useLocalStorageState from "use-local-storage-state";

import { Header } from "~/components/partials";
import { useSchnelltestSteps } from "~/form/flow-machine";

import { SchnelltestExit } from "./schnelltestExit";
import { SchnelltestQuestion } from "./schnelltestQuestion";
import { SchnelltestResult } from "./schnelltestResult";

const getHash = () => decodeURIComponent(window.location.hash.replace("#", ""));

export type StepperType = {
  index: number;
  set: React.Dispatch<React.SetStateAction<number>>;
  back: (() => void) | null;
  forward: (() => void) | null;
};

function useStepper(count: number) {
  const [index, setIndex] = useLocalStorageState("preamble-step", {
    defaultValue: 0,
  });
  const back = useMemo(
    () => (index == 0 ? null : () => setIndex((i) => Math.max(i - 1, 0))),
    [setIndex, index],
  );
  const forward = useMemo(
    () => (index == count - 1 ? null : () => setIndex((i) => i + 1)),
    [count, setIndex, index],
  );
  return { index, set: setIndex, back, forward };
}

export function SchnelltestPage() {
  let steps = useSchnelltestSteps();
  steps = useMemo(
    () =>
      steps.filter(
        (s) =>
          !(
            s.type == "Question" &&
            (s.alias == "Ost" || s.alias == "Wohnlage" || s.alias == "Baujahr")
          ),
      ),
    [steps],
  );

  const stepper = useStepper(steps.length);
  const step = steps.at(stepper.index);

  const setStepIndex = stepper.set;
  useEffect(() => {
    const hash = getHash();
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step.id == hash) {
        setStepIndex(i);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
        return;
      }
    }
  }, [setStepIndex, steps]);

  const renderContent = () => {
    if (!step || step.type == "Info") {
      return <SchnelltestResult stepper={stepper} />;
    } else if (step.type == "Exit") {
      return <SchnelltestExit step={step} stepper={stepper} />;
    } else {
      return <SchnelltestQuestion step={step} stepper={stepper} />;
    }
  };

  return (
    <>
      <Header />
      <main className="flex v-screen justify-center items-center">
        <div className="container max-w-[600px] my-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              stepper.forward?.();
            }}
          >
            {renderContent()}
          </form>
        </div>
      </main>
    </>
  );
}
