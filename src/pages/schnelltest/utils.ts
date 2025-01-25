import { useEffect, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

import { useAnswers, useStarterSteps } from "~/form/flow-machine";

const useEstimatorSeenState = (value = "") =>
  useLocalStorage("estimator-seen-for-answers", value);

function useStarterAnswersHash() {
  const answers = useAnswers();
  const steps = useStarterSteps();
  return useMemo(
    () =>
      JSON.stringify(
        steps
          .filter((s) => s.type == "Question")
          .map((s) => answers.getById(s.id)),
      ),
    [answers, steps],
  );
}

export function useMarkEstimatorSeen() {
  const hash = useStarterAnswersHash();
  const [, setValue] = useEstimatorSeenState(hash);
  useEffect(() => {
    setValue(hash);
  }, [hash, setValue]);
}

export function useEstimatorSeen() {
  const hash = useStarterAnswersHash();
  const [seen] = useEstimatorSeenState();
  return seen === hash;
}
