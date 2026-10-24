import { describe, expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers, questionsByAlias } from "~/form/flow-machine-runtime";
import { MERKMAL_RESET_ANSWERS } from "~/form/mappings/answer-reset";
import { hash } from "~/l10n";

import EN from "../../../public/locales/en.json";
import { BASE_ANSWERS, contractScenarios, evaluateAnswers } from "./flow-paths";

const alias = "Küche hat Kücheninsel";
const merkmal = "[Küche+] Küche hat freistehenden Küchenblock";
const editions = contractScenarios();

function evaluate(answers: Record<string, unknown>) {
  const result = evaluateAnswers({
    ...BASE_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...answers,
  });
  expect(result.lastStep?.type).not.toBe("Exit");
  return {
    ...result,
    states: getMerkmalStates(result.answers as FinalAnswers, result.visible),
  };
}

// Mietspiegel 2024/2026, printed p.22 (PDF p.24): the worktop is required
// with either cooking facilities or a sink. There is no Baujahr restriction.
describe.each(editions)("$jahr, $label: Küchenblock", ({ jahr, pinned }) => {
  test.each([1918, 1990, 1991, 2001, 2002, 2009, 2010, 2014])(
    "Baujahr %i: only the 2024/2026 editions ask the combined question",
    (baujahr) => {
      const result = evaluate({ ...pinned, Baujahr: baujahr, [alias]: "Ja" });
      const eligible = Number(jahr) >= 2024;
      expect(result.visible.has(alias)).toBe(eligible);
      if (eligible) {
        expect(result.states[merkmal]).toBe("checked");
      } else {
        expect(result.states).not.toHaveProperty(merkmal);
      }
    },
  );

  if (Number(jahr) >= 2024) {
    test.each([
      { answer: "Ja", expected: "checked" },
      { answer: "Nein", expected: "unchecked" },
      { answer: "Nicht sicher", expected: "maybe" },
      { answer: undefined, expected: "maybe" },
    ])("$answer → $expected", ({ answer, expected }) => {
      const result = evaluate({ ...pinned, Baujahr: 2002, [alias]: answer });
      expect(result.visible.has(alias)).toBe(true);
      expect(result.states[merkmal]).toBe(expected);
    });
  }
});

test("the German and English question require a worktop with either alternative", () => {
  const question = questionsByAlias.get(alias)!;
  expect(question.text).toContain("von der Vermieterin");
  expect(question.text).toContain("freistehenden Kücheninsel");
  expect(question.text).toContain(
    "Arbeitsfläche und zusätzlich einer Kochmöglichkeit oder einer Spüle",
  );
  expect(question.info).toContain(
    "Die Kücheninsel muss eine Arbeitsfläche haben.",
  );
  expect(question.info).toContain(
    "Zusätzlich muss sie eine Kochmöglichkeit, eine Spüle oder beides haben.",
  );
  expect(question.info).toContain(
    "Eine Kücheninsel ohne Arbeitsfläche zählt nicht.",
  );
  expect(question.info).toContain(
    "nicht mit einer Wand oder einer anderen Arbeitsfläche verbunden",
  );
  expect(question.info).toContain(
    "L-förmige Küchentheken sind daher nicht freistehend.",
  );

  const strings: Record<string, string> = EN.strings;
  expect(strings[hash(question.text)]).toBe(
    "Has the landlord fitted the kitchen with a freestanding kitchen island with a worktop and, in addition, cooking facilities or a sink?",
  );
  expect(strings[hash(question.info!)]).toBe(
    "The kitchen island must have a worktop. In addition, it must have cooking facilities, a sink or both. An island without a worktop does not count. Freestanding means that it is not connected to a wall or other work surface. L-shaped kitchen counters are therefore not free-standing.",
  );
});
