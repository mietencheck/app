import { ungroup } from "flow-machine";
import { describe, expect, test } from "vitest";

import { FinalAnswers, flowMachine } from "./flow-machine";

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
});
