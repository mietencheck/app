import { getMerkmalGruppenStates } from "~/2024/form/api";
import { FinalAnswers } from "~/2024/form/flow-machine";

import {
  MerkmalGruppenStateList,
  MerkmalState,
  MerkmalStateList,
} from "../form/utils/mapMerkmalStateToMerkmalGruppen";
import { MerkmalGruppe } from "../mietspiegel/types";

const countValues = (obj: MerkmalStateList, values: string[]) =>
  Object.values(obj).filter((value) => (value ? values.includes(value) : false))
    .length;

const calcMerkmalmalGruppenTotal = (
  merkmalGruppen: MerkmalGruppenStateList,
  merkmalStates: MerkmalState[],
) => {
  const sum: { [key in MerkmalGruppe]: number } = {
    Bad: 0,
    Küche: 0,
    Wohnung: 0,
    Gebäude: 0,
    Umfeld: 0,
  };

  Object.entries(merkmalGruppen).forEach(([merkmalGruppe, merkmale]) => {
    sum[merkmalGruppe as MerkmalGruppe] =
      countValues(merkmale.Wohnwerterhoehend, merkmalStates) -
      countValues(merkmale.Wohnwertmindernd, merkmalStates);
  });

  return sum;
};

const calcSpanneneinordnung = (merkmalsGruppen: {
  [key in MerkmalGruppe]: number;
}): number => {
  return Object.values(merkmalsGruppen).reduce((acc, value) => {
    return acc + (value > 0 ? 0.2 : value < 0 ? -0.2 : 0);
  }, 0);
};

export function getLowestHighestSpanneneinordnung(
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): {
  lowest: number;
  highest: number;
} {
  const merkmalGruppen = getMerkmalGruppenStates(
    answers,
    visibleQuestionAliases,
  );

  const merkmalGruppenTotal = {
    checked: calcMerkmalmalGruppenTotal(merkmalGruppen, ["checked"]),
    checkedOrMaybe: calcMerkmalmalGruppenTotal(merkmalGruppen, [
      "checked",
      "maybe",
    ]),
  };

  const spanneneinordnung = {
    checked: calcSpanneneinordnung(merkmalGruppenTotal.checked),
    checkedOrMaybe: calcSpanneneinordnung(merkmalGruppenTotal.checkedOrMaybe),
  };

  return {
    lowest: Math.min(
      spanneneinordnung.checked,
      spanneneinordnung.checkedOrMaybe,
    ),
    highest: Math.max(
      spanneneinordnung.checked,
      spanneneinordnung.checkedOrMaybe,
    ),
  };
}
