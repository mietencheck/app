import { Step } from "flow-machine";
import React, { useEffect, useMemo } from "react";
import useLocalStorageState from "use-local-storage-state";

import { FragebogenHeader } from "~/components/Header";
import { useVisibleSchnelltestSteps } from "~/form/flow-machine";

import { SchnelltestExit } from "./exit";
import { SchnelltestQuestion } from "./question";
import { SchnelltestResult } from "./result";

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

type NodeType = {
  step: Step | undefined;
  stepper: StepperType;
};

function Node({ step, stepper }: NodeType) {
  if (!step) {
    return <SchnelltestResult stepper={stepper} />;
  }

  switch (step.type) {
    case "Info": {
      return <SchnelltestResult stepper={stepper} />;
    }
    case "Exit": {
      return <SchnelltestExit step={step} stepper={stepper} />;
    }
    case "Question": {
      return <SchnelltestQuestion step={step} stepper={stepper} />;
    }
  }
}

export function SchnelltestPage() {
  const steps = useVisibleSchnelltestSteps();

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

  return (
    <>
      <FragebogenHeader />
      <main className="flex v-screen justify-center items-center">
        <div className="container max-w-[600px] my-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              stepper.forward?.();
            }}
          >
            <Node step={step} stepper={stepper} />
          </form>
        </div>
      </main>
    </>
  );
}
