import { expect, test } from "vitest";

import { hash } from "~/l10n";

import EN from "../../public/locales/en.json";
import { getMerkmalStates, getSondermerkmalStates } from "./api";
import { FinalAnswers, getVisibleQuestionAliases } from "./flow-machine";
import { questionsByAlias } from "./flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "./mappings/answer-reset";

const questions = [
  "Bad mindestens 4qm",
  "Sondermerkmal Badezimmer mindestens 4qm",
] as const;

for (const current of questions) {
  test(`${current}: question includes exactly four square metres`, () => {
    expect(questionsByAlias.get(current)?.text).toBe(
      "Gibt es ein Badezimmer mit mindestens 4 m² Grundfläche?",
    );
    const strings: Record<string, string> = EN.strings;
    expect(strings[hash(questionsByAlias.get(current)!.text)]).toBe(
      "Is there a bathroom with at least 4 m² of floor area?",
    );
  });
}

const base = {
  ...MERKMAL_RESET_ANSWERS,
  ...SONDERMERKMAL_RESET_ANSWERS,
  Typ: "Miete",
  Unterschrieben: "Ja",
  Mietart: "Normal",
  Vertragsdatum: ">2026",
  Baujahr: 1930,
  Wohnlage: "mittel",
  Ost: false,
  Qm: 60,
  "Wohnung hat Sammelheizung": "Ja",
  "Badezimmer in Wohnung": "Ja",
  "Wohnung hat Balkon": "Ja",
} as FinalAnswers;

test.each([3.99, 4, 4.01])(
  "Bad %s m² maps through the inclusive question",
  (grundflaeche) => {
    const answers = {
      ...base,
      "Bad mindestens 4qm": grundflaeche >= 4 ? "Ja" : "Nein",
    } as FinalAnswers;
    expect(
      getMerkmalStates(answers, getVisibleQuestionAliases(answers))[
        "[Bad-] Bad ist klein"
      ],
    ).toBe(grundflaeche < 4 ? "checked" : "unchecked");
  },
);

test.each([3.99, 4, 4.01])(
  "2015 Sondermerkmal: Bad %s m² uses the same threshold",
  (grundflaeche) => {
    const answers = {
      ...base,
      Vertragsdatum: "2015-2016",
      Baujahr: 2000,
      "Sondermerkmal Badezimmer mindestens 4qm":
        grundflaeche >= 4 ? "Ja" : "Nein",
    } as FinalAnswers;
    expect(
      getSondermerkmalStates(answers, getVisibleQuestionAliases(answers))![
        "[Sondermerkmal] Kleines Bad"
      ],
    ).toBe(grundflaeche < 4 ? "checked" : "unchecked");
  },
);
