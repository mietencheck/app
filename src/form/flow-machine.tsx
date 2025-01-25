import {
  AnswersRecord,
  AnswerValueType,
  FlowMachine,
  Steps,
} from "flow-machine";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "usehooks-ts";

import { parseAdresse } from "~/utils";

import { StepInfoByAlias } from "./flow.fm";
import flow from "./flow.fm.json";
import { vertragsdatumToMietspiegelJahrMapping } from "./mappings/vertragsdatum";

export type EstimateAnswers = StepInfoByAlias["Einschätzung"]["state"];
export type FinalAnswers = StepInfoByAlias["Auswertung"]["state"];

const noop = () => {};

export const flowMachine = new FlowMachine<StepInfoByAlias>(flow);

const IS_FRAMED = typeof window !== "undefined" && window.parent !== window;

export const postMessageToFloma = (type: string, rest: object = {}) => {
  if (!IS_FRAMED) return;
  const message = { type: type, ...rest };
  try {
    window.parent.postMessage(message, "https://floma.io");
  } catch {
    //
  }
  try {
    window.parent.postMessage(message, "http://localhost:3264");
  } catch {
    //
  }
};

function usePreviewFlowMachine() {
  const [previewFlow, setPreviewFlow] = useState<typeof flowMachine | null>(
    null,
  );

  useEffect(() => postMessageToFloma("FlowRequest"), []);

  useEffect(() => {
    if (IS_FRAMED) {
      const handleMessage = ({ data }: MessageEvent) => {
        if (data.type == "FlowRoot") {
          setPreviewFlow(new FlowMachine<StepInfoByAlias>(data.value));
        }
      };
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }
  }, []);

  return previewFlow;
}

export function useFlowMachine() {
  const previewFM = usePreviewFlowMachine();
  return previewFM ?? flowMachine;
}

type AnswerMachine = ReturnType<typeof flowMachine.answers>;

function buildLageInfo(answers: AnswerMachine) {
  const vertragsdatum = answers.getWithOptionAlias("Vertragsdatum");
  const mietspieglJahr =
    (vertragsdatum && vertragsdatumToMietspiegelJahrMapping[vertragsdatum]) ||
    undefined;

  const addresse = answers.get("Adresse");
  const lage =
    (addresse && typeof addresse == "string" && parseAdresse(addresse).lage) ||
    null;
  return (mietspieglJahr && lage?.[mietspieglJahr]) ?? null;
}

function buildBaujahr(answers: AnswerMachine) {
  const baujahrSpanne = answers.getWithOptionAlias("Baujahr vor 2002");
  const baujahr = answers.getWithOptionAlias("Baujahr ab 2002");

  if (baujahrSpanne == "2002-") {
    return baujahr;
  } else {
    const constructionYearBoundaries = baujahrSpanne?.split("-");
    return constructionYearBoundaries?.[0] !== ""
      ? constructionYearBoundaries?.[0]
      : constructionYearBoundaries[1];
  }
}

const AnswersContext = React.createContext<AnswerMachine>(
  flowMachine.answers({}),
);

export const useStoredAnswers = () =>
  useLocalStorage<AnswersRecord>("mb-flow", {});

export function AnswersProvider({ children }: { children: React.ReactNode }) {
  const [storedAnswers, setStoredAnswers] = useStoredAnswers();

  const setKV = useCallback(
    (key: string, value: AnswerValueType) => {
      return setStoredAnswers((state) => ({ ...state, [key]: value }));
    },
    [setStoredAnswers],
  );

  const flowMachine = useFlowMachine();

  const bareAnswers = useMemo(
    () => flowMachine.answers(storedAnswers, noop),
    [flowMachine, storedAnswers],
  );

  const answersValue = useMemo(() => {
    const lageInfo = buildLageInfo(bareAnswers);
    const baujahr = buildBaujahr(bareAnswers);
    const value = {
      ...storedAnswers,
      Ost: lageInfo?.ost ?? null,
      Wohnlage: lageInfo?.wohnlage ?? null,
      Baujahr: baujahr || null,
    };
    postMessageToFloma("Answers", { value });
    return flowMachine.answers(value, setKV);
  }, [bareAnswers, flowMachine, setKV, storedAnswers]);
  return (
    <AnswersContext.Provider value={answersValue}>
      {children}
    </AnswersContext.Provider>
  );
}

export function useAnswers() {
  return useContext(AnswersContext);
}

const StepsContext = React.createContext<Steps>([]);
export function StepsProvider({ children }: { children: React.ReactNode }) {
  const answers = useAnswers();
  const flowMachine = useFlowMachine();
  const steps = useMemo(
    () => flowMachine.run(answers.state),
    [answers.state, flowMachine],
  );
  return (
    <StepsContext.Provider value={steps}>{children}</StepsContext.Provider>
  );
}

export const useSteps = () => useContext(StepsContext);

type UngroupedSteps<S extends Steps> = Exclude<S[number], { type: "Group" }>[];
const ungroup = <S extends Steps>(steps: S): UngroupedSteps<S> =>
  steps
    .map((step) => (step.type == "Group" ? ungroup(step.steps) : step))
    .flat(Infinity) as UngroupedSteps<S>;

export function useVisibleQuestionAliases() {
  const steps = useSteps();
  return useMemo(
    () =>
      new Set(
        ungroup(steps)
          .map((s) => (s.type == "Question" ? s.alias : null))
          .filter((s): s is string => Boolean(s)),
      ),
    [steps],
  );
}

export function useSchnelltestSteps() {
  const steps = useSteps();
  return useMemo(() => {
    const schnelltest = steps.find(
      (s) => s.type == "Group" && s.alias == "Schnelltest",
    );
    return schnelltest?.type == "Group" ? ungroup(schnelltest.steps) : [];
  }, [steps]);
}

export function useDetailsSteps() {
  const steps = useSteps();
  return useMemo(() => {
    const details = steps.find(
      (s) => s.type == "Group" && s.alias == "Details",
    );
    return details?.type == "Group" ? details.steps : [];
  }, [steps]);
}
export type MainSteps = ReturnType<typeof useDetailsSteps>;

export * from "./flow.fm";

export function getVisibleQuestionAliases(answers: FinalAnswers) {
  const steps = ungroup(
    flowMachine.run(flowMachine.answers(answers).state as never),
  );
  return new Set(
    steps
      .map((s) => (s.type == "Question" ? s.alias : null))
      .filter((s): s is string => Boolean(s)),
  );
}
