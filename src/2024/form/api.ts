import { FinalAnswers } from "~/2024/form/flow-machine";
import { vertragsdatumToMietspiegelJahr } from "~/2024/form/mappings/vertragsdatum";
import { featureKeysByYear } from "~/2024/mietspiegel/merkmale";
import {
  constructionYearRangeByRentIndexYear,
  MietspiegelJahr,
  mietspiegeltabelleByJahr,
} from "~/2024/mietspiegel/mietspiegeltabelle";
import { parseAdresse } from "~/utils";

export const getMietspiegelJahr = (
  answers?: FinalAnswers,
): MietspiegelJahr | undefined =>
  answers?.["Vertragsdatum"]
    ? vertragsdatumToMietspiegelJahr[answers["Vertragsdatum"]]
    : undefined;

export const getAdresse = (
  answers?: FinalAnswers,
): ReturnType<typeof parseAdresse> | undefined =>
  answers ? parseAdresse(answers["Adresse"] as string) : undefined;

export const getWohnlage = (answers?: FinalAnswers) =>
  answers ? answers["Wohnlage"] : undefined;

export const getWohnflaeche = (answers?: FinalAnswers) =>
  answers ? Number(answers["Qm"]) : undefined;

export const getWohnflaecheSpanne = (answers?: FinalAnswers) => {
  const rentIndexYear = getMietspiegelJahr(answers);
  const constructionYearRange = getBaujahrSpanne(answers);
  const residentialArea = getWohnlage(answers);
  const sizeOfLivingSpace = getWohnflaeche(answers);

  if (
    rentIndexYear &&
    constructionYearRange &&
    residentialArea &&
    sizeOfLivingSpace
  ) {
    const livingSpaceRanges = Object.keys(
      mietspiegeltabelleByJahr[
        rentIndexYear as keyof typeof mietspiegeltabelleByJahr
      ][
        constructionYearRange as keyof (typeof mietspiegeltabelleByJahr)[typeof rentIndexYear]
      ][residentialArea],
    );

    return livingSpaceRanges.find((livingSpaceRange) => {
      const livingSpaceLimits = livingSpaceRange.split("-");
      return (
        sizeOfLivingSpace >= Number(livingSpaceLimits[0]) &&
        (sizeOfLivingSpace < Number(livingSpaceLimits[1]) ||
          livingSpaceLimits[1] === "")
      );
    });
  }
  return undefined;
};

export const getBaujahr = (answers?: FinalAnswers) =>
  answers ? Number(answers["Baujahr"]) : undefined;

export const getBaujahrSpanne = (answers?: FinalAnswers) => {
  const constructionYear = getBaujahr(answers);
  const rentIndexYear = getMietspiegelJahr(answers);

  if (constructionYear && rentIndexYear) {
    return constructionYearRangeByRentIndexYear[
      rentIndexYear as MietspiegelJahr
    ].find((constructionYearRange) => {
      const constructionYearLimits = constructionYearRange
        .replace(/^(W:|O:)/, "")
        .split("-");
      return (
        constructionYear >= Number(constructionYearLimits[0]) &&
        constructionYear <= Number(constructionYearLimits[1])
      );
      /*
        TODO: Does not(?) work as expected if constructionYear is higher than
        the largest constructionYearLimits. For instance, the rent index of
        2023 only defines values building built until 2017. If the user
        enters an abritray high value for the construction year (e.g. 4000),
        this function returns undefined. Not sure if we should deal with this
        issue at the input level or somewhere else.
      */
    });
  }

  return undefined;
};

export const getNettokaltmiete = (
  answers?: FinalAnswers,
): number | undefined => (answers ? Number(answers["Kaltmiete"]) : undefined);

export const getAusstattung = (answers?: FinalAnswers) => {
  return {
    sammelheizung: answers?.["Wohnung hat Sammelheizung"],
    bad: answers?.["Badezimmer in Wohnung"],
  };
};

export const getMerkmalsgruppen = (answers?: FinalAnswers) => {
  const rentIndexYear = getMietspiegelJahr(answers);

  if (rentIndexYear) {
    console.log(featureKeysByYear[rentIndexYear]);
  }
  return undefined;
};
