import { expect, test } from "vitest";

import { hash } from "~/l10n";

import EN from "../../../public/locales/en.json";
import {
  BASE_ANSWERS,
  contractScenarios,
  evaluateAnswers,
  questionNodeById,
} from "./flow-paths";

const scenarios = contractScenarios().flatMap((scenario) =>
  [1900, 1990, 1991, 2014].map((baujahr) => ({ ...scenario, baujahr })),
);

// 2024 and 2026, printed p. 22 (PDF p. 24): only 2024 lists
// "sehr kleine Standfläche". Neither clause defines a numeric size threshold.
test.each(scenarios)(
  "$label, Baujahr $baujahr: shower help follows the applicable edition",
  ({ jahr, pinned, baujahr }) => {
    const evaluation = evaluateAnswers({
      ...BASE_ANSWERS,
      ...pinned,
      Baujahr: baujahr,
    });
    const id = evaluation.nodeIds.get("Bad hat Duschmöglichkeit");
    expect(id).toBeDefined();
    const question = questionNodeById.get(id!)!;
    const german = question.info!;
    const english = EN.strings[hash(german) as keyof typeof EN.strings];
    expect(english).toBeDefined();
    expect(english).not.toContain("[DE]");
    expect(german.includes("sehr kleine Standfläche")).toBe(jahr === "2024");
    expect(english.includes("very small standing area")).toBe(jahr === "2024");
    expect(german).not.toMatch(/\d+(?:[.,]\d+)?\s*(?:cm|m²|qm)/);
    expect(english).not.toMatch(/\d+(?:[.,]\d+)?\s*(?:cm|m²|sqm)/);
    expect(question.answer.options?.map((option) => option.alias)).toEqual([
      "Ja",
      "Nein",
      "Nicht sicher",
    ]);
  },
);
