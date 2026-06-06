import { ungroup } from "flow-machine";
import { describe, expect, test } from "vitest";

import { FinalAnswers, flowMachine } from "./flow-machine";
import { applyDerivedAnswers } from "./flow-machine-derived-answers";

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
});
