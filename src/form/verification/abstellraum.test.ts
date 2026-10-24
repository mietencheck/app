import { expect, test } from "vitest";

import { hash } from "~/l10n";

import EN from "../../../public/locales/en.json";
import { getMerkmalStates } from "../api";
import { FinalAnswers } from "../flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "../mappings/answer-reset";
import {
  allQuestionNodes,
  BASE_ANSWERS,
  contractScenarios,
  evaluateAnswers,
} from "./flow-paths";

const alias = "Wohnung hat Abstellraum";
const merkmal = "[Wohnung+] Wohnung hat Einbauschrank/Abstellraum";
const answers = [
  { answer: "Ja", expected: "checked" },
  { answer: "Nein", expected: "unchecked" },
  { answer: "Nicht sicher", expected: "maybe" },
  { answer: undefined, expected: "maybe" },
];

// 2015 printed p.20: Sichtschutz qualifies the Abstellraum alternative.
// From 2017 the clause omits Sichtschutz; 2026 adds the 1-m² threshold.
test.each(
  contractScenarios().flatMap((scenario) =>
    [1918, 1990, 1991].flatMap((baujahr) =>
      answers.map((answer) => ({ ...scenario, baujahr, ...answer })),
    ),
  ),
)(
  "$label, Baujahr $baujahr, $answer: storage question and Merkmal",
  ({ jahr, pinned, baujahr, answer, expected }) => {
    const result = evaluateAnswers({
      ...BASE_ANSWERS,
      ...MERKMAL_RESET_ANSWERS,
      ...SONDERMERKMAL_RESET_ANSWERS,
      ...pinned,
      Baujahr: baujahr,
      [alias]: answer,
    });
    expect(result.lastStep?.type).not.toBe("Exit");
    expect(result.visible.has(alias)).toBe(true);
    const question = allQuestionNodes.find(
      ({ node }) => node.id === result.nodeIds.get(alias),
    )!.node;
    expect(question.text).toBe(
      jahr === "2015"
        ? "Gibt es innerhalb der Wohnung einen Einbauschrank oder einen Abstellraum mit Sichtschutz?"
        : jahr === "2026"
          ? "Gibt es innerhalb der Wohnung einen Abstellraum (mind. 1 m² Grundfläche) oder Einbauschrank?"
          : "Gibt es innerhalb der Wohnung einen Abstellraum oder Einbauschrank?",
    );
    if (jahr === "2015") {
      expect(question.info).toBe(
        "Ein Abstellraum ohne Sichtschutz zählt hier nicht. Ein Einbauschrank innerhalb der Wohnung zählt ebenfalls.",
      );
      for (const text of [question.text, question.info!]) {
        const key = hash(text);
        const translated = EN.strings[key as keyof typeof EN.strings];
        expect(translated).toContain("privacy screening");
        expect(translated).not.toContain("[DE]");
      }
    } else {
      expect(question.info).toBeNull();
      expect(question.text).not.toContain("Sichtschutz");
    }
    expect(
      getMerkmalStates(result.answers as FinalAnswers, result.visible)[merkmal],
    ).toBe(expected);
  },
);
