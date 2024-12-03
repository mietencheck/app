import {
  getBaujahrSpanne,
  getMietspiegeljahr,
  getSondermerkmalStates,
} from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine";
import { sondermerkmaleAbzuegeByMietspiegeljahr } from "~/mietspiegel/sondermerkmale";
import {
  BaujahrSpanneInMietspiegeljahr,
  Mietspiegeljahr,
  Sondermerkmal,
} from "~/mietspiegel/types";

const calcSondermerkmalAbzug = (
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

  const abzuege = sondermerkmaleAbzuegeByMietspiegeljahr["2015"][
    sondermerkmal
  ] as Record<BaujahrSpanneInMietspiegeljahr[2015], number>;

  return abzuege[baujahrSpanne] ?? 0;
};

export const getWorstBestSondermerkmalAbzuege = (
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

  console.log("baujahrSpanne", baujahrSpanne);

  const sondermerkmalStates = getSondermerkmalStates(
    answers,
    visibleQuestionAliases,
  );

  if (!sondermerkmalStates) {
    return undefined;
  }

  return Object.entries(sondermerkmalStates).reduce(
    (result, [sondermerkmal, state]) => {
      const abzug = calcSondermerkmalAbzug(
        mietspiegeljahr,
        sondermerkmal as Sondermerkmal,
        baujahrSpanne as BaujahrSpanneInMietspiegeljahr[2015],
      );
      result[sondermerkmal as Sondermerkmal] = {
        worst: state == "checked" || state == "maybe" ? abzug : 0,
        best: state == "checked" ? abzug : 0,
      };
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

export function getWorstBestSondermerkmalAbzugTotal(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): {
  worst: number;
  best: number;
} {
  const sondermerkmalAbzuege = getWorstBestSondermerkmalAbzuege(
    answers,
    visibleQuestionAliases,
  );

  if (!sondermerkmalAbzuege) {
    return {
      worst: 0,
      best: 0,
    };
  }
  return Object.entries(sondermerkmalAbzuege).reduce(
    (result, sondermerkmal) => {
      result.worst = result.worst + sondermerkmal[1].worst;
      result.best = result.best + sondermerkmal[1].best;
      return result;
    },
    { worst: 0, best: 0 },
  );
}
