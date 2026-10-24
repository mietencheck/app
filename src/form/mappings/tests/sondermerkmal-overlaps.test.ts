import { describe, expect, test } from "vitest";

import { getWorstBestOrtsueblicheVergleichsmiete } from "~/calculation/ortsueblicheVergleichsmiete";
import { getMerkmalStates, getSondermerkmalStates } from "~/form/api";
import { answersToCalculationContext } from "~/form/calculation-context";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import {
  MERKMAL_RESET_ANSWERS,
  SCHNELLTEST_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";

import { ALL_VERTRAGSDATUM } from "./merkmal-default-state";

const baseAnswers = {
  ...SCHNELLTEST_RESET_ANSWERS,
  ...MERKMAL_RESET_ANSWERS,
  ...SONDERMERKMAL_RESET_ANSWERS,
  Typ: "Miete",
  Unterschrieben: "Ja",
  Vertragsdatum: "2015-2016",
  Baujahr: 1918,
  Ost: false,
  Wohnlage: "mittel",
  Qm: 60,
  "Wohnung hat Sammelheizung": "Ja",
  "Badezimmer in Wohnung": "Ja",
} satisfies FinalAnswers;

const components = [
  {
    question: "Bad hat Einhebelmischbatterie",
    merkmal: "[Bad+] Bad hat Einhebelmischbatterie",
    specialQuestion: "Sondermerkmal Modernes Bad",
    sondermerkmal: "[Sondermerkmal] Modernes Bad",
  },
  {
    question: "Küche hat Kühlschrank",
    merkmal: "[Küche+] Küche hat Kühlschrank",
    specialQuestion: "Sondermerkmal Moderne Küche",
    sondermerkmal: "[Sondermerkmal] Moderne Küchenausstattung",
  },
] as const;
const choices = ["Ja", "Nein", "Nicht sicher"] as const;

for (const component of components) {
  describe(component.question, () => {
    test.each(
      choices.flatMap((special) =>
        choices.map((ordinary) => ({ special, ordinary })),
      ),
    )(
      "2015 Sondermerkmal $special, ordinary answer $ordinary",
      ({ special, ordinary }) => {
        const answers: FinalAnswers = {
          ...baseAnswers,
          [component.specialQuestion]: special,
          [component.question]: ordinary,
        };
        const visible = getVisibleQuestionAliases(answers);
        expect(visible.has(component.question)).toBe(special !== "Ja");
        expect(getMerkmalStates(answers, visible)[component.merkmal]).toBe(
          special === "Ja" || ordinary === "Nein"
            ? "unchecked"
            : ordinary === "Ja"
              ? "checked"
              : "maybe",
        );
        expect(
          getSondermerkmalStates(answers, visible)![component.sondermerkmal],
        ).toBe(
          special === "Ja"
            ? "checked"
            : special === "Nein"
              ? "unchecked"
              : "maybe",
        );
      },
    );

    test.each(
      [
        1918, 1919, 1949, 1950, 1964, 1965, 1972, 1973, 1990, 1991, 2002, 2003,
      ].flatMap((Baujahr) => [false, true].map((Ost) => ({ Baujahr, Ost }))),
    )(
      "Baujahr $Baujahr, Ost $Ost only excludes an applicable Sondermerkmal",
      ({ Baujahr, Ost }) => {
        const answers: FinalAnswers = {
          ...baseAnswers,
          Baujahr,
          Ost,
          [component.specialQuestion]: "Ja",
          [component.question]: "Ja",
        };
        const visible = getVisibleQuestionAliases(answers);
        const applicable =
          component.question === "Bad hat Einhebelmischbatterie"
            ? Baujahr <= 1972 || (Baujahr <= 1990 && Ost)
            : Baujahr <= 1918 ||
              (Baujahr >= 1950 &&
                Baujahr <= 2002 &&
                (Baujahr < 1973 || Baujahr > 1990 || !Ost));
        expect(visible.has(component.specialQuestion)).toBe(applicable);
        expect(visible.has(component.question)).toBe(!applicable);
        expect(getMerkmalStates(answers, visible)[component.merkmal]).toBe(
          applicable ? "unchecked" : "checked",
        );
      },
    );

    test.each(ALL_VERTRAGSDATUM.slice(1))(
      "later edition %s ignores the 2015 Sondermerkmal",
      (Vertragsdatum) => {
        const answers: FinalAnswers = {
          ...baseAnswers,
          Vertragsdatum: Vertragsdatum as FinalAnswers["Vertragsdatum"],
          [component.specialQuestion]: "Ja",
          [component.question]: "Ja",
        };
        const visible = getVisibleQuestionAliases(answers);
        expect(visible.has(component.question)).toBe(
          component.question === "Küche hat Kühlschrank",
        );
        expect(getSondermerkmalStates(answers, visible)).toBeUndefined();
        expect(answersToCalculationContext(answers, visible)).toBeDefined();
      },
    );
  });
}

function vergleichsmiete(answers: FinalAnswers) {
  const ctx = answersToCalculationContext(
    answers,
    getVisibleQuestionAliases(answers),
  );
  expect(ctx).toBeDefined();
  return getWorstBestOrtsueblicheVergleichsmiete(ctx!)!;
}

for (const component of components) {
  test.each(choices)(
    `${component.question}: uncertain Sondermerkmal with ordinary answer %s has only feasible rent bounds`,
    (ordinary) => {
      const answers: FinalAnswers = {
        ...baseAnswers,
        [component.question]: ordinary,
        // Balance the component with a negative feature, so counting it changes
        // the group from negative to neutral (and cannot be hidden by the cap).
        ...(component.question === "Bad hat Einhebelmischbatterie"
          ? { "Bad hat Duschmöglichkeit": "Nein" as const }
          : { "Küche hat Spüle": "Nein" as const }),
      };
      const ja = vergleichsmiete({
        ...answers,
        [component.specialQuestion]: "Ja",
      });
      const nein = vergleichsmiete({
        ...answers,
        [component.specialQuestion]: "Nein",
      });
      expect(
        vergleichsmiete({
          ...answers,
          [component.specialQuestion]: "Nicht sicher",
        }),
      ).toEqual({
        best: Math.min(ja.best, nein.best),
        worst: Math.max(ja.worst, nein.worst),
      });
    },
  );
}

test("both uncertain Sondermerkmale use the bounds of the four feasible combinations", () => {
  const answers: FinalAnswers = {
    ...baseAnswers,
    "Bad hat Einhebelmischbatterie": "Ja",
    "Küche hat Kühlschrank": "Ja",
    "Bad hat Duschmöglichkeit": "Nein",
    "Küche hat Spüle": "Nein",
  };
  const alternatives = ["Ja", "Nein"].flatMap((bad) =>
    ["Ja", "Nein"].map((kueche) =>
      vergleichsmiete({
        ...answers,
        "Sondermerkmal Modernes Bad": bad as "Ja" | "Nein",
        "Sondermerkmal Moderne Küche": kueche as "Ja" | "Nein",
      }),
    ),
  );
  expect(
    vergleichsmiete({
      ...answers,
      "Sondermerkmal Modernes Bad": "Nicht sicher",
      "Sondermerkmal Moderne Küche": "Nicht sicher",
    }),
  ).toEqual({
    best: Math.min(...alternatives.map((x) => x.best)),
    worst: Math.max(...alternatives.map((x) => x.worst)),
  });
});

// 2015, bis 1918, mittlere Wohnlage, 60–90 m²: [5.84, 4.55, 8.10].
// Either +20% of the upper span (0.452), or the Sondermerkmal alone.
test.each([
  {
    question: "Bad hat Einhebelmischbatterie",
    special: "Sondermerkmal Modernes Bad",
    expected: { best: 6.18, worst: 6.29 },
  },
  {
    question: "Küche hat Kühlschrank",
    special: "Sondermerkmal Moderne Küche",
    expected: { best: 6.29, worst: 7.21 },
  },
])(
  "$question: fixed rent bounds exclude double credit",
  ({ question, special, expected }) => {
    expect(
      vergleichsmiete({
        ...baseAnswers,
        [question]: "Ja",
        [special]: "Nicht sicher",
      }),
    ).toEqual(expected);
  },
);
