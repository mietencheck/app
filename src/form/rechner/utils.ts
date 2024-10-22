import { entries, fromEntries, keys } from "remeda";

import { LageInfo, LageInfoByJahr } from "../adresse/types";
import { FinalAnswers } from "../flow-machine";

// Linear intERPolation
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type FieldAnswers = {
  [Key in keyof FinalAnswers]?: FinalAnswers[Key];
};

export type MerkmalState = "checked" | "maybe" | "unchecked";

export function checkMerkmalState(
  fieldAnswers: FieldAnswers | FieldAnswers[],
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): MerkmalState {
  fieldAnswers = Array.isArray(fieldAnswers) ? fieldAnswers : [fieldAnswers];

  if (
    fieldAnswers.some((a) =>
      entries(a).every(
        ([alias, v]) =>
          visibleQuestionAliases.has(alias) && answers[alias] == v,
      ),
    )
  )
    return "checked";
  if (
    fieldAnswers.some((a) =>
      keys(a).some(
        (alias) =>
          visibleQuestionAliases.has(alias) &&
          (answers[alias] == "Nicht sicher" || answers[alias] == undefined),
      ),
    )
  ) {
    return "maybe";
  }
  return "unchecked";
}

export const buildSameLageInfo = (lage: LageInfo): LageInfoByJahr =>
  fromEntries(["2015", "2017", "2019", "2021", "2023"].map((s) => [s, lage]));
