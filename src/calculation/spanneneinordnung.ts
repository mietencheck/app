import { getMerkmalStatesByGruppe } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";
import { MerkmalStateList } from "~/form/utils/mapMerkmalStateToMerkmalGruppen";
import { MerkmalGruppe } from "~/mietspiegel/types";

const countMerkmaleWithValues = (obj: MerkmalStateList, values: string[]) =>
  Object.values(obj).filter((value) => (value ? values.includes(value) : false))
    .length;

export const getLowestHighestMerkmalStateByGrupppeInPercent = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): {
  [key in MerkmalGruppe]: {
    lowest: number;
    highest: number;
  };
} => {
  const lowestHighestMerkmalStateTotalByGruppe =
    getLowestHighestMerkmalStateTotalByGruppe(answers, visibleQuestionAliases);

  return Object.entries(lowestHighestMerkmalStateTotalByGruppe).reduce(
    (result, [merkmalGruppe, total]) => {
      result[merkmalGruppe as MerkmalGruppe] = {
        lowest: total.lowest > 0 ? 0.2 : total.lowest < 0 ? -0.2 : 0,
        highest: total.highest > 0 ? 0.2 : total.highest < 0 ? -0.2 : 0,
      };
      return result;
    },
    {} as { [key in MerkmalGruppe]: any },
  );
};

export const getLowestHighestMerkmalStateTotalByGruppe = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): {
  [key in MerkmalGruppe]: {
    lowest: number;
    highest: number;
  };
} => {
  const merkmalStatesByGruppe = getMerkmalStatesByGruppe(
    answers,
    visibleQuestionAliases,
  );

  return Object.entries(merkmalStatesByGruppe).reduce(
    (result, [merkmalGruppe, merkmale]) => {
      result[merkmalGruppe as MerkmalGruppe] = {
        lowest:
          countMerkmaleWithValues(merkmale.Wohnwerterhoehend, ["checked"]) -
          countMerkmaleWithValues(merkmale.Wohnwertmindernd, [
            "checked",
            "maybe",
          ]),
        highest:
          countMerkmaleWithValues(merkmale.Wohnwerterhoehend, [
            "checked",
            "maybe",
          ]) - countMerkmaleWithValues(merkmale.Wohnwertmindernd, ["checked"]),
      };
      return result;
    },
    {} as { [key in MerkmalGruppe]: any },
  );
};

export const getLowestHighestSpanneneinordnung = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): {
  lowest: number;
  highest: number;
} => {
  const merkmalStateTotalByGruppe = getLowestHighestMerkmalStateTotalByGruppe(
    answers,
    visibleQuestionAliases,
  );

  const calcSpanneneinordnung = (
    result: number,
    merkmalStateTotal: number,
  ): number => {
    if (merkmalStateTotal > 0) return result + 0.2;
    if (merkmalStateTotal < 0) return result - 0.2;
    return result;
  };

  return Object.values(merkmalStateTotalByGruppe).reduce(
    (
      result,
      { lowest: lowestMerkmalStateTotal, highest: highestMerkmalStateTotal },
    ) => {
      result.lowest = calcSpanneneinordnung(
        result.lowest,
        lowestMerkmalStateTotal,
      );
      result.highest = calcSpanneneinordnung(
        result.highest,
        highestMerkmalStateTotal,
      );
      return result;
    },
    { lowest: 0, highest: 0 },
  );
};
