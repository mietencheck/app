import { expect, test } from "vitest";

import { hash } from "~/l10n";

import english from "../../../public/locales/en.json";
import { getMerkmalStates } from "../api";
import { FinalAnswers } from "../flow-machine-runtime";
import {
  MERKMAL_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "../mappings/answer-reset";
import {
  BASE_ANSWERS,
  contractScenarios,
  evaluateAnswers,
  questionNodeById,
} from "./flow-paths";

const editions = contractScenarios();
const choices = [
  { answer: "Ja", expected: "checked" },
  { answer: "Nein", expected: "unchecked" },
  { answer: "Nicht sicher", expected: "maybe" },
];

// No Baujahr restriction is attached to these source clauses. Exercise old
// and newer buildings, including either side of the 1990/1991 boundary.
const scenarios = editions.flatMap((edition) =>
  [1918, 1990, 1991, 2010].flatMap((baujahr) =>
    choices.map((choice) => ({ ...edition, baujahr, ...choice })),
  ),
);

function translated(text: string) {
  const key = hash(text);
  const value = english.strings[key as keyof typeof english.strings];
  expect(value).toBeTruthy();
  expect(value).not.toContain("[DE]");
  return value;
}

test.each(scenarios)(
  "$label, Baujahr $baujahr, $answer: rooms and edition-specific parking",
  ({ jahr, pinned, baujahr, answer, expected }) => {
    const result = evaluateAnswers({
      ...BASE_ANSWERS,
      ...MERKMAL_RESET_ANSWERS,
      ...SONDERMERKMAL_RESET_ANSWERS,
      ...pinned,
      Baujahr: baujahr,
      "Gebäude hat zusätzliche Räume": answer,
      "Gebäude hat Parkplatz": answer,
      "Wohnumfeld hat Parkplatz": answer,
    });
    expect(result.lastStep?.type).not.toBe("Exit");
    const states = getMerkmalStates(
      result.answers as FinalAnswers,
      result.visible,
    );
    const room = questionNodeById.get(
      result.nodeIds.get("Gebäude hat zusätzliche Räume")!,
    )!;
    expect(room.text).toContain("fußläufiger Entfernung");
    expect(room.text).toContain("in angemessenem Umfang nutzen");
    expect(room.info).toContain("sowohl");
    expect(translated(room.text)).toContain("within walking distance");
    expect(translated(room.text)).toContain("reasonable extent");
    expect(translated(room.info!)).toContain("Only answer Yes if");
    expect(states["[Gebäude+] Gebäude hat zusätzliche nutzbare Räume"]).toBe(
      expected,
    );

    const oldParking = jahr === "2015";
    expect(result.visible.has("Gebäude hat Parkplatz")).toBe(oldParking);
    expect(result.visible.has("Wohnumfeld hat Parkplatz")).toBe(!oldParking);
    expect(states["[Gebäude+] Gebäude hat Auto Stellplatz"]).toBe(
      oldParking ? expected : undefined,
    );
    expect(
      states["[Umfeld+] Vom Vermieter zur Verfügung gestellter Parkplatz"],
    ).toBe(oldParking ? undefined : expected);
    const parking = questionNodeById.get(
      result.nodeIds.get(
        oldParking ? "Gebäude hat Parkplatz" : "Wohnumfeld hat Parkplatz",
      )!,
    )!;
    if (oldParking) {
      expect(parking.text).toContain("ohne zusätzliche Kosten");
      expect(parking.text).toContain("zur Wohnung gehört");
      expect(parking.text).not.toContain("ausreichend dimensioniert");
    } else {
      expect(parking.text).toContain("in der Nähe der Wohnung");
      expect(parking.info).toContain("kostenpflichtig");
      expect(translated(parking.info!)).toBeTruthy();
      expect(parking.text.includes("ausreichend dimensioniert")).toBe(
        Number(jahr) >= 2019,
      );
      expect(translated(parking.text).includes("sufficient capacity")).toBe(
        Number(jahr) >= 2019,
      );
    }
  },
);
