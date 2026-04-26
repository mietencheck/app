import { sondermerkmaleModifierByMietspiegeljahr } from "~/mietspiegel/sondermerkmale";
import {
  BaujahrSpanneInMietspiegeljahr,
  Mietspiegeljahr,
  Sondermerkmal,
} from "~/mietspiegel/types";

import { CalculationContext } from "./types";

const calcSondermerkmalModifier = (
  mietspiegeljahr: Mietspiegeljahr | undefined,
  sondermerkmal: Sondermerkmal,
  baujahrSpanne: BaujahrSpanneInMietspiegeljahr[2015],
) => {
  if (
    !mietspiegeljahr ||
    !baujahrSpanne ||
    !sondermerkmal ||
    mietspiegeljahr != "2015"
  ) {
    return 0;
  }

  const modifier = sondermerkmaleModifierByMietspiegeljahr["2015"][
    sondermerkmal
  ] as Record<BaujahrSpanneInMietspiegeljahr[2015], number>;

  return modifier[baujahrSpanne] ?? 0;
};

export const getWorstBestSondermerkmalModifierBySondermerkmal = (
  ctx: CalculationContext,
):
  | {
      [key in Sondermerkmal]: {
        worst: number;
        best: number;
      };
    }
  | undefined => {
  const { mietspiegeljahr, baujahrSpanne, sondermerkmale } = ctx;

  if (!sondermerkmale) {
    return undefined;
  }

  return Object.entries(sondermerkmale).reduce(
    (result, [sondermerkmal, state]) => {
      const modifier = calcSondermerkmalModifier(
        mietspiegeljahr,
        sondermerkmal as Sondermerkmal,
        baujahrSpanne as BaujahrSpanneInMietspiegeljahr[2015],
      );

      if (modifier >= 0) {
        result[sondermerkmal as Sondermerkmal] = {
          worst: state == "checked" || state == "maybe" ? modifier : 0,
          best: state == "checked" ? modifier : 0,
        };
      } else {
        result[sondermerkmal as Sondermerkmal] = {
          worst: state == "checked" ? modifier : 0,
          best: state == "checked" || state == "maybe" ? modifier : 0,
        };
      }

      return result;
    },
    {} as {
      [key in Sondermerkmal]: {
        worst: number;
        best: number;
      };
    },
  );
};

export function getWorstBestSondermerkmalModifier(ctx: CalculationContext): {
  worst: number;
  best: number;
} {
  const modifierBySondermerkmal =
    getWorstBestSondermerkmalModifierBySondermerkmal(ctx);

  if (!modifierBySondermerkmal) {
    return {
      worst: 0,
      best: 0,
    };
  }

  return Object.entries(modifierBySondermerkmal).reduce(
    (result, [_, aufschlag]) => {
      result.worst = Number((result.worst + aufschlag.worst).toFixed(2));
      result.best = Number((result.best + aufschlag.best).toFixed(2));
      return result;
    },
    { worst: 0, best: 0 },
  );
}
