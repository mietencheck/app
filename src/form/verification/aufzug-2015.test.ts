import { expect, test } from "vitest";

import { getMerkmalStates, getSondermerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";

import { BASE_ANSWERS, evaluateAnswers } from "./flow-paths";

const antworten = ["Ja", "Nein", "Nicht sicher"] as const;
const positiveFrage = "Gebäude hat <5 Stockwerke und Fahrstuhl";
const negativeFrage = "Gebäude hat >=5 Stockwerke und kein Fahrstuhl";
const positivesMerkmal =
  "[Gebäude+] Gebäude hat Aufzug bei weniger als fünf Geschossen";
const negativesMerkmal =
  "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug";

function evaluate(answers: Record<string, unknown>) {
  const result = evaluateAnswers({
    ...BASE_ANSWERS,
    ...MERKMAL_RESET_ANSWERS,
    ...SONDERMERKMAL_RESET_ANSWERS,
    Vertragsdatum: "2015-2016",
    ...answers,
  });
  expect(result.lastStep?.type).not.toBe("Exit");
  return {
    ...result,
    merkmale: getMerkmalStates(result.answers as FinalAnswers, result.visible),
    sondermerkmale: getSondermerkmalStates(
      result.answers as FinalAnswers,
      result.visible,
    ),
  };
}

// Mietspiegel 2015, printed pp.15/21: the lift Sondermerkmal is limited
// to bis 1918; the ordinary positive Merkmal must not overlap with it.
test.each(
  [1900, 1918, 1919, 1950].flatMap((baujahr) =>
    antworten.flatMap((sondermerkmal) =>
      antworten.flatMap((aufzug) =>
        antworten.map((obergeschosse) => ({
          baujahr,
          sondermerkmal,
          aufzug,
          obergeschosse,
        })),
      ),
    ),
  ),
)(
  "Baujahr $baujahr, Sondermerkmal $sondermerkmal, Aufzug $aufzug, Gebäudehöhe $obergeschosse",
  ({ baujahr, sondermerkmal, aufzug, obergeschosse }) => {
    const result = evaluate({
      Baujahr: baujahr,
      "Sondermerkmal Aufzug": sondermerkmal,
      "Gebäude hat Fahrstuhl": aufzug,
      [positiveFrage]: obergeschosse,
    });
    const ordinaryEligible = baujahr >= 1919 && aufzug !== "Nein";
    expect(result.visible.has(positiveFrage)).toBe(ordinaryEligible);
    expect(result.merkmale[positivesMerkmal]).toBe(
      !ordinaryEligible || obergeschosse === "Nein"
        ? "unchecked"
        : aufzug === "Ja" && obergeschosse === "Ja"
          ? "checked"
          : "maybe",
    );
    expect(result.visible.has("Sondermerkmal Aufzug")).toBe(baujahr <= 1918);
    expect(result.sondermerkmale?.["[Sondermerkmal] Aufzug im Haus"]).toBe(
      baujahr >= 1919 || sondermerkmal === "Nein"
        ? "unchecked"
        : sondermerkmal === "Ja"
          ? "checked"
          : "maybe",
    );
  },
);

// The independent fifth-floor/no-lift question remains available before
// and after 1919, including uncertain lift and floor answers.
test.each(
  [1900, 1918, 1919, 1949, 1950, 2010].flatMap((baujahr) =>
    ["Nein", "Nicht sicher"].flatMap((sondermerkmal) =>
      antworten.flatMap((aufzug) =>
        antworten.map((geschoss) => ({
          baujahr,
          sondermerkmal,
          aufzug,
          geschoss,
        })),
      ),
    ),
  ),
)(
  "negative: Baujahr $baujahr, Sondermerkmal $sondermerkmal, Aufzug $aufzug, Geschoss $geschoss",
  ({ baujahr, sondermerkmal, aufzug, geschoss }) => {
    const result = evaluate({
      Baujahr: baujahr,
      "Sondermerkmal Aufzug": sondermerkmal,
      "Gebäude hat Fahrstuhl": aufzug,
      [negativeFrage]: geschoss,
    });
    expect(result.visible.has(negativeFrage)).toBe(aufzug !== "Ja");
    expect(result.merkmale[negativesMerkmal]).toBe(
      aufzug === "Ja" || geschoss === "Nein"
        ? "unchecked"
        : aufzug === "Nein" && geschoss === "Ja"
          ? "checked"
          : "maybe",
    );
  },
);
