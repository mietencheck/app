import { entries } from "remeda";

import { FinalAnswers } from "~/2024/form/flow-machine";
import {
  AnswerMerkmalStateMapping,
  Condition,
} from "~/2024/form/mappings/merkmale";

export const mapAnswerToMerkmalState = (
  merkmalStateMapping: AnswerMerkmalStateMapping,
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const { checked_if } = merkmalStateMapping;

  // Condition Groups
  if ("conditions" in checked_if && "logic" in checked_if) {
    if (checked_if.logic == "and") {
      // Merkmal is 'checked' if all answers match condition
      const isChecked = (checked_if.conditions as Condition[]).every(
        (condition: Condition) =>
          entries
            .strict(condition)
            .every(
              ([alias, value]) =>
                visibleQuestionAliases.has(alias) && answers[alias] == value,
            ),
      );
      if (isChecked) return "checked";

      // Merkmal is 'maybe' if all answers match value or are "Nicht sicher"
      const isMaybe = (checked_if.conditions as Condition[]).every(
        (condition: Condition) =>
          entries
            .strict(condition)
            .every(
              ([alias, value]) =>
                visibleQuestionAliases.has(alias) &&
                (answers[alias] == value || answers[alias] == "Nicht sicher"),
            ),
      );
      if (isMaybe) return "maybe";
    }

    if (checked_if.logic == "or") {
      // Merkmal is 'checked' if at least 1 answer matches condition
      const isChecked = (checked_if.conditions as Condition[]).some(
        (condition: Condition) =>
          entries
            .strict(condition)
            .every(
              ([alias, value]) =>
                visibleQuestionAliases.has(alias) && answers[alias] == value,
            ),
      );
      if (isChecked) return "checked";

      // Merkmal is 'maybe' if at least 1 answer is "Nicht sicher" or undefined
      const isMaybe = (checked_if.conditions as Condition[]).some(
        (condition: Condition) =>
          entries
            .strict(condition)
            .some(
              ([alias]) =>
                visibleQuestionAliases.has(alias) &&
                (answers[alias] == "Nicht sicher" ||
                  answers[alias] == undefined),
            ),
      );
      if (isMaybe) return "maybe";
    }
    return "unchecked";
  } else {
    const alias = Object.keys(checked_if)[0] as keyof FinalAnswers;
    const value = Object.values(checked_if)[0] as Condition;

    const isChecked =
      visibleQuestionAliases.has(alias) && answers[alias] == value;
    if (isChecked) return "checked";

    const isMaybe =
      visibleQuestionAliases.has(alias) &&
      (answers[alias] == "Nicht sicher" || answers[alias] == undefined);
    if (isMaybe) return "maybe";

    return "unchecked";
  }
};
