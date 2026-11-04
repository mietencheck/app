import { expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";

import { BASE_ANSWERS, contractScenarios, evaluateAnswers } from "./flow-paths";

const kochfeld = "Küche hat Ceran-/Induktionsherd";
const ohneBackofen = "Küche hat Gas/Elektroherd ohne Backofen";
const kochmoeglichkeit = "Küche hat Kochmöglichkeit";
const vorteil = "[Küche+] Küche hat Ceran-/Induktionsherd";
const nachteil = "[Küche-] Küche ohne Kochmöglichkeit";
const options = ["Ja", "Nein", "Nicht sicher"] as const;
const state = { Ja: "checked", Nein: "unchecked", "Nicht sicher": "maybe" };

function evaluate(answers: Record<string, unknown>) {
  const result = evaluateAnswers({
    ...BASE_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    ...answers,
  });
  expect(result.lastStep?.type).not.toBe("Exit");
  return {
    ...result,
    states: getMerkmalStates(result.answers as FinalAnswers, result.visible),
  };
}

// Küche source items (printed pages): 2015 p.20; 2017 p.15; 2019 p.19;
// 2021/2023 p.18; 2024/2026 p.22. The hob item has no oven requirement.
for (const scenario of contractScenarios()) {
  test.each(options.flatMap((hob) => options.map((oven) => ({ hob, oven }))))(
    `${scenario.jahr}, ${scenario.label}: hob $hob and no oven $oven are independent`,
    ({ hob, oven }) => {
      const result = evaluate({
        ...scenario.pinned,
        Baujahr: 2001,
        [kochmoeglichkeit]: "Ja",
        [ohneBackofen]: oven,
        [kochfeld]: hob,
      });
      expect(result.visible.has(kochfeld)).toBe(true);
      expect(result.visible.has(ohneBackofen)).toBe(true);
      expect(result.states[vorteil]).toBe(state[hob]);
      expect(result.states[nachteil]).toBe(state[oven]);
    },
  );

  test.each(options)(
    `${scenario.jahr}, ${scenario.label}: no cooking facilities ignores hob answer %s`,
    (hob) => {
      const result = evaluate({
        ...scenario.pinned,
        Baujahr: 2001,
        [kochmoeglichkeit]: "Nein",
        [kochfeld]: hob,
        [ohneBackofen]: "Ja",
      });
      expect(result.visible.has(kochfeld)).toBe(false);
      expect(result.visible.has(ohneBackofen)).toBe(false);
      expect(result.states[vorteil]).toBe("unchecked");
      expect(result.states[nachteil]).toBe("checked");
    },
  );

  test(`${scenario.jahr}, ${scenario.label}: uncertain cooking facilities allows the hob follow-up`, () => {
    const result = evaluate({
      ...scenario.pinned,
      Baujahr: 2001,
      [kochmoeglichkeit]: "Nicht sicher",
      [ohneBackofen]: "Ja",
      [kochfeld]: "Nicht sicher",
    });
    expect(result.visible.has(kochfeld)).toBe(true);
    expect(result.visible.has(ohneBackofen)).toBe(false);
    expect(result.states[vorteil]).toBe("maybe");
    expect(result.states[nachteil]).toBe("maybe");
  });

  test.each([2001, 2002])(
    `${scenario.jahr}, ${scenario.label}: Baujahr %s retains the edition restriction`,
    (baujahr) => {
      const result = evaluate({
        ...scenario.pinned,
        Baujahr: baujahr,
        [kochmoeglichkeit]: "Ja",
        [ohneBackofen]: "Ja",
        [kochfeld]: "Ja",
      });
      const eligible = Number(scenario.jahr) < 2024 || baujahr <= 2001;
      expect(result.visible.has(kochfeld)).toBe(eligible);
      expect(result.states[vorteil]).toBe(eligible ? "checked" : "unchecked");
      expect(result.states[nachteil]).toBe("checked");
    },
  );
}

test.each(options)(
  "2015: Moderne Küchenausstattung %s retains the Sondermerkmal exclusion",
  (moderneKueche) => {
    const result = evaluate({
      Vertragsdatum: "2015-2016",
      Baujahr: 1918,
      "Sondermerkmal Moderne Küche": moderneKueche,
      [kochmoeglichkeit]: "Ja",
      [ohneBackofen]: "Ja",
      [kochfeld]: "Ja",
    });
    const eligible = moderneKueche !== "Ja";
    expect(result.visible.has(kochfeld)).toBe(eligible);
    expect(result.states[vorteil]).toBe(eligible ? "checked" : "unchecked");
    expect(result.states[nachteil]).toBe("checked");
  },
);
