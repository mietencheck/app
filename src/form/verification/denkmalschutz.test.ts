import { expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import { MERKMAL_RESET_ANSWERS } from "~/form/mappings/answer-reset";
import { mapAnswerToMerkmalState } from "~/form/utils/mapAnswerToMerkmalState";

import { BASE_ANSWERS, contractScenarios, evaluateAnswers } from "./flow-paths";

const ausnahme = "Denkmalschutz verhindert energetische Sanierung";
const physical = "[Gebäude-] Gebäude hat unzureichende Wärmedämmung";
const energy = [
  "[Gebäude-] Energieverbrauchskennwert größer als 170/155/145",
  "[Gebäude-] Energieverbrauchskennwert größer als 210/195",
  "[Gebäude-] Energieverbrauchskennwert größer als 250/235",
] as const;
const editions = contractScenarios().filter(({ label }) =>
  label.startsWith("unterschrieben"),
);

function evaluate(answers: Record<string, unknown>) {
  const result = evaluateAnswers({
    ...BASE_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    Baujahr: 1930,
    ...answers,
  });
  expect(result.lastStep?.type).not.toBe("Exit");
  return {
    ...result,
    states: getMerkmalStates(result.answers as FinalAnswers, result.visible),
  };
}

// All editions put this exception below the Gebäude energy box. It applies
// to its negative physical alternative and all three negative energy tiers.
for (const answer of ["Ja", "Nein", "Nicht sicher"] as const) {
  const expected = {
    Ja: "unchecked",
    Nein: "checked",
    "Nicht sicher": "maybe",
  }[answer];
  test.each(editions)(
    `$jahr: physical energy disadvantage, exception ${answer}`,
    ({ pinned }) => {
      for (const alias of [
        "Gebäude hat schlechte Wärmedämmung",
        "Gebäude hat Heizanlage mit ungünstigem Wirkungsgrad",
      ]) {
        const result = evaluate({
          ...pinned,
          [ausnahme]: answer,
          "Kennt Energieverbrauch oder Energiebedarf": "Nein",
          [alias]: "Ja",
          "Gebäude Hauseingangstür ist nicht abschließbar": "Ja",
        });
        expect(result.visible.has(ausnahme)).toBe(true);
        expect(result.states[physical]).toBe(expected);
        expect(
          result.states[
            "[Gebäude-] Gebäude Hauseingangstür ist nicht abschließbar"
          ],
        ).toBe("checked");
      }
    },
  );
  for (const kennwert of [
    "Energieverbrauchskennwert",
    "Energiebedarfskennwert",
  ] as const) {
    test.each(editions)(
      `$jahr: ${kennwert}, exception ${answer}`,
      ({ pinned }) => {
        for (const [band, count] of [
          ["-", 1],
          ["--", 2],
          ["---", 3],
        ] as const) {
          const result = evaluate({
            ...pinned,
            [ausnahme]: answer,
            "Kennt Energieverbrauch oder Energiebedarf":
              kennwert === "Energieverbrauchskennwert"
                ? "Energieverbrauchswert"
                : "Ernergiebedarfswert",
            [kennwert]: band,
          });
          energy.forEach((merkmal, i) => {
            expect(result.states[merkmal]).toBe(
              i < count ? expected : "unchecked",
            );
          });
        }
      },
    );
  }
}

test.each(editions)(
  "$jahr: positive energy tiers remain checked with confirmed exception",
  ({ pinned }) => {
    for (const kennwert of [
      "Energieverbrauchskennwert",
      "Energiebedarfskennwert",
    ] as const) {
      const result = evaluate({
        ...pinned,
        [ausnahme]: "Ja",
        "Kennt Energieverbrauch oder Energiebedarf":
          kennwert === "Energieverbrauchskennwert"
            ? "Energieverbrauchswert"
            : "Ernergiebedarfswert",
        [kennwert]: "+++",
      });
      for (const threshold of [120, 100, 80]) {
        expect(
          result.states[
            `[Gebäude+] Energieverbrauchskennwert kleiner als ${threshold}` as keyof typeof result.states
          ],
        ).toBe("checked");
      }
    }
  },
);

test.each(editions)(
  "$jahr: modern heating and additional insulation survive exception",
  ({ pinned }) => {
    const result = evaluate({
      ...pinned,
      [ausnahme]: "Ja",
      "Kennt Energieverbrauch oder Energiebedarf": "Nein",
      "Gebäude hat moderne Heizanlage": "Ja",
      "Gebäude hat gute Wärmedämmung": "Ja",
    });
    expect(
      result.states["[Gebäude+] Gebäude hat zusätzliche Wärmedämmung"],
    ).toBe("checked");
  },
);

test.each(editions)(
  "$jahr: exception has no Baujahr cutoff and does not create disadvantages",
  ({ pinned }) => {
    for (const Baujahr of [
      1983, 1984, 1987, 1988, 1994, 1995, 2008, 2009, 2014,
    ]) {
      const result = evaluate({
        ...pinned,
        Baujahr,
        [ausnahme]: "Nicht sicher",
        "Kennt Energieverbrauch oder Energiebedarf": "Nein",
      });
      expect(result.visible.has(ausnahme)).toBe(true);
      expect(result.states[physical]).toBe("unchecked");
      energy.forEach((merkmal) =>
        expect(result.states[merkmal]).toBe("unchecked"),
      );
    }
  },
);

test("only an explicit Miete exception changes an existing disadvantage", () => {
  const mapping = {
    checked_if: { "Gebäude hat schlechte Wärmedämmung": "Ja" },
    denkmalschutzAusnahme: true,
  };
  const answers: FinalAnswers = {
    Typ: "Miete",
    "Gebäude hat schlechte Wärmedämmung": "Ja",
  };
  const visible = new Set(["Gebäude hat schlechte Wärmedämmung", ausnahme]);
  expect(mapAnswerToMerkmalState(mapping, answers, visible)).toBe("checked");
  expect(
    mapAnswerToMerkmalState(
      mapping,
      { ...answers, Typ: "Mieterhöhung", [ausnahme]: "Ja" },
      visible,
    ),
  ).toBe("checked");
  expect(
    mapAnswerToMerkmalState(
      mapping,
      { ...answers, [ausnahme]: "Ja" },
      new Set(["Gebäude hat schlechte Wärmedämmung"]),
    ),
  ).toBe("checked");
  expect(
    mapAnswerToMerkmalState(
      mapping,
      {
        ...answers,
        [ausnahme]: "Nicht sicher",
        "Gebäude hat schlechte Wärmedämmung": "Nicht sicher",
      },
      visible,
    ),
  ).toBe("maybe");
});
