import sha1 from "sync-sha1";
import { expect, test } from "vitest";

import EN from "../../../public/locales/en.json";
import { getMerkmalStates } from "../api";
import { FinalAnswers } from "../flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "../mappings/answer-reset";
import {
  BASE_ANSWERS,
  contractScenarios,
  evaluateAnswers,
  questionNodeById,
} from "./flow-paths";

const alias = "Bad mit Strukturheizkörper";
const merkmal = "[Bad+] Bad hat Strukturheizkörper";
const editions = contractScenarios();

function evaluate(
  pinned: Record<string, unknown>,
  baujahr: number,
  answer: string,
) {
  const result = evaluateAnswers({
    ...BASE_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    ...pinned,
    Baujahr: baujahr,
    [alias]: answer,
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

// Printed p.22 in both editions: <=2001 needs no electric operation;
// from 2002, retain each edition's own qualifier. This does not decide
// whether exclusively electric operation satisfies "zusätzlich" in 2026.
test.each(
  editions.flatMap((edition) =>
    [2000, 2001, 2002, 2009, 2010, 2014].flatMap((baujahr) =>
      (["Ja", "Nein", "Nicht sicher"] as const).map((answer) => ({
        ...edition,
        baujahr,
        answer,
      })),
    ),
  ),
)("$label, Baujahr $baujahr, $answer", ({ jahr, pinned, baujahr, answer }) => {
  const { question, state } = evaluate(pinned, baujahr, answer);
  expect(state).toBe(
    { Ja: "checked", Nein: "unchecked", "Nicht sicher": "maybe" }[answer],
  );
  if (Number(jahr) < 2024) {
    expect(question.text).not.toContain("elektrisch");
  } else if (baujahr <= 2001) {
    expect(question.text).not.toContain("elektrisch");
    expect(question.info).toContain("kein elektrischer Betrieb erforderlich");
  } else if (jahr === "2024") {
    expect(question.text).toContain("elektrisch betreibbaren");
    expect(question.text).not.toContain("zusätzlich");
    expect(question.info).toContain("falls");
  } else {
    expect(question.text).toContain("zusätzlich elektrisch betreibbaren");
    expect(question.info).toContain("ausschließlich elektrisch");
    expect(question.info).toContain("nicht eindeutig geklärt");
    expect(question.info).toContain("Ich bin mir nicht sicher");
  }
  if (Number(jahr) >= 2024) {
    expect(question.info).toContain("Gäste-WCs zählen hier nicht mit");
    for (const text of [question.text, question.info!]) {
      const key = sha1(text).toString("hex").slice(0, 6);
      expect(EN.strings[key as keyof typeof EN.strings]).toBeTruthy();
      expect(EN.strings[key as keyof typeof EN.strings]).not.toContain("[DE]");
    }
  }
});

// Concrete answers to the displayed question, including uncertainty about
// the sole-electric alternative rather than inventing an exclusion rule.
test.each([
  {
    jahr: "2024",
    situation: "solely electric",
    answer: "Ja",
    expected: "checked",
  },
  {
    jahr: "2024",
    situation: "also electric",
    answer: "Ja",
    expected: "checked",
  },
  {
    jahr: "2026",
    situation: "also electric",
    answer: "Ja",
    expected: "checked",
  },
  {
    jahr: "2026",
    situation: "solely electric, interpretation unresolved",
    answer: "Nicht sicher",
    expected: "maybe",
  },
  {
    jahr: "2026",
    situation: "no electric operation",
    answer: "Nein",
    expected: "unchecked",
  },
  {
    jahr: "2024",
    situation: "no electric operation",
    answer: "Nein",
    expected: "unchecked",
  },
])("$jahr: $situation → $expected", ({ jahr, answer, expected }) => {
  const edition = editions.find((edition) => edition.jahr === jahr)!;
  expect(evaluate(edition.pinned, 2002, answer).state).toBe(expected);
});
