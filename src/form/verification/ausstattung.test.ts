import { flowRoot } from "flow-machine";
import { expect, test } from "vitest";

import { hash } from "~/l10n";

import EN from "../../../public/locales/en.json";
import {
  getAusstattung,
  getMerkmalStates,
  getSondermerkmalStates,
} from "../api";
import { FinalAnswers } from "../flow-machine-runtime";
import flow from "../flow.fm.json";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "../mappings/answer-reset";
import {
  BASE_ANSWERS,
  contractScenarios,
  evaluateAnswers,
  questionCopiesByAlias,
} from "./flow-paths";

const editions = contractScenarios().filter(({ label }) =>
  label.startsWith("unterschrieben"),
);

// The questionnaire asks for qualifying Ausstattung, not physical presence.
// These are the answers a user gives under the displayed funding instruction;
// funding is deliberately not a new saved-answer field or historical migration.
const cases = [
  { funding: "landlord provided", answer: "Ja", state: "checked" },
  {
    funding: "tenant paid, landlord reimbursed",
    answer: "Ja",
    state: "checked",
  },
  {
    funding: "tenant paid, not reimbursed",
    answer: "Nein",
    state: "unchecked",
  },
  { funding: "unclear reimbursement", answer: "Nicht sicher", state: "maybe" },
  { funding: "partial reimbursement", answer: "Nicht sicher", state: "maybe" },
] as const;

function evaluate(
  pinned: Record<string, unknown>,
  answers: Record<string, unknown>,
) {
  const result = evaluateAnswers({
    ...BASE_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    ...pinned,
    Baujahr: 1930,
    ...answers,
  });
  expect(result.lastStep?.type).not.toBe("Exit");
  return { answers: result.answers as FinalAnswers, visible: result.visible };
}

test.each(
  editions.flatMap((edition) => cases.map((c) => ({ ...edition, ...c }))),
)("$jahr: same underfloor heating, $funding", ({ pinned, answer, state }) => {
  const result = evaluate(pinned, { "Bad mit Fußbodenheizung": answer });
  expect(result.visible.has("Bad mit Fußbodenheizung")).toBe(true);
  expect(
    getMerkmalStates(result.answers, result.visible)[
      "[Bad+] Bad hat Fußbodenheizung"
    ],
  ).toBe(state);
});

test.each(cases)(
  "2015: same Sondermerkmal floor, $funding",
  ({ answer, state }) => {
    const result = evaluate(
      editions.find(({ jahr }) => jahr === "2015")!.pinned,
      {
        "Sondermerkmal Bodenbelag": answer,
      },
    );
    expect(result.visible.has("Sondermerkmal Bodenbelag")).toBe(true);
    expect(
      getSondermerkmalStates(result.answers, result.visible)?.[
        "[Sondermerkmal] Hochwertiger Bodenbelag"
      ],
    ).toBe(state);
  },
);

test.each(
  editions.flatMap((edition) => cases.map((c) => ({ ...edition, ...c }))),
)(
  "$jahr: tenant cooker must not hide missing landlord cooking facilities ($funding)",
  ({ pinned, answer }) => {
    const result = evaluate(pinned, {
      "Küche hat Kochmöglichkeit": answer,
      "Küche hat Gas/Elektroherd ohne Backofen": "Nein",
    });
    expect(result.visible.has("Küche hat Kochmöglichkeit")).toBe(true);
    expect(
      getMerkmalStates(result.answers, result.visible)[
        "[Küche-] Küche ohne Kochmöglichkeit"
      ],
    ).toBe(
      answer === "Nein"
        ? "checked"
        : answer === "Nicht sicher"
          ? "maybe"
          : "unchecked",
    );
  },
);

test.each(
  editions.flatMap((edition) =>
    [1964, 1965].flatMap((baujahr) =>
      cases.map((c) => ({ ...edition, baujahr, ...c })),
    ),
  ),
)(
  "$jahr, Baujahr $baujahr: base heating/bath Ausstattung, $funding",
  ({ pinned, baujahr, answer }) => {
    const result = evaluate(pinned, {
      Baujahr: baujahr,
      "Wohnung hat Sammelheizung": answer,
      "Badezimmer in Wohnung": answer,
    });
    expect(result.visible.has("Wohnung hat Sammelheizung")).toBe(
      baujahr <= 1964,
    );
    expect(result.visible.has("Badezimmer in Wohnung")).toBe(baujahr <= 1964);
    expect(getAusstattung(result.answers, result.visible)).toEqual({
      sammelheizung: baujahr <= 1964 ? answer : "Nein",
      bad: baujahr <= 1964 ? answer : "Nein",
    });
  },
);

test("source flow remains valid and qualifying copy is translated for every edited edition copy", () => {
  expect(() => flowRoot.parse(flow)).not.toThrow();
  for (const alias of [
    "Wohnung hat Sammelheizung",
    "Badezimmer in Wohnung",
    "Sondermerkmal Dusche Und Badewanne",
    "Sondermerkmal Modernes Bad",
    "Sondermerkmal Moderne Küche",
    "Sondermerkmal Bodenbelag",
    "Bad mit Fußbodenheizung",
    "Wohnung hat hochwertigen Bodenbelag",
    "Küche hat Einbauküche",
    "Küche hat Kücheninsel",
    "Küche hat Kochmöglichkeit",
    "Küche hat Spüle",
    "Küche hat Kühlschrank",
    "Küche hat Dunstabzug",
    "Küche hat hochwertigen Fußboden",
  ]) {
    const copies = questionCopiesByAlias.get(alias)!;
    expect(copies.length).toBeGreaterThan(0);
    for (const { node } of copies) {
      expect(node.info).toContain("deren Kosten sie oder er dir erstattet hat");
      const strings: Record<string, string> = EN.strings;
      expect(strings[hash(node.info!)]).toContain(
        "landlord reimbursed you for",
      );
      expect(strings[hash(node.info!)]).not.toContain("[DE]");
      expect(strings[hash(node.text)]).toBeTruthy();
    }
  }
});
