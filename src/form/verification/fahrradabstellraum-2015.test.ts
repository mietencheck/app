import { expect, test } from "vitest";

import { getWorstBestMerkmalStateByMerkmalGruppe } from "~/calculation/spanneneinordnung";
import { getMerkmalStates } from "~/form/api";
import { answersToCalculationContext } from "~/form/calculation-context";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";

import { BASE_ANSWERS, contractScenarios, evaluateAnswers } from "./flow-paths";

const antworten = ["Ja", "Nein", "Nicht sicher", undefined] as const;

function evaluate(answers: Record<string, unknown>) {
  const result = evaluateAnswers({
    ...BASE_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    Vertragsdatum: "2015-2016",
    Baujahr: 1918,
    ...answers,
  });
  expect(result.lastStep?.type).not.toBe("Exit");
  return {
    ...result,
    states: getMerkmalStates(result.answers as FinalAnswers, result.visible),
  };
}

// Mietspiegel 2015, printed p.21 (PDF p.20): the locked room is a
// separate positive Merkmal; general bicycle parking only avoids the negative.
test.each(
  antworten.flatMap((parkantwort) =>
    antworten.map((raumantwort) => ({ parkantwort, raumantwort })),
  ),
)(
  "2015: Abstellmöglichkeit $parkantwort, abschließbarer Raum $raumantwort",
  ({ parkantwort, raumantwort }) => {
    const result = evaluate({
      "Gebäude hat Fahrradabstellmöglichkeit": parkantwort,
      "Gebäude hat Fahrradabstellraum": raumantwort,
      // Outdoor parking cannot qualify as the 2015 locked-room advantage.
      "Gebäude hat Fahrradstellplätze mit Anschließmöglichkeit": "Ja",
    });
    expect(result.nodeIds.get("Gebäude hat Fahrradabstellraum")).toBe("m2fbk");
    expect(
      result.visible.has(
        "Gebäude hat Fahrradstellplätze mit Anschließmöglichkeit",
      ),
    ).toBe(false);
    expect(
      result.states[
        "[Gebäude+] Gebäude hat Fahrradabstellraum/Fahrradstellplätze"
      ],
    ).toBe(
      raumantwort === "Ja"
        ? "checked"
        : raumantwort === "Nein"
          ? "unchecked"
          : "maybe",
    );
    expect(
      result.states["[Gebäude-] Gebäude hat keine Fahrradabstellmöglichkeit"],
    ).toBe(
      parkantwort === "Nein"
        ? "checked"
        : parkantwort === "Ja"
          ? "unchecked"
          : "maybe",
    );
  },
);

test.each([1918, 1949, 1950, 1990, 1991, 2010])(
  "2015, Baujahr %i: courtyard parking and a locked room qualify together",
  (baujahr) => {
    const result = evaluate({
      Baujahr: baujahr,
      "Gebäude hat Fahrradabstellmöglichkeit": "Ja",
      "Gebäude hat Fahrradabstellraum": "Ja",
    });
    expect(result.nodeIds.get("Gebäude hat Fahrradabstellraum")).toBe("m2fbk");
    expect(
      result.states[
        "[Gebäude+] Gebäude hat Fahrradabstellraum/Fahrradstellplätze"
      ],
    ).toBe("checked");
  },
);

test.each(contractScenarios())(
  "$jahr ($label): 2015 room question stays within its contract period",
  ({ jahr, pinned }) => {
    const result = evaluate(pinned);
    expect([...result.nodeIds.values()].includes("m2fbk")).toBe(
      jahr === "2015",
    );
    expect(result.visible.has("Gebäude hat Fahrradabstellmöglichkeit")).toBe(
      jahr === "2015",
    );
  },
);

test.each([
  { raumantwort: "Ja", expected: { best: 1, worst: 1 } },
  { raumantwort: "Nein", expected: { best: 0, worst: 0 } },
  { raumantwort: "Nicht sicher", expected: { best: 0, worst: 1 } },
  { raumantwort: undefined, expected: { best: 0, worst: 1 } },
])(
  "2015: Raum $raumantwort contributes to Gebäude calculation",
  ({ raumantwort, expected }) => {
    const result = evaluate({
      "Gebäude hat Fahrradabstellmöglichkeit": "Ja",
      "Gebäude hat Fahrradabstellraum": raumantwort,
      "Kennt Energieverbrauch oder Energiebedarf": "Nein",
      "Gebäude hat Fahrstuhl": "Nein",
    });
    const ctx = answersToCalculationContext(
      result.answers as FinalAnswers,
      result.visible,
    );
    expect(ctx).toBeDefined();
    expect(getWorstBestMerkmalStateByMerkmalGruppe(ctx!).Gebäude).toEqual(
      expected,
    );
  },
);
