import { expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";
import { hash } from "~/l10n";

import EN from "../../../public/locales/en.json";
import {
  BASE_ANSWERS,
  contractScenarios,
  evaluateAnswers,
  questionNodeById,
} from "./flow-paths";

const alias = "Bad Wände ausreichend gefließt";
const merkmal = "[Bad-] Bad Wände nicht gefliest";
const scenarios = contractScenarios();

function evaluate(answers: Record<string, unknown>) {
  const result = evaluateAnswers({
    ...BASE_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    Baujahr: 1900,
    ...answers,
  });
  expect(result.lastStep?.type).not.toBe("Exit");
  const question = questionNodeById.get(result.nodeIds.get(alias)!);
  expect(question).toBeDefined();
  return {
    question: question!,
    state: getMerkmalStates(result.answers as FinalAnswers, result.visible)[
      merkmal
    ],
  };
}

// 2015 printed p.19: überwiegend gefliest. 2026 printed p.22:
// gefliest/geschützt in the splash areas; no Baujahr restriction.
test.each(scenarios)(
  "$label: asks the edition's wall criterion",
  ({ jahr, pinned }) => {
    const { question } = evaluate(pinned);
    if (jahr === "2015") {
      expect(question.text).toBe(
        "Sind die Wände in den Badezimmern überwiegend gefliest?",
      );
      expect(question.info).toContain("nicht automatisch");
    } else if (jahr === "2026") {
      expect(question.text).toBe(
        "Sind die Wände in den Badezimmern im Spritzwasserbereich von Waschbecken, Badewanne und/oder Dusche ausreichend gefliest oder anderweitig geschützt?",
      );
    } else {
      expect(question.text).toBe(
        "Sind die Wände in den Badezimmern um Dusche, Badewanne und Waschbecken so gefließt, dass die ungeschützte Wand normalerweise nicht nass wird?",
      );
    }
    expect(question.info?.includes("Gäste-WCs") ?? false).toBe(
      Number(jahr) >= 2024,
    );
  },
);

test.each(
  scenarios.flatMap((scenario) =>
    [1990, 1991, 2009, 2010, 2014].flatMap((baujahr) =>
      [
        { answer: "Ja", expected: "unchecked" },
        { answer: "Nein", expected: "checked" },
        { answer: "Nicht sicher", expected: "maybe" },
      ].map((answer) => ({ ...scenario, baujahr, ...answer })),
    ),
  ),
)(
  "$label, Baujahr $baujahr, $answer: $expected",
  ({ pinned, baujahr, answer, expected }) => {
    expect(
      evaluate({ ...pinned, Baujahr: baujahr, [alias]: answer }).state,
    ).toBe(expected);
  },
);

test("2015: splash-area tiling alone does not establish predominant tiling", () => {
  const { question, state } = evaluate({
    Vertragsdatum: "2015-2016",
    [alias]: "Nein",
  });
  expect(question.info).toContain("Fliesen nur im Spritzwasserbereich");
  expect(state).toBe("checked");
});

test("2026: adequate protection without tiles avoids the negative Merkmal", () => {
  const { question, state } = evaluate({
    Vertragsdatum: ">2026",
    [alias]: "Ja",
  });
  expect(question.text).toContain("oder anderweitig geschützt");
  expect(state).toBe("unchecked");
});

test("unsigned Miete uses the 2026 criterion even with an earlier contract answer", () => {
  const { question, state } = evaluate({
    Unterschrieben: "Nein",
    Vertragsdatum: "2015-2016",
    [alias]: "Nicht sicher",
  });
  expect(question.text).toContain("oder anderweitig geschützt");
  expect(state).toBe("maybe");
});

test.each(scenarios)(
  "$label: wall question and hints have English copy",
  ({ pinned }) => {
    const { question } = evaluate(pinned);
    for (const text of [question.text, question.info].filter(
      Boolean,
    ) as string[]) {
      const key = hash(text);
      const translation = EN.strings[key as keyof typeof EN.strings];
      expect(translation).toBeTruthy();
      expect(translation).not.toContain("[DE]");
      expect(translation).not.toBe(text);
    }
  },
);
