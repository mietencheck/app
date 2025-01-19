import { entries, fromEntries } from "remeda";

import { FinalAnswers } from "~/form/flow-machine";
import { merkmaleByYear } from "~/mietspiegel/merkmale";
import { parseAdresse } from "~/utils";

import { baujahrSpannenByMietspiegeljahr } from "../mietspiegel/baujahrSpannen";
import { preisspannenByMietspiegeljahr } from "../mietspiegel/preisspannen";
import { Mietspiegeljahr } from "../mietspiegel/types";
import {
  AnswerMerkmalStateMapping,
  answersToMerkmalStateMapping,
} from "./mappings/merkmale";
import { answersToSondermerkmalStateMapping } from "./mappings/sondermerkmale";
import { vertragsdatumToMietspiegelJahrMapping } from "./mappings/vertragsdatum";
import { mapAnswerToMerkmalState } from "./utils/mapAnswerToMerkmalState";
import {
  mapMerkmalStateToMerkmalGruppen,
  MerkmalGruppenStateList,
  MerkmalStateList,
  SondermerkmalStateList,
} from "./utils/mapMerkmalStateToMerkmalGruppen";

export const getMietspiegeljahr = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): Mietspiegeljahr | undefined => {
  const alias = "Vertragsdatum";
  return answers[alias] && visibleQuestionAliases.has(alias)
    ? vertragsdatumToMietspiegelJahrMapping[answers[alias]]
    : undefined;
};

export const getAdresse = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): ReturnType<typeof parseAdresse> | undefined => {
  const alias = "Adresse";
  return answers[alias] && visibleQuestionAliases.has(alias)
    ? parseAdresse(answers[alias] as string)
    : undefined;
};

export const getOst = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): boolean => {
  const alias = "Ost";
  return answers[alias] && visibleQuestionAliases.has(alias)
    ? answers[alias]
    : false;
};

export const getWohnlage = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const alias = "Wohnlage";
  return answers[alias] && visibleQuestionAliases.has(alias)
    ? answers[alias]
    : undefined;
};

export const getWohnflaeche = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const alias = "Qm";
  return answers && visibleQuestionAliases?.has(alias)
    ? Number(answers[alias])
    : undefined;
};

export const getWohnflaecheSpanne = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const mietspiegeljahr = getMietspiegeljahr(answers, visibleQuestionAliases);
  const baujahrSpanne = getBaujahrSpanne(answers, visibleQuestionAliases);
  const wohnlage = getWohnlage(answers, visibleQuestionAliases);
  const wohnflaeche = getWohnflaeche(answers, visibleQuestionAliases);

  if (mietspiegeljahr && baujahrSpanne && wohnlage && wohnflaeche) {
    const wohnflaecheRanges = Object.keys(
      preisspannenByMietspiegeljahr[
        mietspiegeljahr as keyof typeof preisspannenByMietspiegeljahr
      ][
        baujahrSpanne as keyof (typeof preisspannenByMietspiegeljahr)[typeof mietspiegeljahr]
      ][wohnlage],
    );

    return wohnflaecheRanges.find((livingSpaceRange) => {
      const livingSpaceLimits = livingSpaceRange.split("-");
      return (
        wohnflaeche >= Number(livingSpaceLimits[0]) &&
        (wohnflaeche < Number(livingSpaceLimits[1]) ||
          livingSpaceLimits[1] === "")
      );
    });
  }
  return undefined;
};

export const getVertragsart = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const alias = "Mietart";
  return answers && visibleQuestionAliases?.has(alias)
    ? answers[alias]
    : undefined;
};

export const getBaujahr = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const alias = "Baujahr";
  return answers && visibleQuestionAliases?.has(alias)
    ? Number(answers[alias])
    : undefined;
};

export const getBaujahrSpanne = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const mietspiegeljahr = getMietspiegeljahr(answers, visibleQuestionAliases);
  const baujahr = getBaujahr(answers, visibleQuestionAliases);
  const ost = getOst(answers, visibleQuestionAliases);

  if (baujahr && mietspiegeljahr) {
    const baujahrSpannen =
      baujahrSpannenByMietspiegeljahr[mietspiegeljahr as Mietspiegeljahr];

    return baujahrSpannen.find((baujahrSpanne) => {
      const [start, end] = baujahrSpanne
        .replace(/^(W:|O:)/, "")
        .split("-")
        .map(Number);
      const isOst = baujahrSpanne.includes("O:");
      const isWest = baujahrSpanne.includes("W:");

      const matchesOstWest =
        (!isOst && !isWest) || // No specific region
        (isOst && ost === true) || // Matches East
        (isWest && ost === false); // Matches West

      return baujahr >= start && baujahr <= end && matchesOstWest;
    });
  }

  return undefined;
};

export const getNettokaltmiete = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): number | undefined => {
  const alias = "Kaltmiete";
  return answers[alias] && visibleQuestionAliases?.has(alias)
    ? Number(answers[alias])
    : undefined;
};

export const getAusstattung = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
) => {
  const alias_sh = "Wohnung hat Sammelheizung";
  const alias_bad = "Badezimmer in Wohnung";

  return {
    sammelheizung:
      answers[alias_sh] && visibleQuestionAliases?.has(alias_sh)
        ? answers[alias_sh]
        : undefined,
    bad:
      answers[alias_bad] && visibleQuestionAliases?.has(alias_bad)
        ? answers[alias_bad]
        : undefined,
  };
};

export const getMerkmalStatesByGruppe = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): MerkmalGruppenStateList => {
  const merkmale = getMerkmalStates(answers, visibleQuestionAliases);
  return mapMerkmalStateToMerkmalGruppen(merkmale);
};

export const getMerkmalStates = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): MerkmalStateList => {
  const mietspiegelJahr = getMietspiegeljahr(answers, visibleQuestionAliases);

  if (mietspiegelJahr) {
    const merkmale = merkmaleByYear[mietspiegelJahr];

    return fromEntries(
      entries(answersToMerkmalStateMapping)
        .filter(([merkmal]) => merkmale.has(merkmal))
        .map(
          ([key, answerMerkmalMapping]: [
            string,
            AnswerMerkmalStateMapping,
          ]) => {
            return [
              key,
              mapAnswerToMerkmalState(
                answerMerkmalMapping,
                answers,
                visibleQuestionAliases,
              ),
            ];
          },
        ),
    );
  }
  return {};
};

export const getSondermerkmalStates = (
  answers: FinalAnswers,
  visibleQuestionAliases: Set<string>,
): SondermerkmalStateList | undefined => {
  const mietspiegeljahr = getMietspiegeljahr(answers, visibleQuestionAliases);

  if (mietspiegeljahr == "2015") {
    return fromEntries(
      entries(answersToSondermerkmalStateMapping).map(
        ([key, answerMerkmalMapping]: [string, any]) => {
          return [
            key,
            mapAnswerToMerkmalState(
              answerMerkmalMapping,
              answers,
              visibleQuestionAliases,
            ),
          ];
        },
      ),
    ) as SondermerkmalStateList;
  }

  return undefined;
};
