import { ungroup } from "flow-machine";
import { describe, expect, test } from "vitest";

import { getMerkmalStates } from "./api";
import { getVisibleQuestionAliases } from "./flow-machine-evaluation";
import { FinalAnswers, flowMachine } from "./flow-machine-runtime";
import { SCHNELLTEST_RESET_ANSWERS } from "./mappings/answer-reset";
import { mapMerkmalStateToMerkmalGruppen } from "./utils/mapMerkmalStateToMerkmalGruppen";

const raum = "Gebäude hat Fahrradabstellraum";
const stellplaetze = "Gebäude hat Fahrradstellplätze mit Anschließmöglichkeit";
const merkmal = "[Gebäude+] Gebäude hat Fahrradabstellraum/Fahrradstellplätze";

function fahrradFragen(answers: FinalAnswers) {
  return ungroup(flowMachine.run(flowMachine.answers(answers).state)).filter(
    (step) =>
      step.type === "Question" && step.alias?.startsWith("Gebäude hat Fahrrad"),
  );
}

describe("Fahrradabstellraum und Stellplätze im Mietspiegel 2017", () => {
  const frisch: FinalAnswers = {
    ...SCHNELLTEST_RESET_ANSWERS,
    Typ: "Miete",
    Vertragsdatum: "2016-2018",
  };

  test("asks a fresh user about the room before asking about outdoor spaces", () => {
    expect(fahrradFragen(frisch)).toMatchObject([{ id: "lgcxi", alias: raum }]);
    expect(
      getMerkmalStates(frisch, getVisibleQuestionAliases(frisch))[merkmal],
    ).toBe("maybe");
  });

  test.each([
    ["Ja", undefined, "checked"],
    ["Ja", "Ja", "checked"],
    ["Ja", "Nein", "checked"],
    ["Ja", "Nicht sicher", "checked"],
    ["Nein", undefined, "maybe"],
    ["Nein", "Ja", "checked"],
    ["Nein", "Nein", "unchecked"],
    ["Nein", "Nicht sicher", "maybe"],
    ["Nicht sicher", undefined, "maybe"],
    ["Nicht sicher", "Ja", "checked"],
    ["Nicht sicher", "Nein", "maybe"],
    ["Nicht sicher", "Nicht sicher", "maybe"],
  ] as const)(
    "room %s, outdoor spaces %s → %s",
    (raumAntwort, stellplaetzeAntwort, expected) => {
      const answers: FinalAnswers = {
        ...frisch,
        [raum]: raumAntwort,
        ...(stellplaetzeAntwort === undefined
          ? {}
          : { [stellplaetze]: stellplaetzeAntwort }),
      };
      const fragen = fahrradFragen(answers);
      expect(fragen).toMatchObject(
        raumAntwort === "Ja"
          ? [{ id: "lgcxi", alias: raum }]
          : [
              { id: "lgcxi", alias: raum },
              { id: "dfy6sf", alias: stellplaetze },
            ],
      );
      const states = getMerkmalStates(
        answers,
        getVisibleQuestionAliases(answers),
      );
      expect(states[merkmal]).toBe(expected);
      const positive =
        mapMerkmalStateToMerkmalGruppen(states).Gebäude.Wohnwerterhoehend;
      expect(
        Object.entries(positive).filter(([name]) => name.includes("Fahrrad")),
      ).toEqual([
        ["Gebäude hat Fahrradabstellraum/Fahrradstellplätze", expected],
      ]);
    },
  );

  test.each([
    ["2015-2016", "m2fbk"],
    ["2018-2020", "qqxhk"],
    ["2020-2022", "qqxhk"],
    ["2022-2024", "qqxhk"],
    ["2024-2026", "qqxhk"],
    [">2026", "qqxhk"],
  ] as const)(
    "keeps the existing room question for %s",
    (Vertragsdatum, id) => {
      const answers: FinalAnswers = {
        ...frisch,
        Vertragsdatum,
        "Gebäude hat Fahrradabstellmöglichkeit": "Nein",
      };
      expect(fahrradFragen(answers).some((step) => step.id === id)).toBe(true);
      expect(fahrradFragen(answers).some((step) => step.id === "lgcxi")).toBe(
        false,
      );
    },
  );
});
