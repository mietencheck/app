import { flowRoot } from "flow-machine";
import { expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";
import { Merkmal } from "~/mietspiegel/types";

import flow from "../flow.fm.json";
import { BASE_ANSWERS, contractScenarios, evaluateAnswers } from "./flow-paths";

const editions = contractScenarios().filter((scenario) =>
  scenario.label.startsWith("unterschrieben"),
);

function evaluate(answers: Record<string, unknown>) {
  const evaluation = evaluateAnswers({
    ...BASE_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    ...answers,
  });
  expect(evaluation.lastStep?.type).not.toBe("Exit");
  return {
    ...evaluation,
    states: getMerkmalStates(
      evaluation.answers as FinalAnswers,
      evaluation.visible,
    ),
  };
}

test("the merged Floma export passes the browser's schema validation", () => {
  expect(() => flowRoot.parse(flow)).not.toThrow();
});

// The source has no Ost restriction on a large Bad, even where the small-Bad
// question is excluded. The PR's inclusive 4-m² alias must remain intact.
test.each(editions.filter(({ jahr }) => jahr !== "2015"))(
  "$jahr: large Bad in 1973–1990 Ost does not require the small-Bad question",
  ({ pinned }) => {
    const result = evaluate({
      ...pinned,
      Baujahr: 1973,
      Ost: true,
      "Bad mindestens 4qm": undefined,
      "Bad größer als 8qm": "Ja",
    });
    expect(result.visible.has("Bad mindestens 4qm")).toBe(false);
    expect(result.states["[Bad+] Bad ist groß"]).toBe("checked");
  },
);

test.each(editions)(
  "$jahr: additional Wärmedämmung is independent of the modern-Heizanlage Baujahr limit",
  ({ pinned }) => {
    const result = evaluate({
      ...pinned,
      Baujahr: 2010,
      "Kennt Energieverbrauch oder Energiebedarf": "Nein",
      "Gebäude hat gute Wärmedämmung": "Ja",
    });
    expect(result.visible.has("Gebäude hat moderne Heizanlage")).toBe(false);
    expect(
      result.states["[Gebäude+] Gebäude hat zusätzliche Wärmedämmung"],
    ).toBe("checked");
  },
);

const unterPutzQuestion = "Wohnung hat Heizungsrohre unter Putz";
const sichtbareRohreQuestion = "Wohnung hat sichtbare Heizungsrohe";
const heizungsrohreMerkmal =
  "[Wohnung+] Wohnung hat nicht sichtbare Heizungsrohre";

// 2015 requires under-plaster installation; later editions ask about visibility.
// Answer the hidden variant positively as well to detect cross-edition leakage.
test.each(
  editions.flatMap((edition) =>
    [1990, 1991].flatMap((baujahr) =>
      ["Ja", "Nein", "Nicht sicher"].map((answer) => ({
        ...edition,
        baujahr,
        answer,
      })),
    ),
  ),
)(
  "$jahr, Baujahr $baujahr, Heizungsrohre $answer",
  ({ jahr, pinned, baujahr, answer }) => {
    const is2015 = jahr === "2015";
    const question = is2015 ? unterPutzQuestion : sichtbareRohreQuestion;
    const result = evaluate({
      ...pinned,
      Baujahr: baujahr,
      [unterPutzQuestion]: "Ja",
      [sichtbareRohreQuestion]: "Nein",
      [question]: answer,
    });
    const eligible = Number(jahr) < 2024 || baujahr <= 1990;
    expect(result.visible.has(unterPutzQuestion)).toBe(is2015);
    expect(result.visible.has(sichtbareRohreQuestion)).toBe(
      !is2015 && eligible,
    );
    const positiveAnswer = is2015 ? "Ja" : "Nein";
    expect(result.states[heizungsrohreMerkmal]).toBe(
      !eligible
        ? "unchecked"
        : answer === "Nicht sicher"
          ? "maybe"
          : answer === positiveAnswer
            ? "checked"
            : "unchecked",
    );
  },
);

test("2015: a cover hiding the pipes alone does not establish under-plaster installation", () => {
  const result = evaluate({
    Vertragsdatum: "2015-2016",
    Baujahr: 1900,
    [unterPutzQuestion]: "Nein",
    [sichtbareRohreQuestion]: "Nein",
  });
  expect(result.states[heizungsrohreMerkmal]).toBe("unchecked");
});

const recentEditions = editions.filter(({ jahr }) => Number(jahr) >= 2024);

// Mietspiegel 2015, printed p.21: the fifth-floor/no-lift Merkmal applies
// without the Baujahr exclusions introduced in later editions.
test.each([
  { baujahr: 1918, lift: "Nein", floor: "Ja", expected: "checked" },
  { baujahr: 1949, lift: "Nein", floor: "Ja", expected: "checked" },
  { baujahr: 1950, lift: "Nein", floor: "Ja", expected: "checked" },
  { baujahr: 2010, lift: "Nein", floor: "Ja", expected: "checked" },
  { baujahr: 1950, lift: "Nein", floor: "Nein", expected: "unchecked" },
  { baujahr: 1950, lift: "Ja", floor: "Ja", expected: "unchecked" },
  { baujahr: 1950, lift: "Nicht sicher", floor: "Ja", expected: "maybe" },
  { baujahr: 1950, lift: "Nein", floor: "Nicht sicher", expected: "maybe" },
  {
    baujahr: 1950,
    lift: "Nicht sicher",
    floor: "Nicht sicher",
    expected: "maybe",
  },
  { baujahr: 1950, lift: "Nicht sicher", floor: "Nein", expected: "unchecked" },
])(
  "2015, Baujahr $baujahr, Aufzug $lift, ab fünftem Obergeschoss $floor: $expected",
  ({ baujahr, lift, floor, expected }) => {
    const result = evaluate({
      Vertragsdatum: "2015-2016",
      Baujahr: baujahr,
      "Sondermerkmal Aufzug": "Nein",
      "Gebäude hat Fahrstuhl": lift,
      "Gebäude hat >=5 Stockwerke und kein Fahrstuhl": floor,
    });
    expect(
      result.states[
        "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug"
      ],
    ).toBe(expected);
  },
);

const liftCases = [
  {
    baujahr: 2009,
    hasLift: "Ja",
    question: "Gebäude hat <5 Stockwerke und Fahrstuhl",
    merkmal: "[Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen",
    eligible: true,
  },
  {
    baujahr: 2010,
    hasLift: "Ja",
    question: "Gebäude hat <5 Stockwerke und Fahrstuhl",
    merkmal: "[Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen",
    eligible: false,
  },
  {
    baujahr: 1949,
    hasLift: "Nein",
    question: "Gebäude hat >=5 Stockwerke und kein Fahrstuhl",
    merkmal: "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug",
    eligible: false,
  },
  {
    baujahr: 1950,
    hasLift: "Nein",
    question: "Gebäude hat >=5 Stockwerke und kein Fahrstuhl",
    merkmal: "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug",
    eligible: true,
  },
] as const;

test.each(
  recentEditions.flatMap((edition) =>
    liftCases.map((lift) => ({ ...edition, ...lift })),
  ),
)(
  "$jahr, Baujahr $baujahr: $question",
  ({ pinned, baujahr, hasLift, question, merkmal, eligible }) => {
    const result = evaluate({
      ...pinned,
      Baujahr: baujahr,
      "Gebäude hat Fahrstuhl": hasLift,
      [question]: "Ja",
    });
    expect(result.visible.has(question)).toBe(eligible);
    expect(result.states[merkmal as Merkmal]).toBe(
      eligible ? "checked" : "unchecked",
    );
  },
);

test.each([1994, 1995])(
  "2017, Baujahr %i: Schallschutzfenster only before 1995",
  (baujahr) => {
    const result = evaluate({
      Vertragsdatum: "2016-2018",
      Baujahr: baujahr,
      "Wohnung hat Schallschutzfenster": "Ja",
    });
    expect(result.visible.has("Wohnung hat Schallschutzfenster")).toBe(
      baujahr < 1995,
    );
    expect(
      result.states[
        "[Wohnung+] Wohnung hat Schallschutzfenster/Wärmeschutzverglasung"
      ],
    ).toBe(baujahr < 1995 ? "checked" : "unchecked");
  },
);
