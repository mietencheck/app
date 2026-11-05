import { expect, test } from "vitest";

import { getMerkmalStates, getSondermerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";
import { hash } from "~/l10n";

import EN from "../../../public/locales/en.json";
import {
  BASE_ANSWERS,
  contractScenarios,
  evaluateAnswers,
  questionNodeById,
} from "./flow-paths";

const fenster = "Wohnung hat Schallschutzfenster";
const sondermerkmal = "Sondermerkmal Schallschutzfenster";
const merkmal =
  "[Wohnung+] Wohnung hat Schallschutzfenster/Wärmeschutzverglasung";

// Mietspiegel 2015, printed pp.15/20: the installation boundary is part of
// the question, not a separate date input. Both copies must say "ab 1987".
test.each([
  {
    id: "g6atu",
    deutsch:
      "Sind in der Wohnung überwiegend Fenster mit Isolierverglasung (Einbau ab 1987) oder Schallschutzfenster verbaut?",
    englisch:
      "Are most of the windows in the flat fitted with double glazing (installed from 1987) or soundproof windows?",
  },
  {
    id: "d4lcxl",
    deutsch:
      "Sind in der Wohnung überwiegend Schallschutzfenster oder Isolierverglasung (Einbau ab 1987) eingebaut?",
    englisch:
      "Is the flat predominantly equipped with soundproof windows or double glazing (installed from 1987)?",
  },
])(
  "2015 $id: Isolierverglasung from 1987 in both languages",
  ({ id, deutsch, englisch }) => {
    expect(questionNodeById.get(id)?.text).toBe(deutsch);
    expect(EN.strings[hash(deutsch) as keyof typeof EN.strings]).toBe(englisch);
  },
);

test.each(
  [1918, 1919].flatMap((baujahr) =>
    ["Ja", "Nein", "Nicht sicher"].flatMap((sonderantwort) =>
      ["Ja", "Nein", "Nicht sicher"].map((antwort) => ({
        baujahr,
        sonderantwort,
        antwort,
      })),
    ),
  ),
)(
  "2015 Baujahr $baujahr, Sondermerkmal $sonderantwort, fallback $antwort: no double counting",
  ({ baujahr, sonderantwort, antwort }) => {
    const result = evaluateAnswers({
      ...BASE_ANSWERS,
      ...MERKMAL_RESET_ANSWERS,
      ...SONDERMERKMAL_RESET_ANSWERS,
      Vertragsdatum: "2015-2016",
      Baujahr: baujahr,
      [sondermerkmal]: sonderantwort,
      [fenster]: antwort,
    });
    expect(result.lastStep?.type).not.toBe("Exit");
    const answers = result.answers as FinalAnswers;
    const sondermerkmalGilt = baujahr === 1918 && sonderantwort === "Ja";
    expect(result.visible.has(sondermerkmal)).toBe(baujahr === 1918);
    expect(result.visible.has(fenster)).toBe(!sondermerkmalGilt);
    expect(getMerkmalStates(answers, result.visible)[merkmal]).toBe(
      sondermerkmalGilt || antwort === "Nein"
        ? "unchecked"
        : antwort === "Ja"
          ? "checked"
          : "maybe",
    );
    expect(
      getSondermerkmalStates(answers, result.visible)?.[
        "[Sondermerkmal] Isolierverglasung/Schallschutzfenster"
      ],
    ).toBe(
      baujahr === 1919 || sonderantwort === "Nein"
        ? "unchecked"
        : sonderantwort === "Ja"
          ? "checked"
          : "maybe",
    );
  },
);

test.each(
  contractScenarios()
    .filter(
      ({ label, jahr }) =>
        label.startsWith("unterschrieben") && jahr !== "2015",
    )
    .flatMap((edition) => {
      const grenze = edition.jahr === "2017" ? 1995 : 2002;
      return [grenze - 1, grenze].flatMap((baujahr) =>
        ["Ja", "Nein", "Nicht sicher"].map((antwort) => ({
          ...edition,
          grenze,
          baujahr,
          antwort,
        })),
      );
    }),
)(
  "$jahr Baujahr $baujahr, $antwort: later glazing rules",
  ({ pinned, grenze, baujahr, antwort }) => {
    const result = evaluateAnswers({
      ...BASE_ANSWERS,
      ...MERKMAL_RESET_ANSWERS,
      ...SONDERMERKMAL_RESET_ANSWERS,
      ...pinned,
      Baujahr: baujahr,
      [fenster]: antwort,
    });
    expect(result.lastStep?.type).not.toBe("Exit");
    expect(result.visible.has(fenster)).toBe(baujahr < grenze);
    expect(
      getMerkmalStates(result.answers as FinalAnswers, result.visible)[merkmal],
    ).toBe(
      baujahr >= grenze || antwort === "Nein"
        ? "unchecked"
        : antwort === "Ja"
          ? "checked"
          : "maybe",
    );
    if (baujahr < grenze) {
      const text = questionNodeById.get(result.nodeIds.get(fenster)!)?.text;
      expect(text).toContain("Wärmeschutzverglasung");
      expect(text).toContain(`Einbau ab ${grenze === 1995 ? 1995 : 2002}`);
    }
  },
);
