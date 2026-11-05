import { describe, expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import {
  MERKMAL_RESET_ANSWERS,
  SCHNELLTEST_RESET_ANSWERS,
  SONDERMERKMAL_RESET_ANSWERS,
} from "~/form/mappings/answer-reset";

const vertragsdaten = [
  "2015-2016",
  "2016-2018",
  "2018-2020",
  "2020-2022",
  "2022-2024",
  "2024-2026",
  ">2026",
] as const;

const merkmal = "[Umfeld-] Lage in vernachlässigter Umgebung";
const frage = "Wohnumfeld ist stark vernachlässigt";

// 2015 p. 22 / 2017 p. 17: only einfache Wohnlage.
// 2019-2024: all Wohnlagen; 2026: the Merkmal is no longer listed.
describe.each(vertragsdaten)("Vertragsdatum %s", (vertragsdatum) => {
  describe.each(["einfach", "mittel", "gut"] as const)(
    "Wohnlage %s",
    (wohnlage) => {
      test.each(["Ja", "Nein", "Nicht sicher"] as const)(
        "vernachlässigte Umgebung: %s",
        (antwort) => {
          const answers: FinalAnswers = {
            ...SCHNELLTEST_RESET_ANSWERS,
            ...MERKMAL_RESET_ANSWERS,
            ...SONDERMERKMAL_RESET_ANSWERS,
            Typ: "Miete",
            Vertragsdatum: vertragsdatum,
            Wohnlage: wohnlage,
            [frage]: antwort,
          };
          const sichtbar =
            vertragsdatum !== ">2026" &&
            (!["2015-2016", "2016-2018"].includes(vertragsdatum) ||
              wohnlage === "einfach");
          const visibleQuestionAliases = getVisibleQuestionAliases(answers);
          expect(visibleQuestionAliases.has(frage)).toBe(sichtbar);

          const states = getMerkmalStates(answers, visibleQuestionAliases);
          if (vertragsdatum === ">2026") {
            expect(states).not.toHaveProperty(merkmal);
          } else {
            expect(states[merkmal]).toBe(
              !sichtbar || antwort === "Nein"
                ? "unchecked"
                : antwort === "Ja"
                  ? "checked"
                  : "maybe",
            );
          }
        },
      );
    },
  );
});
