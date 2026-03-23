import { FlowMachine, gatherQuestions, Question } from "flow-machine";

import { StepInfoByAlias } from "./flow.fm";
import flow from "./flow.fm.json";

export type EstimateAnswers = StepInfoByAlias["Einschätzung"]["state"];
export type FinalAnswers = StepInfoByAlias["Auswertung"]["state"];

export const flowMachine = new FlowMachine<StepInfoByAlias>(flow);

export const questionsByAlias = new Map(
  gatherQuestions(flow as Parameters<typeof gatherQuestions>[0])
    .filter((question): question is Question & { alias: string } =>
      Boolean(question.alias),
    )
    .map((question) => [question.alias, question]),
);

export type AnswerMachine = ReturnType<typeof flowMachine.answers>;
