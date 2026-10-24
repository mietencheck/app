import { describe, expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import { MERKMAL_RESET_ANSWERS } from "~/form/mappings/answer-reset";
import { answersToMerkmalStateMapping } from "~/form/mappings/merkmale";
import { merkmaleDescriptionsByYear } from "~/mietspiegel/merkmale";

import { BASE_ANSWERS, evaluateAnswers, isValidAnswer } from "./flow-paths";
import {
  allScenarios,
  answerAlternatives,
  coverageFor,
  deviationsFor,
  mappingFor,
  ScenarioCoverage,
} from "./merkmal-coverage";
import {
  decisionKey,
  merkmalReviewDecisions,
} from "./merkmal-review-decisions";

const coverages: ScenarioCoverage[] = allScenarios().map(coverageFor);

test("every mapping condition refers to an existing question and answer option", () => {
  const invalid = Object.keys(answersToMerkmalStateMapping).flatMap((merkmal) =>
    answerAlternatives(mappingFor(merkmal)).flatMap((answers) =>
      Object.entries(answers)
        .filter(([alias, value]) => !isValidAnswer(alias, value))
        .map(([alias, value]) => `${merkmal}: ${alias} = ${String(value)}`),
    ),
  );
  expect(invalid).toEqual([]);
});

describe.each(coverages)("$scenario.jahr, $scenario.label", (coverage) => {
  const { scenario, periods } = coverage;

  test("every Merkmal can be marked as present in some construction period", () => {
    const never = coverage.rows
      .filter((row) => !Object.values(row.checkable).some(Boolean))
      .map((row) => row.merkmal);
    expect(never).toEqual([]);
  });

  test.each(periods)(
    "$label: neutral answers mark no Merkmal and reach the result",
    (period) => {
      const evaluation = evaluateAnswers({
        ...BASE_ANSWERS,
        ...MERKMAL_RESET_ANSWERS,
        ...scenario.pinned,
        Baujahr: Math.max(period.from, 1918),
        ...(period.ost === undefined ? {} : { Ost: period.ost }),
      });
      expect(evaluation.lastStep?.type).not.toBe("Exit");
      const states = getMerkmalStates(
        evaluation.answers as FinalAnswers,
        evaluation.visible,
      );
      expect(
        Object.entries(states).filter(([, state]) => state !== "unchecked"),
      ).toEqual([]);
    },
  );
});

test("every deviation from the Mietspiegel text has a review decision", () => {
  const deviations = new Set(
    coverages.flatMap((coverage) =>
      deviationsFor(
        coverage,
        merkmaleDescriptionsByYear[coverage.scenario.jahr],
      ).map((d) => decisionKey(d.jahr, d.merkmal, d.period)),
    ),
  );
  const decided = new Set(Object.keys(merkmalReviewDecisions));
  expect({
    withoutDecision: [...deviations].filter((key) => !decided.has(key)).sort(),
    staleDecision: [...decided].filter((key) => !deviations.has(key)).sort(),
  }).toEqual({ withoutDecision: [], staleDecision: [] });
});
