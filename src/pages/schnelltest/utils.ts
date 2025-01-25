import { useEffect, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

import { useAnswers, useSchnelltestSteps } from "~/form/flow-machine";

const useEstimatorSeenState = (value = "") =>
  useLocalStorage("estimator-seen-for-answers", value);

function useSchnelltestAnswersHash() {
  const answers = useAnswers();
  const steps = useSchnelltestSteps();
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
  const hash = useSchnelltestAnswersHash();
  const [, setValue] = useEstimatorSeenState(hash);
  useEffect(() => {
    setValue(hash);
  }, [hash, setValue]);
}

export function useEstimatorSeen() {
  const hash = useSchnelltestAnswersHash();
  const [seen] = useEstimatorSeenState();
  return seen === hash;
}
