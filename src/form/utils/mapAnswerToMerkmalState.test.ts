import { expect, test } from "vitest";

import { FinalAnswers, getVisibleQuestionAliases } from "../flow-machine";
import { SCHNELLTEST_RESET_ANSWERS } from "../mappings/answer-reset";
import { AnswerMerkmalStateMapping } from "../mappings/merkmale";
import { mapAnswerToMerkmalState } from "./mapAnswerToMerkmalState";
import { MerkmalState } from "./mapMerkmalStateToMerkmalGruppen";

// Single Condition
test.each([
  ...[
    {
      mapping: { "Bad mit WC ohne Fenster": "Ja" },
      answers: { "Bad mit WC ohne Fenster": "Ja" },
      merkmalState: "checked",
    },
    {
      mapping: { "Bad mit WC ohne Fenster": "Ja" },
      answers: { "Bad mit WC ohne Fenster": "Nicht sicher" },
      merkmalState: "maybe",
    },
    {
      mapping: { "Bad mit WC ohne Fenster": "Ja" },
      answers: { "Bad mit WC ohne Fenster": "Nein" },
      merkmalState: "unchecked",
    },
    {
      mapping: { "Bad mit WC ohne Fenster": "Nein" },
      answers: { "Bad mit WC ohne Fenster": "Ja" },
      merkmalState: "unchecked",
    },
    {
      mapping: { "Bad mit WC ohne Fenster": "Nein" },
      answers: { "Bad mit WC ohne Fenster": "Nicht sicher" },
      merkmalState: "maybe",
    },
    {
      mapping: { "Bad mit WC ohne Fenster": "Nein" },
      answers: { "Bad mit WC ohne Fenster": "Nein" },
      merkmalState: "checked",
    },
  ].map(({ mapping, answers, merkmalState }) => ({
    mapping: Object({ checked_if: mapping }) as AnswerMerkmalStateMapping,
    answers: { ...SCHNELLTEST_RESET_ANSWERS, ...answers } as FinalAnswers,
    merkmalState: merkmalState as MerkmalState,
  })),
])("mapAnswerToMerkmalState(%o)", ({ mapping, answers, merkmalState }) => {
  expect(
    mapAnswerToMerkmalState(
      mapping,
      answers,
      getVisibleQuestionAliases(answers),
    ),
  ).toEqual(merkmalState);
});

// Condition Group: And
test.each([
  ...[
    {
      answers: {
        "Küche ist groß": "Ja",
        "Küche ist separater Raum": "Ja",
      },
      merkmalState: "checked",
    },
    {
      answers: {
        "Küche ist groß": "Ja",
        "Küche ist separater Raum": "Nicht sicher",
      },
      merkmalState: "maybe",
    },
    {
      answers: {
        "Küche ist groß": "Ja",
        "Küche ist separater Raum": "Nein",
      },
      merkmalState: "unchecked",
    },
    {
      answers: {
        "Küche ist groß": "Nicht sicher",
        "Küche ist separater Raum": "Ja",
      },
      merkmalState: "maybe",
    },
    {
      answers: {
        "Küche ist groß": "Nicht sicher",
        "Küche ist separater Raum": "Nicht sicher",
      },
      merkmalState: "maybe",
    },
    {
      answers: {
        "Küche ist groß": "Nicht sicher",
        "Küche ist separater Raum": "Nein",
      },
      merkmalState: "unchecked",
    },
    {
      answers: {
        "Küche ist groß": "Nein",
        "Küche ist separater Raum": "Ja",
      },
      merkmalState: "unchecked",
    },
    {
      answers: {
        "Küche ist groß": "Nein",
        "Küche ist separater Raum": "Nicht sicher",
      },
      merkmalState: "unchecked",
    },
    {
      answers: {
        "Küche ist groß": "Nein",
        "Küche ist separater Raum": "Nein",
      },
      merkmalState: "unchecked",
    },
  ].map(({ answers, merkmalState }) => ({
    mapping: Object({
      checked_if: {
        logic: "and",
        conditions: [
          { "Küche ist groß": "Ja" },
          { "Küche ist separater Raum": "Ja" },
        ],
      },
    }) as AnswerMerkmalStateMapping,
    answers: { ...SCHNELLTEST_RESET_ANSWERS, ...answers } as FinalAnswers,
    merkmalState: merkmalState as MerkmalState,
  })),
])("mapAnswerToMerkmalState(%o)", ({ mapping, answers, merkmalState }) => {
  expect(
    mapAnswerToMerkmalState(
      mapping,
      answers,
      getVisibleQuestionAliases(answers),
    ),
  ).toEqual(merkmalState);
});

// Condition Group: Or
test.each([
  ...[
    {
      answers: {
        "Bad & WC ohne Waschbecken": "Ja",
        "Bad nur kleines Waschbecken": "Ja",
      },
      merkmalState: "checked",
    },
    {
      answers: {
        "Bad & WC ohne Waschbecken": "Ja",
        "Bad nur kleines Waschbecken": "Nicht sicher",
      },
      merkmalState: "checked",
    },
    {
      answers: {
        "Bad & WC ohne Waschbecken": "Ja",
        "Bad nur kleines Waschbecken": "Nein",
      },
      merkmalState: "checked",
    },
    {
      answers: {
        "Bad & WC ohne Waschbecken": "Nicht sicher",
        "Bad nur kleines Waschbecken": "Ja",
      },
      merkmalState: "checked",
    },
    {
      answers: {
        "Bad & WC ohne Waschbecken": "Nicht sicher",
        "Bad nur kleines Waschbecken": "Nicht sicher",
      },
      merkmalState: "maybe",
    },
    {
      answers: {
        "Bad & WC ohne Waschbecken": "Nicht sicher",
        "Bad nur kleines Waschbecken": "Nein",
      },
      merkmalState: "maybe",
    },
    {
      answers: {
        "Bad & WC ohne Waschbecken": "Nein",
        "Bad nur kleines Waschbecken": "Ja",
      },
      merkmalState: "checked",
    },
    {
      answers: {
        "Bad & WC ohne Waschbecken": "Nein",
        "Bad nur kleines Waschbecken": "Nicht sicher",
      },
      merkmalState: "maybe",
    },
    {
      answers: {
        "Bad & WC ohne Waschbecken": "Nein",
        "Bad nur kleines Waschbecken": "Nein",
      },
      merkmalState: "unchecked",
    },
  ].map(({ answers, merkmalState }) => ({
    mapping: Object({
      checked_if: {
        logic: "or",
        conditions: [
          { "Bad & WC ohne Waschbecken": "Ja" },
          { "Bad nur kleines Waschbecken": "Ja" },
        ],
      },
    }) as AnswerMerkmalStateMapping,
    answers: { ...SCHNELLTEST_RESET_ANSWERS, ...answers } as FinalAnswers,
    merkmalState: merkmalState as MerkmalState,
  })),
])("mapAnswerToMerkmalState(%o)", ({ mapping, answers, merkmalState }) => {
  expect(
    mapAnswerToMerkmalState(
      mapping,
      answers,
      getVisibleQuestionAliases(answers),
    ),
  ).toEqual(merkmalState);
});

// Wärmedämmung
test.each([
  ...[
    {
      answers: {
        Energieverbrauchskennwert: "+++",
      },
      merkmalState: "checked",
    },
    {
      answers: {
        Energieverbrauchskennwert: "++",
      },
      merkmalState: "unchecked",
    },
  ].map(({ answers, merkmalState }) => ({
    mapping: Object({
      checked_if: {
        logic: "or",
        conditions: [
          { Energieverbrauchskennwert: "+++" },
          { Energiebedarfskennwert: "+++" },
        ],
      },
    }) as AnswerMerkmalStateMapping,
    answers: {
      ...SCHNELLTEST_RESET_ANSWERS,
      "Kennt Energieverbrauch oder Energiebedarf": "Energieverbrauchswert",
      ...answers,
    } as FinalAnswers,
    merkmalState: merkmalState as MerkmalState,
  })),
])("mapAnswerToMerkmalState(%o)", ({ mapping, answers, merkmalState }) => {
  expect(
    mapAnswerToMerkmalState(
      mapping,
      answers,
      getVisibleQuestionAliases(answers),
    ),
  ).toEqual(merkmalState);
});
