import { MerkmalStateList } from "~/form/utils/mapMerkmalStateToMerkmalGruppen";
import { MerkmalGruppe } from "~/mietspiegel/types";

import { CalculationContext } from "./types";

const countMerkmaleWithValues = (obj: MerkmalStateList, values: string[]) =>
  Object.values(obj).filter((value) => (value ? values.includes(value) : false))
    .length;

export const getWorstBestMerkmalStateByMerkmalGruppe = (
  ctx: CalculationContext,
): {
  [key in MerkmalGruppe]: {
    worst: number;
    best: number;
  };
} => {
  return Object.entries(ctx.merkmale).reduce(
    (result, [merkmalGruppe, merkmale]) => {
      result[merkmalGruppe as MerkmalGruppe] = {
        worst:
          countMerkmaleWithValues(merkmale.Wohnwerterhoehend, [
            "checked",
            "maybe",
          ]) - countMerkmaleWithValues(merkmale.Wohnwertmindernd, ["checked"]),
        best:
          countMerkmaleWithValues(merkmale.Wohnwerterhoehend, ["checked"]) -
          countMerkmaleWithValues(merkmale.Wohnwertmindernd, [
            "checked",
            "maybe",
          ]),
      };
      return result;
    },
    {} as { [key in MerkmalGruppe]: any },
  );
};

export const getWorstBestMerkmalStateByMerkmalGrupppeInPercent = (
  ctx: CalculationContext,
): {
  [key in MerkmalGruppe]: {
    worst: number;
    best: number;
  };
} => {
  const worstBestMerkmalStateByMerkmalGruppe =
    getWorstBestMerkmalStateByMerkmalGruppe(ctx);

  return Object.entries(worstBestMerkmalStateByMerkmalGruppe).reduce(
    (result, [merkmalGruppe, total]) => {
      result[merkmalGruppe as MerkmalGruppe] = {
        worst: total.worst > 0 ? 0.2 : total.worst < 0 ? -0.2 : 0,
        best: total.best > 0 ? 0.2 : total.best < 0 ? -0.2 : 0,
      };
      return result;
    },
    {} as { [key in MerkmalGruppe]: any },
  );
};

export const getWorstBestSpanneneinordnungInPercent = (
  ctx: CalculationContext,
): {
  worst: number;
  best: number;
} => {
  const worstBestMerkmalStateByMerkmalGruppe =
    getWorstBestMerkmalStateByMerkmalGruppe(ctx);

  const calcSpanneneinordnung = (
    result: number,
    merkmalStateTotal: number,
  ): number => {
    if (merkmalStateTotal > 0) return result + 0.2;
    if (merkmalStateTotal < 0) return result - 0.2;
    return result;
  };

  return Object.values(worstBestMerkmalStateByMerkmalGruppe).reduce(
    (
      result,
      { worst: worstMerkmalStateTotal, best: bestMerkmalStateTotal },
    ) => {
      result.worst = calcSpanneneinordnung(
        result.worst,
        worstMerkmalStateTotal,
      );
      result.best = calcSpanneneinordnung(result.best, bestMerkmalStateTotal);
      return result;
    },
    { worst: 0, best: 0 },
  );
};
