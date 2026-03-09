import { AnswersRecord, FlowMachine, Steps } from "flow-machine";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { parseAdresse } from "~/utils";

import { StepInfoByAlias } from "./flow.fm";
import flow from "./flow.fm.json";
import {
  HIDDEN_QUESTIONS,
  HIDDEN_QUESTIONS_FOR_MIETERHOEHUNG,
} from "./hidden-questions";
import { vertragsdatumToMietspiegelJahrMapping } from "./mappings/vertragsdatum";

export type AnswerData = AnswersRecord;

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

function buildVertragsdatum(answers: AnswerMachine) {
  const typ = answers.getWithOptionAlias("Typ");

  if (typ == "Mieterhöhung") {
    return ">2024";
  } else {
    const unterschrieben = answers.getWithOptionAlias("Unterschrieben");

    if (unterschrieben == "Nein") {
      return ">2024";
    }
    return answers.getWithOptionAlias("Vertragsdatum");
  }
}

function buildLageInfo(answers: AnswerMachine) {
  const unterschrieben = answers.getWithOptionAlias("Unterschrieben");
  const vertragsdatum = buildVertragsdatum(answers);

  const mietspieglJahr =
    unterschrieben == "Nein"
      ? "2024" // If contract is not signed, use newest Mietspiegel
      : vertragsdatum && vertragsdatumToMietspiegelJahrMapping[vertragsdatum];

  const addresse = answers.get(["Adresse"]);
  const lage =
    (addresse && typeof addresse == "string" && parseAdresse(addresse).lage) ||
    null;
  return (mietspieglJahr && lage?.[mietspieglJahr]) ?? null;
}

function buildBaujahr(answers: AnswerMachine) {
  const baujahrSpanne = answers.getWithOptionAlias("Baujahr vor 1991");
  const baujahr = answers.getWithOptionAlias("Baujahr ab 1991");

  if (baujahrSpanne == "1991-") {
    return baujahr;
  } else {
    const constructionYearBoundaries = baujahrSpanne?.split("-");
    return constructionYearBoundaries?.[0] !== ""
      ? constructionYearBoundaries?.[0]
      : constructionYearBoundaries[1];
  }
}

function buildKappungsgrenzeDurchAktuelleMieterhoehungUeberschritten(
  answers: AnswerMachine,
) {
  const ausgangsmiete = answers.getWithOptionAlias("Ausgangsmiete");
  const geforderteNettokaltmiete = answers.getWithOptionAlias(
    "Geforderte Nettokaltmiete",
  );

  if (!ausgangsmiete || !geforderteNettokaltmiete) {
    return false;
  }

  const nachKappungsgrenzeZulaessigeMiete = Number(ausgangsmiete) * 1.15;

  if (
    Number(nachKappungsgrenzeZulaessigeMiete) >=
    Number(geforderteNettokaltmiete)
  ) {
    return false;
  } else {
    return true;
  }
}

const AnswersContext = React.createContext<AnswerMachine>(
  flowMachine.answers({}),
);

export const useStoredAnswers = () =>
  useLocalStorage<AnswerData>("mb-flow", {});

export function AnswersProvider({ children }: { children: React.ReactNode }) {
  const [storedAnswers, setStoredAnswers] = useStoredAnswers();

  const flowMachine = useFlowMachine();

  const bareAnswers = useMemo(
    () => flowMachine.answers(storedAnswers, noop),
    [flowMachine, storedAnswers],
  );

  const answersValue = useMemo(() => {
    const vertragsdatum = buildVertragsdatum(bareAnswers);
    const lageInfo = buildLageInfo(bareAnswers);
    const baujahr = buildBaujahr(bareAnswers);
    const kappungsgrenzeDurchAktuelleMieterhoehungUeberschritten =
      buildKappungsgrenzeDurchAktuelleMieterhoehungUeberschritten(bareAnswers);

    const value = {
      ...storedAnswers,
      Typ: "Miete",
      Ost: lageInfo?.ost ?? null,
      Wohnlage: lageInfo?.wohnlage ?? null,
      Baujahr: baujahr || null,
      Vertragsdatum: vertragsdatum || null,
      "Kappungsgrenze durch aktuelle Mieterhöhung überschritten":
        kappungsgrenzeDurchAktuelleMieterhoehungUeberschritten || null,
    };
    postMessageToFloma("Answers", { value });
    return flowMachine.answers(value, setStoredAnswers);
  }, [bareAnswers, flowMachine, storedAnswers, setStoredAnswers]);
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

export function useVisibleSchnelltestSteps() {
  const steps = useSchnelltestSteps();
  const answers = useAnswers();

  return useMemo(() => {
    return steps.filter(
      (s) =>
        !(
          s.type === "Question" &&
          s.alias !== null &&
          (new Set(HIDDEN_QUESTIONS).has(s.alias) ||
            (answers.getAliasedState().Typ === "Mieterhöhung" &&
              new Set(HIDDEN_QUESTIONS_FOR_MIETERHOEHUNG).has(s.alias)))
        ),
    );
  }, [steps, answers]);
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
