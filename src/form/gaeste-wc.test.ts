import { ungroup } from "flow-machine";
import { describe, expect, test } from "vitest";

import { hash } from "~/l10n";

import EN from "../../public/locales/en.json";
import { getMerkmalStates } from "./api";
import {
  FinalAnswers,
  flowMachine,
  getVisibleQuestionAliases,
} from "./flow-machine";
import {
  MERKMAL_RESET_ANSWERS,
  SCHNELLTEST_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "./mappings/answer-reset";

const grundAntworten = {
  ...SCHNELLTEST_RESET_ANSWERS,
  ...MERKMAL_RESET_ANSWERS,
  ...SONDERMERKMAL_RESET_ANSWERS,
  Typ: "Miete",
} satisfies FinalAnswers;

function fragen(answers: FinalAnswers) {
  return ungroup(
    flowMachine.run(flowMachine.answers(answers as never).state),
  ).filter((step) => step.type === "Question");
}

function frage(answers: FinalAnswers, alias: string) {
  const matches = fragen(answers).filter((step) => step.alias === alias);
  expect(matches).toHaveLength(1);
  return matches[0];
}

function merkmale(answers: FinalAnswers) {
  return getMerkmalStates(answers, getVisibleQuestionAliases(answers));
}

const aktuelleJahre = ["2024-2026", ">2026"] as const;
const antworten = [
  ["Ja", "checked"],
  ["Nein", "unchecked"],
  ["Nicht sicher", "maybe"],
] as const;

describe.each(aktuelleJahre)("Gäste-WCs im Mietspiegel %s", (Vertragsdatum) => {
  const basis = { ...grundAntworten, Vertragsdatum };

  test("an ordinary guest WC with an old heater does not affect the main WC advantages", () => {
    // Main bathroom: heated normally, wall-hung WC; second WC: guest WC
    // with an ordinary toilet and only an electric radiant heater.
    const answers = {
      ...basis,
      "Bad ohne Heizung": "Nein",
      "Bad mit alter Heizung": "Nein",
      "Bad hat wandhängendes WC": "Ja",
      "Mehrere WCs": "Ja",
    } satisfies FinalAnswers;
    for (const alias of ["Bad mit alter Heizung", "Bad hat wandhängendes WC"]) {
      const question = frage(answers, alias);
      expect(question.text).toContain("außer Gäste-WCs");
      expect(question.info).toContain("nicht auf Gäste-WCs");
    }
    expect(frage(answers, "Mehrere WCs").info ?? "").not.toContain("Gäste");
    expect(frage(answers, "Mehrere WCs").text).not.toContain("außer");
    expect(merkmale(answers)).toMatchObject({
      "[Bad-] Bad ohne Heizung": "unchecked",
      "[Bad+] Bad hat wandhängendes WC": "checked",
      "[Bad+] Zweites WC oder Bad/WC getrennt": "checked",
    });
  });

  test.each(antworten)(
    "old heating outside guest WCs: %s → %s",
    (answer, state) => {
      const answers = { ...basis, "Bad mit alter Heizung": answer };
      expect(frage(answers, "Bad mit alter Heizung").text).toContain(
        "außer Gäste-WCs",
      );
      expect(merkmale(answers)["[Bad-] Bad ohne Heizung"]).toBe(state);
    },
  );

  test.each([2001, 2002, 2003])(
    "WC scope and Baujahr boundary at %s",
    (Baujahr) => {
      const answers = { ...basis, Baujahr };
      const wandWc = fragen(answers).find(
        (q) => q.alias === "Bad hat wandhängendes WC",
      );
      expect(Boolean(wandWc)).toBe(Baujahr < 2002);
      if (wandWc) expect(wandWc.text).toContain("außer Gäste-WCs");
      expect(frage(answers, "Bad hat hochwertiges Stand-WC").text).toContain(
        "außer Gäste-WCs",
      );
    },
  );

  test.each(antworten)(
    "main WC answer %s → %s, with an ordinary guest WC",
    (answer, state) => {
      for (const alias of [
        "Bad hat wandhängendes WC",
        "Bad hat hochwertiges Stand-WC",
      ] as const) {
        const answers = { ...basis, [alias]: answer };
        expect(frage(answers, alias).text).toContain("außer Gäste-WCs");
        expect(merkmale(answers)["[Bad+] Bad hat wandhängendes WC"]).toBe(
          state,
        );
      }
    },
  );

  test("all new guest WC copy has an English translation", () => {
    for (const alias of [
      "Bad mit alter Heizung",
      "Bad hat wandhängendes WC",
      "Bad hat hochwertiges Stand-WC",
    ]) {
      const question = frage(basis, alias);
      for (const text of [question.text, question.info!]) {
        const translation = EN.strings[hash(text) as keyof typeof EN.strings];
        expect(translation).toContain("guest toilet");
        expect(translation).not.toContain("[DE]");
      }
    }
  });
});

test.each([
  "2015-2016",
  "2016-2018",
  "2018-2020",
  "2020-2022",
  "2022-2024",
] as const)(
  "Mietspiegel %s retains the earlier WC and heating scope",
  (Vertragsdatum) => {
    const answers = { ...grundAntworten, Vertragsdatum };
    expect(frage(answers, "Bad mit alter Heizung")).toMatchObject({
      id: "6w0nq",
      text: "Gibt es ein Badezimmer oder WC, welches nur mit einer Holz-/Kohleheizung oder einem Elektroheizstrahler beheizbar ist?",
      info: null,
    });
    expect(frage(answers, "Bad hat wandhängendes WC")).toMatchObject({
      text: "Sind alle Toiletten wandhängend mit Spülkasten in der Wand (wie z.B. auf diesem Bild)?",
      info: null,
    });
    expect(
      fragen(answers).some((q) => q.alias === "Bad hat hochwertiges Stand-WC"),
    ).toBe(false);
    expect(
      merkmale({ ...answers, "Bad mit alter Heizung": "Ja" })[
        "[Bad-] Bad ohne Heizung"
      ],
    ).toBe("checked");
  },
);
