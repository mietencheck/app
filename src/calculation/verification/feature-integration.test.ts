import { ungroup } from "flow-machine";
import { expect, test } from "vitest";

import { answersToCalculationContext } from "~/form/calculation-context";
import {
  FinalAnswers,
  flowMachine,
  getVisibleQuestionAliases,
} from "~/form/flow-machine";
import { applyDerivedAnswers } from "~/form/flow-machine-derived-answers";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";

import { getWorstBestMerkmalStateByMerkmalGruppe } from "../spanneneinordnung";

const contracts = [
  "2015-2016",
  "2016-2018",
  "2018-2020",
  "2020-2022",
  "2022-2024",
  "2024-2026",
  ">2026",
] as const;

// Energy examples and the exclusive alternatives are specified in section
// 11.4 A (2015), 10.4 A (2017-2026). Symbols are UI answer aliases for the
// cumulative thresholds; these tests do not certify the displayed thresholds.
for (const contract of contracts) {
  for (const input of [
    "Energieverbrauchskennwert",
    "Energiebedarfskennwert",
  ] as const) {
    test.each(["---", "--", "-", "0", "+", "++", "+++"])(
      `${contract}/${input}/%s: cumulative weight and exclusive alternatives`,
      (symbol) => {
        const answers = {
          ...MERKMAL_RESET_ANSWERS,
          ...SONDERMERKMAL_RESET_ANSWERS,
          Typ: "Miete",
          Unterschrieben: "Ja",
          Vertragsdatum: contract,
          Baujahr: 1900,
          Wohnlage: "einfach",
          Ost: false,
          Qm: 60,
          "Wohnung hat Sammelheizung": "Ja",
          "Badezimmer in Wohnung": "Ja",
          "Wohnung hat Balkon": "Ja",
          "Kennt Energieverbrauch oder Energiebedarf":
            input === "Energieverbrauchskennwert"
              ? "Energieverbrauchswert"
              : "Ernergiebedarfswert",
          [input]: symbol,
          // Stale answers for the alternative estimation method must be hidden.
          "Gebäude hat gute Wärmedämmung": "Ja",
          "Gebäude hat moderne Heizanlage": "Ja",
          "Gebäude hat schlechte Wärmedämmung": "Ja",
          "Gebäude hat Heizanlage mit ungünstigem Wirkungsgrad": "Ja",
        } as FinalAnswers;
        const ctx = answersToCalculationContext(
          answers,
          getVisibleQuestionAliases(answers),
        )!;
        const count =
          symbol === "0"
            ? 0
            : symbol.length * (symbol.startsWith("-") ? -1 : 1);
        expect(getWorstBestMerkmalStateByMerkmalGruppe(ctx).Gebäude).toEqual({
          best: count,
          worst: count,
        });
      },
    );
  }
}

test.each([
  { exception: "Sozialwohnung", exit: "Exit: Sozialwohnung" },
  {
    exception: "Reihenhaus",
    exit: "Exit: Ein-/Zweifamilienhäuser oder Reihenhäuser",
  },
  { exception: "Wohnung ohne WC ", exit: "Exit: Wohnung ohne WC" },
])(
  "unsupported housing: $exception exits the questionnaire",
  ({ exception, exit }) => {
    const answers = {
      Typ: "Miete",
      Unterschrieben: "Ja",
      Mietart: "Normal",
      Vertragsdatum: ">2026",
      Ausnahmen: [exception],
      Baujahr: 1900,
      Wohnlage: "einfach",
      Qm: 60,
    };
    const steps = ungroup(
      flowMachine.run(flowMachine.answers(answers as never).state),
    );
    expect(steps.at(-1)).toMatchObject({ type: "Exit", alias: exit });
  },
);

test("a newly constructed flat follows the new-build exit after deriving the construction year", () => {
  const state = applyDerivedAnswers({
    Typ: "Miete",
    Unterschrieben: "Ja",
    Mietart: "Normal",
    Vertragsdatum: ">2026",
    "Baujahr vor 1991": "1991-",
    "Baujahr ab 1991": 2020,
    Wohnlage: "einfach",
    Qm: 60,
    Ausnahmen: [],
  });
  expect(
    ungroup(
      flowMachine.run(
        flowMachine.answers({ ...state, Wohnlage: "einfach" }).state,
      ),
    ).at(-1),
  ).toMatchObject({ type: "Exit", alias: "Exit: Neubauwohnung" });
});
