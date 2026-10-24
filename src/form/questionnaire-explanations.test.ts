import { Question, ungroup } from "flow-machine";
import { describe, expect, test } from "vitest";

import EN from "../../public/locales/en.json";
import { hash } from "../l10n";
import { getMerkmalStates } from "./api";
import { getVisibleQuestionAliases } from "./flow-machine-evaluation";
import { FinalAnswers, flowMachine } from "./flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SCHNELLTEST_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "./mappings/answer-reset";
import { ALL_VERTRAGSDATUM } from "./mappings/tests/merkmal-default-state";

const merkmale = [
  ["Küche hat Kühlschrank", "[Küche+] Küche hat Kühlschrank"],
  ["Wohnung hat Durchgangszimmer", "[Wohnung-] Wohnung hat schlechten Schnitt"],
  [
    "Gebäude ist dicht bebaut",
    "[Gebäude-] Gebäude in Seitenflügel oder Quergebäude bei verdichteter Bebauung",
  ],
  ["Wohnumfeld ist besonders leise", "[Umfeld+] Besonders ruhige Lage"],
  ["Wohnumfeld ist repräsentativ", "[Umfeld+] Bevorzugte Citylage"],
] as const;

function answersFor(Vertragsdatum: string, Baujahr = 1900): FinalAnswers {
  return {
    ...SCHNELLTEST_RESET_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    Typ: "Miete",
    Vertragsdatum,
    Baujahr,
  } as FinalAnswers;
}

function questions(answers: FinalAnswers) {
  return ungroup(
    flowMachine.run(flowMachine.answers(answers as never).state),
  ).filter((step): step is Question => step.type === "Question");
}

function question(answers: FinalAnswers, alias: string) {
  const matches = questions(answers).filter((step) => step.alias === alias);
  expect(matches).toHaveLength(1);
  return matches[0];
}

describe.each(ALL_VERTRAGSDATUM)("Mietspiegel contract period %s", (datum) => {
  test("shows the source condition and the edition-specific layout example", () => {
    const answers = answersFor(datum);
    const layout = question(answers, "Wohnung hat Durchgangszimmer");
    expect(layout.text).toBe("Hat die Wohnung einen schlechten Schnitt?");
    expect(layout.info).toContain("Beispiel");
    expect(layout.info?.includes("mehr als ein gefangenes Zimmer")).toBe(
      datum === "2015-2016",
    );
    expect(layout.info).not.toContain("Einzimmerwohnung");
    const dense = question(answers, "Gebäude ist dicht bebaut");
    expect(dense.text).toContain("Seitenflügel oder Quergebäude");
    expect(dense.info).toContain("Beispiel");
    expect(dense.info).not.toContain("alle Fenster");
    expect(dense.info).not.toContain("wenige Meter");
    const quiet = question(answers, "Wohnumfeld ist besonders leise");
    expect(quiet.info).toContain("besonders ruhige Innenlage");
    expect(quiet.info).toContain("nicht abschließend");
    expect(quiet.info).toContain("Tempo-30-Zone allein genügt nicht");
    const fridge = question(answers, "Küche hat Kühlschrank");
    expect(fridge.info).toContain("Kosten nicht erstattet");
    expect(fridge.info).not.toMatch(/neuwertig|extra Miete/);
    expect(fridge.text.includes("Geschirrspüler")).toBe(
      datum === "2024-2026" || datum === ">2026",
    );
    if (datum !== ">2026") {
      const city = question(answers, "Wohnumfeld ist repräsentativ");
      expect(city.info).toContain("überregional ausstrahlenden");
      expect(city.text + city.info).not.toMatch(/Kurfürstendamm|Berlin Mitte/);
    } else {
      expect(
        questions(answers).some(
          (q) => q.alias === "Wohnumfeld ist repräsentativ",
        ),
      ).toBe(false);
    }
    for (const [alias] of merkmale) {
      for (const q of questions(answers).filter((q) => q.alias === alias)) {
        for (const copy of [q.text, q.info].filter((s): s is string => !!s)) {
          const translation = (EN.strings as Record<string, string>)[
            hash(copy)
          ];
          expect(translation).toBeTruthy();
          expect(translation).not.toContain("[DE]");
          expect(translation).not.toBe(copy);
        }
      }
    }
  });

  // None of these criteria gains a Baujahr restriction at a band boundary.
  test.each([1949, 1950, 1990, 1991, 2001, 2002])(
    "preserves Ja/Nein/Nicht sicher at Baujahr %i",
    (baujahr) => {
      for (const [alias, merkmal] of merkmale) {
        for (const [answer, expected] of [
          ["Ja", "checked"],
          ["Nein", "unchecked"],
          ["Nicht sicher", "maybe"],
        ] as const) {
          const answers = { ...answersFor(datum, baujahr), [alias]: answer };
          const visible = getVisibleQuestionAliases(answers);
          const states = getMerkmalStates(answers, visible);
          if (alias === "Wohnumfeld ist repräsentativ" && datum === ">2026") {
            expect(visible.has(alias)).toBe(false);
            expect(states).not.toHaveProperty(merkmal);
          } else {
            expect(visible.has(alias)).toBe(true);
            expect(states[merkmal]).toBe(expected);
          }
        }
      }
    },
  );
});
