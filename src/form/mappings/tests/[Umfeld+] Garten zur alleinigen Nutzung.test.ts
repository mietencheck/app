import { describe, expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import { MERKMAL_RESET_ANSWERS } from "~/form/mappings/answer-reset";
import {
  BASE_ANSWERS,
  evaluateAnswers,
  questionByAlias,
} from "~/form/verification/flow-paths";
import { allScenarios } from "~/form/verification/merkmal-coverage";
import { hash } from "~/l10n";

import EN from "../../../../public/locales/en.json";

const eigenerGarten = "Wohnumfeld hat eigenen Garten";
const mietergarten = "Wohnumfeld hat kostenfreien Mietergarten";
const merkmal = "[Umfeld+] Garten zur alleinigen Nutzung";
type Antwort = "Ja" | "Nein" | "Nicht sicher";

// Answers refer to the full alternatives/conditions in the displayed questions.
// LG Berlin 63 S 52/20, Rn. 6 distinguishes exclusive use from a free,
// tenant-only Mietergarten. A generic communal garden answer is insufficient.
const cases: [string, Antwort, Antwort, string][] = [
  [
    "exclusive garden without direct access or a separate fee",
    "Ja",
    "Nein",
    "checked",
  ],
  ["exclusive garden with a separate fee", "Ja", "Nein", "checked"],
  [
    "garden belonging to the apartment with direct access, even with a fee",
    "Ja",
    "Nein",
    "checked",
  ],
  [
    "free shared Mietergarten reserved for the property's tenants",
    "Nein",
    "Ja",
    "checked",
  ],
  ["shared garden with a separate usage fee", "Nein", "Nein", "unchecked"],
  [
    "shared garden also open to the general public",
    "Nein",
    "Nein",
    "unchecked",
  ],
  ["no qualifying garden", "Nein", "Nein", "unchecked"],
  [
    "unclear garden permission, access restriction or usage fee",
    "Nein",
    "Nicht sicher",
    "maybe",
  ],
  [
    "unclear exclusive use or belonging/direct access",
    "Nicht sicher",
    "Nein",
    "maybe",
  ],
  [
    "unclear first alternative but confirmed free tenant garden",
    "Nicht sicher",
    "Ja",
    "checked",
  ],
  ["both alternatives unclear", "Nicht sicher", "Nicht sicher", "maybe"],
];

describe.each(allScenarios())("garden eligibility in $jahr", (scenario) => {
  // This feature has no Baujahr gate; check both sides of the landscaping
  // playground boundaries without changing that independent feature.
  test.each([1918, 1990, 2001, 2002, 2003, 2014])("Baujahr %i", (baujahr) => {
    for (const [label, eigener, gemeinsamer, expected] of cases) {
      const evaluation = evaluateAnswers({
        ...BASE_ANSWERS,
        ...MERKMAL_RESET_ANSWERS,
        ...scenario.pinned,
        Baujahr: baujahr,
        [eigenerGarten]: eigener,
        [mietergarten]: gemeinsamer,
      });
      expect(evaluation.visible.has(eigenerGarten), label).toBe(true);
      expect(evaluation.visible.has(mietergarten), label).toBe(
        eigener !== "Ja",
      );
      const states = getMerkmalStates(
        evaluation.answers as FinalAnswers,
        evaluation.visible,
      );
      expect(states[merkmal], label).toBe(expected);
      expect(
        states["[Umfeld+] Aufwändig gestaltetes Wohnumfeld auf dem Grundstück"],
        label,
      ).toBe("unchecked");
    }
  });

  test("a generic Gemeinschaftsgarten answer cannot establish the new conditions", () => {
    const evaluation = evaluateAnswers({
      ...BASE_ANSWERS,
      ...MERKMAL_RESET_ANSWERS,
      ...scenario.pinned,
      "Wohnumfeld hat Gemeinschaftsgarten": "Ja",
      [mietergarten]: undefined,
    });
    expect(
      getMerkmalStates(evaluation.answers as FinalAnswers, evaluation.visible)[
        merkmal
      ],
    ).toBe("maybe");
  });

  test("landscaping remains independent of garden eligibility", () => {
    const evaluation = evaluateAnswers({
      ...BASE_ANSWERS,
      ...MERKMAL_RESET_ANSWERS,
      ...scenario.pinned,
      "Wohnumfeld ist aufwendig gestaltet": "Ja",
    });
    const states = getMerkmalStates(
      evaluation.answers as FinalAnswers,
      evaluation.visible,
    );
    expect(states[merkmal]).toBe("unchecked");
    expect(
      states["[Umfeld+] Aufwändig gestaltetes Wohnumfeld auf dem Grundstück"],
    ).toBe("checked");
  });
});

test("German and English questions state the alternatives and Mietergarten conditions", () => {
  const eigener = questionByAlias(eigenerGarten)!;
  const gemeinsamer = questionByAlias(mietergarten)!;
  expect(eigener.text).toContain("alleinigen Nutzung");
  expect(eigener.text).toContain("gehört zu deiner Wohnung");
  expect(eigener.text).toContain("direktem Zugang aus der Wohnung");
  expect(eigener.info).toContain("Bei diesen Alternativen");
  expect(gemeinsamer.text).toContain("ohne zusätzliches Nutzungsentgelt");
  expect(gemeinsamer.text).toContain("ausschließlich");
  expect(gemeinsamer.info).toContain("nur geduldeter");
  expect(gemeinsamer.info).toContain("Ich bin mir nicht sicher");
  for (const question of [eigener, gemeinsamer]) {
    for (const text of [question.text, question.info!]) {
      const translation = EN.strings[hash(text) as keyof typeof EN.strings];
      expect(translation).toBeTruthy();
      expect(translation).not.toContain("[DE]");
    }
  }
});
