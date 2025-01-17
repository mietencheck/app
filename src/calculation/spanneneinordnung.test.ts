import { expect, test } from "vitest";

import { FinalAnswers, getVisibleQuestionAliases } from "~/form/flow-machine";
import { MerkmalGruppe } from "~/mietspiegel/types";

import { MERKMAL_RESET_ANSWERS } from "./answer-reset";
import {
  getWorstBestMerkmalStateByMerkmalGruppe,
  getWorstBestMerkmalStateByMerkmalGrupppeInPercent,
  getWorstBestSpanneneinordnungInPercent,
} from "./spanneneinordnung";

const cases = [
  {
    description: "Default case where all Merkmale are 'unchecked'",
    answers: {},
    result: {
      merkmalStateByMerkmalGruppe: {},
      merkmalStateByMerkmalGrupppeInPercent: {},
      spanneneinordnungInPercent: {},
    },
  },
  {
    description: "Case where a wohnwertminderndes Merkmal is 'maybe'",
    answers: {
      "Bad hat Duschmöglichkeit": "Nicht sicher",
    },
    result: {
      merkmalStateByMerkmalGruppe: {
        Bad: { worst: 0, best: -1 },
      },
      merkmalStateByMerkmalGrupppeInPercent: {
        Bad: { worst: 0, best: -0.2 },
      },
      spanneneinordnungInPercent: {
        worst: 0,
        best: -0.2,
      },
    },
  },
  {
    description: "Case where a wohnwertminderndes Merkmal is 'checked'",
    answers: {
      "Bad hat Duschmöglichkeit": "Nein",
    },
    result: {
      merkmalStateByMerkmalGruppe: {
        Bad: { worst: -1, best: -1 },
      },
      merkmalStateByMerkmalGrupppeInPercent: {
        Bad: { worst: -0.2, best: -0.2 },
      },
      spanneneinordnungInPercent: {
        worst: -0.2,
        best: -0.2,
      },
    },
  },
  {
    description: "Case where a wohnwerterhöhendes Merkmal is 'maybe'",
    answers: {
      "Mehrere WCs": "Nicht sicher",
    },
    result: {
      merkmalStateByMerkmalGruppe: {
        Bad: { worst: 1, best: 0 },
      },
      merkmalStateByMerkmalGrupppeInPercent: {
        Bad: { worst: 0.2, best: 0 },
      },
      spanneneinordnungInPercent: {
        worst: 0.2,
        best: 0,
      },
    },
  },
  {
    description: "Case where a wohnwerterhöhendes Merkmal is 'checked'",
    answers: {
      "Mehrere WCs": "Ja",
    },
    result: {
      merkmalStateByMerkmalGruppe: {
        Bad: { worst: 1, best: 1 },
      },
      merkmalStateByMerkmalGrupppeInPercent: {
        Bad: { worst: 0.2, best: 0.2 },
      },
      spanneneinordnungInPercent: {
        worst: 0.2,
        best: 0.2,
      },
    },
  },
].map(({ answers, result }) => {
  return {
    answers: {
      Unterschrieben: "Ja",
      Vertragsdatum: "2022-2024",
      ...MERKMAL_RESET_ANSWERS,
      ...answers,
    } as FinalAnswers,
    result: {
      merkmalStateByMerkmalGruppe: {
        ...{
          Bad: { worst: 0, best: 0 },
          Küche: { worst: 0, best: 0 },
          Wohnung: { worst: 0, best: 0 },
          Gebäude: { worst: 0, best: 0 },
          Umfeld: { worst: 0, best: 0 },
        },
        ...result?.merkmalStateByMerkmalGruppe,
      } as {
        [key in MerkmalGruppe]: { best: number; worst: number };
      },
      merkmalStateByMerkmalGrupppeInPercent: {
        ...{
          Bad: { worst: 0, best: 0 },
          Küche: { worst: 0, best: 0 },
          Wohnung: { worst: 0, best: 0 },
          Gebäude: { worst: 0, best: 0 },
          Umfeld: { worst: 0, best: 0 },
        },
        ...result?.merkmalStateByMerkmalGrupppeInPercent,
      } as {
        [key in MerkmalGruppe]: { best: number; worst: number };
      },
      spanneneinordnungInPercent: {
        ...{
          worst: 0,
          best: 0,
        },
        ...result?.spanneneinordnungInPercent,
      } as {
        worst: number;
        best: number;
      },
    },
  };
});

test.each(cases)(
  "getWorstBestMerkmalStateByMerkmalGruppe(%o)",
  ({ answers, result }) => {
    expect(
      getWorstBestMerkmalStateByMerkmalGruppe(
        answers,
        getVisibleQuestionAliases(answers),
      ),
    ).toEqual(result.merkmalStateByMerkmalGruppe);
  },
);

test.each(cases)(
  "getWorstBestMerkmalStateByMerkmalGrupppeInPercent(%o)",
  ({ answers, result }) => {
    expect(
      getWorstBestMerkmalStateByMerkmalGrupppeInPercent(
        answers,
        getVisibleQuestionAliases(answers),
      ),
    ).toEqual(result.merkmalStateByMerkmalGrupppeInPercent);
  },
);

test.each(cases)(
  "getWorstBestSpanneneinordnungInPercent(%o)",
  ({ answers, result }) => {
    expect(
      getWorstBestSpanneneinordnungInPercent(
        answers,
        getVisibleQuestionAliases(answers),
      ),
    ).toEqual(result.spanneneinordnungInPercent);
  },
);
