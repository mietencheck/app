import { ungroup } from "flow-machine";
import { describe, expect, test } from "vitest";

import { strassenDataRawToAdressen } from "~/components/AdresseForm/search";

import {
  FinalAnswers,
  flowMachine,
  getVisibleQuestionAliases,
} from "./flow-machine";
import { applyDerivedAnswers } from "./flow-machine-derived-answers";
import {
  MERKMAL_RESET_ANSWERS,
  SCHNELLTEST_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "./mappings/answer-reset";

describe("Exits", () => {
  test.each([
    { Ausnahmen: ["Sozialwohnung"] as never }, // TODO: fix FM types
    // {
    //   Qm: 39,
    //   Baujahr: "1991-2002",
    //   Vertragsdatum: "2022-2024",
    // }, // TODO: fix
  ] satisfies FinalAnswers[])("%o", (answers) => {
    const steps = ungroup(
      flowMachine.run(flowMachine.answers(answers as never).state),
    );
    expect(steps.at(-1)?.type).toBe("Exit");
  });

  test("Exit: Keine Wohnlage gefunden when address lacks data for contract year", () => {
    const adresse = JSON.stringify({
      plz: "10115",
      strasse: "Teststraße",
      nummer: "1",
      lage: {
        "2026": { wohnlage: "mittel", ost: false },
      },
    });

    const state = applyDerivedAnswers({
      Typ: "Miete",
      Adresse: adresse,
      Unterschrieben: "Ja",
      Mietart: "Normal",
      Vertragsdatum: "2022-2024",
    });

    expect(state.Wohnlage).toBeNull();

    const steps = ungroup(flowMachine.run(state));
    expect(steps.at(-1)).toMatchObject({
      type: "Exit",
      alias: "Exit: Keine Wohnlage gefunden",
    });
  });

  describe('Wohnlage code 3 ("ohne") in the Straßenverzeichnis 2017', () => {
    const [adresse] = strassenDataRawToAdressen("Teststraße", {
      "10115": { "1": { "2": [3, 1], "11": [1, 1] } },
    });

    test("signed 2016-2018 contracts exit with Keine Wohnlage gefunden", () => {
      const state = applyDerivedAnswers({
        Typ: "Miete",
        Adresse: JSON.stringify(adresse),
        Unterschrieben: "Ja",
        Mietart: "Normal",
        Vertragsdatum: "2016-2018",
      });

      expect(state.Wohnlage).toBeNull();
      expect(ungroup(flowMachine.run(state)).at(-1)).toMatchObject({
        type: "Exit",
        alias: "Exit: Keine Wohnlage gefunden",
      });
    });

    test("unsigned contracts use the Mietspiegel 2026 Wohnlage instead", () => {
      const state = applyDerivedAnswers({
        Typ: "Miete",
        Adresse: JSON.stringify(adresse),
        Unterschrieben: "Nein",
        Mietart: "Normal",
      });

      expect(state).toMatchObject({
        Vertragsdatum: ">2026",
        Wohnlage: "mittel",
        Ost: true,
      });
    });
  });
});

describe("Bad hat bodengleiche Dusche", () => {
  const isAsked = (answers: Record<string, unknown>) =>
    getVisibleQuestionAliases({
      ...SCHNELLTEST_RESET_ANSWERS,
      ...MERKMAL_RESET_ANSWERS,
      ...SONDERMERKMAL_RESET_ANSWERS,
      ...answers,
    } as FinalAnswers).has("Bad hat bodengleiche Dusche");

  test("is asked for Mietspiegel 2024 contracts", () => {
    expect(isAsked({ Vertragsdatum: "2024-2026" })).toBe(true);
  });

  // Known flow gap: the Merkmal is in Mietspiegel 2026 too, but flow.fm.json
  // only asks the question for Vertragsdatum 2024-2026. Fix it in the floma.io
  // editor, then turn these into regular tests.
  test.fails.each([
    { Unterschrieben: "Ja", Vertragsdatum: ">2026" },
    { Unterschrieben: "Nein" },
  ])("is asked for Mietspiegel 2026 contracts (%o)", (answers) => {
    expect(isAsked(answers)).toBe(true);
  });
});
