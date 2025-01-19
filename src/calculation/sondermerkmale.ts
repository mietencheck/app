import {
  getBaujahrSpanne,
  getMietspiegeljahr,
  getSondermerkmalStates,
} from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";
import { sondermerkmaleModifierByMietspiegeljahr } from "~/mietspiegel/sondermerkmale";
import {
  BaujahrSpanneInMietspiegeljahr,
  Mietspiegeljahr,
  Sondermerkmal,
} from "~/mietspiegel/types";

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
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
):
  | {
      [key in Sondermerkmal]: {
        worst: number;
        best: number;
      };
    }
  | undefined => {
  const mietspiegeljahr = getMietspiegeljahr(answers, visibleQuestionAliases);
  const baujahrSpanne = getBaujahrSpanne(answers, visibleQuestionAliases);

  const sondermerkmalStates = getSondermerkmalStates(
    answers,
    visibleQuestionAliases,
  );

  if (!sondermerkmalStates) {
    return undefined;
  }

  return Object.entries(sondermerkmalStates).reduce(
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

export function getWorstBestSondermerkmalModifier(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): {
  worst: number;
  best: number;
} {
  const modifierBySondermerkmal =
    getWorstBestSondermerkmalModifierBySondermerkmal(
      answers,
      visibleQuestionAliases,
    );

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
