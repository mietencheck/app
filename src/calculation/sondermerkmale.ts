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

const getSondermerkmalAbzug = (
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

export const getLowestHighestSondermerkmalAbzuege = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
):
  | {
      [key in Sondermerkmal]: {
        lowest: number;
        highest: number;
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
      const abzug = getSondermerkmalAbzug(
        mietspiegeljahr,
        sondermerkmal as Sondermerkmal,
        baujahrSpanne as BaujahrSpanneInMietspiegeljahr[2015],
      );
      result[sondermerkmal as Sondermerkmal] = {
        lowest: state == "checked" ? abzug : 0,
        highest: state == "checked" || state == "maybe" ? abzug : 0,
      };
      return result;
    },
    {} as {
      [key in Sondermerkmal]: {
        lowest: number;
        highest: number;
      };
    },
  );
};

export function getLowestHighestSondermerkmalAbzugTotal(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): {
  lowest: number;
  highest: number;
} {
  const lowestHighestSondermerkmalAbzuege =
    getLowestHighestSondermerkmalAbzuege(answers, visibleQuestionAliases);

  if (!lowestHighestSondermerkmalAbzuege) {
    return {
      lowest: 0,
      highest: 0,
    };
  }
  return Object.entries(lowestHighestSondermerkmalAbzuege).reduce(
    (result, sondermerkmal) => {
      result.lowest = result.lowest + sondermerkmal[1].lowest;
      result.highest = result.highest + sondermerkmal[1].highest;
      return result;
    },
    { lowest: 0, highest: 0 },
  );
}
