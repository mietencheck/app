import {
  AnswersRecord,
  AnswerValueType,
  FlowMachine,
  Steps,
} from "flow-machine";
import React, { useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

import { parseAdresse } from "~/utils";

import { StepInfoByAlias } from "./flow.fm";
import flow from "./flow.fm.json";
import { MietspiegelJahr, OstWestBaujahr } from "./mietspiegel";

export type EstimateAnswers = StepInfoByAlias["Einschätzung"]["state"];
export type FinalAnswers = StepInfoByAlias["Auswertung"]["state"];

export function getOstWestBaujahr(
  baujahr: EstimateAnswers["Baujahr"],
  ost: boolean,
): OstWestBaujahr | null {
  switch (baujahr) {
    case undefined:
    case "Nicht sicher":
      return null;
    case "1973-1990":
      return ost ? "O:1973-1990" : "W:1973-1990";
    case "2003-2014":
    case ">2014":
      return "2003-2017";
    default:
      return baujahr;
  }
}

export const vertragsDatumToMietspiegelJahr = {
  "<2015": null,
  "2015-2016": "2015",
  "2016-2018": "2017",
  "2018-2020": "2019",
  "2020-2022": "2021",
  "2022-2024": "2023",
  ">2024": null,
} satisfies Record<
  NonNullable<EstimateAnswers["Vertragsdatum"]>,
  MietspiegelJahr | null
>;

export const getMietspiegelJahr = (datum?: EstimateAnswers["Vertragsdatum"]) =>
  datum ? vertragsDatumToMietspiegelJahr[datum] : null;

const noop = () => {};

export const flowMachine = new FlowMachine<StepInfoByAlias>(flow);

type AnswerMachine = ReturnType<typeof flowMachine.answers>;

function getLageInfo(answers: AnswerMachine) {
  const datum = answers.getWithOptionAlias("Vertragsdatum");
  const jahr = (datum && vertragsDatumToMietspiegelJahr[datum]) || null;
  const adressValue = answers.get("Adresse");
  const lage =
    (adressValue &&
      typeof adressValue == "string" &&
      parseAdresse(adressValue).lage) ||
    null;
  return (jahr && lage?.[jahr]) ?? null;
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

  const bareAnswers = useMemo(
    () => flowMachine.answers(storedAnswers, noop),
    [storedAnswers],
  );

  const answersValue = useMemo(() => {
    const lageInfo = getLageInfo(bareAnswers);
    return flowMachine.answers(
      {
        ...storedAnswers,
        Ost: lageInfo?.ost ?? null,
        Wohnlage: lageInfo?.wohnlage ?? null,
      },
      setKV,
    );
  }, [bareAnswers, setKV, storedAnswers]);
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
  const steps = useMemo(() => flowMachine.run(answers.state), [answers.state]);
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

export function useStarterSteps() {
  const steps = useSteps();
  return useMemo(() => {
    const starter = steps.find(
      (s) => s.type == "Group" && s.alias == "Vorspeise",
    );
    return starter?.type == "Group" ? ungroup(starter.steps) : [];
  }, [steps]);
}

export function useMainSteps() {
  const steps = useSteps();
  return useMemo(() => {
    const starter = steps.find(
      (s) => s.type == "Group" && s.alias == "Hauptspeise",
    );
    return starter?.type == "Group" ? starter.steps : [];
  }, [steps]);
}
export type MainSteps = ReturnType<typeof useMainSteps>;

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
