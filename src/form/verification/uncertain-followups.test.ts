import { expect, test } from "vitest";

import { getWorstBestOrtsueblicheVergleichsmiete } from "~/calculation/ortsueblicheVergleichsmiete";
import { getMerkmalStates } from "~/form/api";
import { answersToCalculationContext } from "~/form/calculation-context";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";

import { BASE_ANSWERS, contractScenarios, evaluateAnswers } from "./flow-paths";

const scenarios = contractScenarios();
const choices = ["Ja", "Nein", "Nicht sicher", undefined] as const;
const parents = ["Ja", "Nein", "Nicht sicher"] as const;

function evaluate(answers: Record<string, unknown>) {
  const result = evaluateAnswers({
    ...BASE_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    Baujahr: 1900,
    ...answers,
  });
  expect(result.lastStep?.type).not.toBe("Exit");
  const normalized = result.answers as FinalAnswers;
  return {
    ...result,
    states: getMerkmalStates(normalized, result.visible),
    miete: getWorstBestOrtsueblicheVergleichsmiete(
      answersToCalculationContext(normalized, result.visible)!,
    )!,
  };
}

const followups = [
  {
    parent: "Wohnung hat Balkon",
    child: "Wohnung hat großen Balkon",
    positive: "[Wohnung+] Wohnung hat großen Balkon",
    negative: "[Wohnung-] Wohnung hat kein Balkon",
    available: () => true,
  },
  {
    parent: "Bad hat Duschmöglichkeit",
    child: "Bad hat Dusche und Wanne",
    positive: "[Bad+] Bad hat von Badewanne getrennte Dusche",
    negative: "[Bad-] Bad ohne Duschmöglichkeit",
    available: () => true,
  },
  {
    parent: "Bad hat Duschmöglichkeit",
    child: "Bad hat bodengleiche Dusche",
    positive: "[Bad+] Bad hat bodengleiche Dusche",
    negative: "[Bad-] Bad ohne Duschmöglichkeit",
    available: (jahr: string) => Number(jahr) >= 2024,
  },
] as const;

test.each(
  scenarios.flatMap((scenario) =>
    followups.flatMap((followup) =>
      parents.flatMap((parentAnswer) =>
        choices.map((childAnswer) => ({
          ...scenario,
          ...followup,
          parentAnswer,
          childAnswer,
        })),
      ),
    ),
  ),
)(
  "$label: $parent = $parentAnswer, $child = $childAnswer",
  ({
    pinned,
    jahr,
    parent,
    child,
    positive,
    negative,
    available,
    parentAnswer,
    childAnswer,
  }) => {
    const result = evaluate({
      ...pinned,
      [parent]: parentAnswer,
      [child]: childAnswer,
    });
    const visible = parentAnswer !== "Nein" && available(jahr);
    expect(result.visible.has(child)).toBe(visible);
    const expected =
      !visible || childAnswer === "Nein"
        ? "unchecked"
        : childAnswer === "Ja" &&
            (parent !== "Wohnung hat Balkon" || parentAnswer === "Ja")
          ? "checked"
          : "maybe";
    expect(result.states[positive]).toBe(
      available(jahr) ? expected : undefined,
    );
    // A stale child answer cannot confirm an impossible advantage.
    if (parentAnswer === "Nein") {
      expect(result.states[negative]).toBe("checked");
      expect(result.states[positive]).not.toBe("checked");
    }
    if (parent === "Wohnung hat Balkon") {
      expect(result.visible.has("Wohnung keinen Balkon weil unmöglich")).toBe(
        parentAnswer !== "Ja",
      );
    }
  },
);

test.each(scenarios)(
  "$label: uncertain parents include every valid concrete balcony/shower resolution",
  ({ pinned, jahr }) => {
    // Both unanswered and explicit uncertainty must preserve the full interval.
    for (const unknown of [undefined, "Nicht sicher"]) {
      const uncertain = evaluate({
        ...pinned,
        "Wohnung hat Balkon": "Nicht sicher",
        "Wohnung hat großen Balkon": unknown,
        "Wohnung keinen Balkon weil unmöglich": "Nicht sicher",
        "Bad hat Duschmöglichkeit": "Nicht sicher",
        "Bad hat Dusche und Wanne": unknown,
        "Bad hat bodengleiche Dusche": unknown,
      }).miete;
      expect(uncertain).toBeDefined();

      for (const balcony of ["Ja", "Nein"]) {
        for (const large of balcony === "Ja" ? ["Ja", "Nein"] : ["Nein"]) {
          for (const impossible of ["Ja", "Nein"]) {
            for (const shower of ["Ja", "Nein"]) {
              for (const separate of shower === "Ja"
                ? ["Ja", "Nein"]
                : ["Nein"]) {
                for (const level of shower === "Ja" && Number(jahr) >= 2024
                  ? ["Ja", "Nein"]
                  : ["Nein"]) {
                  const concrete = evaluate({
                    ...pinned,
                    "Wohnung hat Balkon": balcony,
                    "Wohnung hat großen Balkon": large,
                    "Wohnung keinen Balkon weil unmöglich": impossible,
                    "Bad hat Duschmöglichkeit": shower,
                    "Bad hat Dusche und Wanne": separate,
                    "Bad hat bodengleiche Dusche": level,
                  }).miete;
                  expect(concrete).toBeDefined();
                  // 'best' is the tenant's lower rent; 'worst' is the upper rent.
                  expect(uncertain.best).toBeLessThanOrEqual(concrete.best);
                  expect(uncertain.worst).toBeGreaterThanOrEqual(
                    concrete.worst,
                  );
                }
              }
            }
          }
        }
      }
    }
  },
);

test.each(["Ja", "Nicht sicher"])(
  "2015: confirmed shower Sondermerkmal still suppresses its duplicate follow-up (%s)",
  (parent) => {
    const result = evaluate({
      Vertragsdatum: "2015-2016",
      "Sondermerkmal Dusche Und Badewanne": "Ja",
      "Bad hat Duschmöglichkeit": parent,
      "Bad hat Dusche und Wanne": "Ja",
    });
    expect(result.visible.has("Bad hat Dusche und Wanne")).toBe(false);
    expect(result.states["[Bad+] Bad hat von Badewanne getrennte Dusche"]).toBe(
      "unchecked",
    );
  },
);

test.each(
  scenarios.flatMap((scenario) =>
    [1972, 1973, 1990, 1991].map((baujahr) => ({ ...scenario, baujahr })),
  ),
)(
  "$label, Baujahr $baujahr Ost: shower follow-ups remain possible",
  ({ pinned, jahr, baujahr }) => {
    const result = evaluate({
      ...pinned,
      Baujahr: baujahr,
      Ost: true,
      "Bad hat Duschmöglichkeit": "Nicht sicher",
      "Bad hat Dusche und Wanne": "Nicht sicher",
      "Bad hat bodengleiche Dusche": "Nicht sicher",
    });
    expect(result.states["[Bad+] Bad hat von Badewanne getrennte Dusche"]).toBe(
      "maybe",
    );
    expect(result.states["[Bad+] Bad hat bodengleiche Dusche"]).toBe(
      Number(jahr) >= 2024 ? "maybe" : undefined,
    );
  },
);
