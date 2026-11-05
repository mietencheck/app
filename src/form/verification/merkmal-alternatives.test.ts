import { expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";
import { Merkmal } from "~/mietspiegel/types";

import {
  BASE_ANSWERS,
  contractScenarios,
  evaluateAnswers,
  questionNodeById,
} from "./flow-paths";

const choices = [
  { answer: "Ja", state: "checked" },
  { answer: "Nein", state: "unchecked" },
  { answer: "Nicht sicher", state: "maybe" },
] as const;

// Source: Orientierungshilfe, Bad/WC and Gebäude in all seven editions.
// Explicit years test transitions *inside* the table's coarse Baujahr classes.
const cases = contractScenarios().flatMap((scenario) => {
  const recent = Number(scenario.jahr) >= 2024;
  const wcLimit = recent ? 2002 : 2003;
  const heatingLimit = recent ? 2009 : scenario.jahr === "2015" ? 1995 : 2003;
  // The 2015 clause uses 01.07.1994. A year-only answer cannot resolve
  // first occupancy within 1994; assert only unambiguous years here.
  const heatingYears =
    scenario.jahr === "2015" ? [1993, 1995] : [heatingLimit - 1, heatingLimit];
  return [
    ...[wcLimit - 1, wcLimit].flatMap((baujahr) => [
      {
        question: "Bad hat wandhängendes WC",
        merkmal: "[Bad+] Bad hat wandhängendes WC",
        eligible: Number(scenario.jahr) < 2019 || baujahr < wcLimit,
        baujahr,
      },
      ...(recent
        ? [
            {
              question: "Bad hat hochwertiges Stand-WC",
              merkmal: "[Bad+] Bad hat wandhängendes WC",
              eligible: true,
              baujahr,
            },
          ]
        : []),
    ]),
    ...[2001, 2002].map((baujahr) => ({
      question: "Bad mit Strukturheizkörper",
      merkmal: "[Bad+] Bad hat Strukturheizkörper",
      eligible: true,
      baujahr,
      electric: recent && baujahr >= 2002,
    })),
    ...heatingYears.flatMap((baujahr) => [
      {
        question: "Gebäude hat moderne Heizanlage",
        merkmal: "[Gebäude+] Gebäude hat zusätzliche Wärmedämmung",
        eligible: baujahr < heatingLimit,
        baujahr,
      },
      {
        question: "Gebäude hat gute Wärmedämmung",
        merkmal: "[Gebäude+] Gebäude hat zusätzliche Wärmedämmung",
        eligible: true,
        baujahr,
      },
    ]),
    ...(scenario.jahr === "2017" ? [1994, 1995] : [2001, 2002]).map(
      (baujahr) => ({
        question: "Wohnung hat Schallschutzfenster",
        merkmal:
          "[Wohnung+] Wohnung hat Schallschutzfenster/Wärmeschutzverglasung",
        eligible:
          scenario.jahr === "2015" ||
          (scenario.jahr === "2017" ? baujahr < 1995 : baujahr < 2002),
        baujahr,
      }),
    ),
  ].flatMap((entry) =>
    choices.map((choice) => ({ ...scenario, ...entry, ...choice })),
  );
});

test.each(cases)(
  "$jahr, $label, Baujahr $baujahr: $question = $answer",
  ({
    pinned,
    question,
    merkmal,
    eligible,
    baujahr,
    answer,
    state,
    ...entry
  }) => {
    const result = evaluateAnswers({
      ...BASE_ANSWERS,
      ...MERKMAL_RESET_ANSWERS,
      ...SONDERMERKMAL_RESET_ANSWERS,
      ...pinned,
      Baujahr: baujahr,
      "Kennt Energieverbrauch oder Energiebedarf": "Nein",
      [question]: answer,
    });
    expect(result.lastStep?.type).not.toBe("Exit");
    expect(result.visible.has(question)).toBe(eligible);
    expect(
      getMerkmalStates(result.answers as FinalAnswers, result.visible)[
        merkmal as Merkmal
      ],
    ).toBe(eligible ? state : "unchecked");
    if ("electric" in entry) {
      const copy = questionNodeById.get(result.nodeIds.get(question)!);
      expect(copy?.text.includes("elektrisch")).toBe(entry.electric);
    }
  },
);
