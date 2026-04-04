import { AnswerData, Question, Steps, ungroup } from "flow-machine";

import { applyDerivedAnswers } from "./flow-machine-derived-answers";
import {
  FinalAnswers,
  flowMachine,
  questionsByAlias,
} from "./flow-machine-runtime";

export interface FlowMachineInputIssue {
  questionAlias: string;
  message: string;
  received: unknown;
}

const findChoiceOption = (question: Question, value: string) =>
  question.answer.type === "ChoiceAnswer" ||
  question.answer.type === "MultiChoiceAnswer"
    ? question.answer.options.find(
        (option) =>
          option.id === value ||
          option.alias === value ||
          option.text === value,
      )
    : undefined;

function normalizeAnswerValue(
  questionAlias: string,
  value: unknown,
  issues: FlowMachineInputIssue[],
) {
  const question = questionsByAlias.get(questionAlias);

  if (!question) {
    issues.push({
      questionAlias,
      message: "Unknown question alias",
      received: value,
    });
    return value;
  }

  switch (question.answer.type) {
    case "ChoiceAnswer": {
      if (typeof value !== "string") {
        issues.push({
          questionAlias,
          message: "Expected a string for choice answers",
          received: value,
        });
        return value;
      }

      return findChoiceOption(question, value)?.id ?? value;
    }
    case "MultiChoiceAnswer": {
      if (!Array.isArray(value)) {
        issues.push({
          questionAlias,
          message: "Expected an array for multi-choice answers",
          received: value,
        });
        return value;
      }

      return value.map((entry) => {
        if (typeof entry !== "string") {
          issues.push({
            questionAlias,
            message: "Expected every multi-choice value to be a string",
            received: entry,
          });
          return entry;
        }

        return findChoiceOption(question, entry)?.id ?? entry;
      });
    }
    case "NumberAnswer":
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }
      issues.push({
        questionAlias,
        message: "Expected a number for number answers",
        received: value,
      });
      return value;
    case "BooleanAnswer":
      if (typeof value === "boolean") {
        return value;
      }
      if (value === "true") {
        return true;
      }
      if (value === "false") {
        return false;
      }
      issues.push({
        questionAlias,
        message: "Expected a boolean for boolean answers",
        received: value,
      });
      return value;
    case "TextAnswer":
      if (typeof value === "string") {
        return value;
      }
      issues.push({
        questionAlias,
        message: "Expected a string for text answers",
        received: value,
      });
      return value;
    default:
      return value;
  }
}

function serializeAnswerValue(questionAlias: string, value: unknown): unknown {
  const question = questionsByAlias.get(questionAlias);

  if (!question) {
    return value;
  }

  if (question.answer.type === "ChoiceAnswer" && typeof value === "string") {
    const option = question.answer.options.find((entry) => entry.id === value);
    return option?.alias || option?.text || value;
  }

  if (question.answer.type === "MultiChoiceAnswer" && Array.isArray(value)) {
    const options = question.answer.options;
    return value.map((entry) => {
      if (typeof entry !== "string") {
        return entry;
      }

      const option = options.find((candidate) => candidate.id === entry);
      return option?.alias || option?.text || entry;
    });
  }

  return value;
}

export function normalizeFlowMachineInput(
  submittedAnswers: Record<string, unknown>,
) {
  const issues: FlowMachineInputIssue[] = [];

  const state = Object.fromEntries(
    Object.entries(submittedAnswers).map(([questionAlias, value]) => [
      questionAlias,
      normalizeAnswerValue(questionAlias, value, issues),
    ]),
  ) as AnswerData;

  return { state, issues };
}

export function serializeFlowMachineState(state: AnswerData) {
  return Object.fromEntries(
    Object.entries(state).map(([questionAlias, value]) => [
      questionAlias,
      serializeAnswerValue(questionAlias, value),
    ]),
  );
}

function getVisibleQuestionAliasesFromSteps(steps: Steps) {
  const flatSteps = ungroup(steps);

  return new Set(
    flatSteps
      .map((step) => (step.type == "Question" ? step.alias : null))
      .filter((alias): alias is string => Boolean(alias)),
  );
}

export function getVisibleQuestionAliases(answers: FinalAnswers) {
  return getVisibleQuestionAliasesFromSteps(
    flowMachine.run(flowMachine.answers(answers as AnswerData).state),
  );
}

export function evaluateFlowMachine(submittedAnswers: Record<string, unknown>) {
  const { state: normalizedState, issues } =
    normalizeFlowMachineInput(submittedAnswers);
  const derivedState = applyDerivedAnswers(normalizedState);
  const steps = flowMachine.run(derivedState);

  return {
    answers: serializeFlowMachineState(derivedState),
    visibleQuestionAliases: Array.from(
      getVisibleQuestionAliasesFromSteps(steps),
    ),
    steps,
    issues,
  };
}
