import {
  constructionYearRangeByRentIndexYear,
  rentIndex,
  RentIndexYear,
} from "~/2024/rentIndex";
import { StepInfoByAlias } from "~/form/flow.fm";
import { parseAdresse } from "~/utils";

export type EstimateAnswers = StepInfoByAlias["Einschätzung"]["state"];
export type FinalAnswers = StepInfoByAlias["Auswertung"]["state"];

export const contractDateToRentIndexYear = {
  "<2015": undefined,
  "2015-2016": "2015",
  "2016-2018": "2017",
  "2018-2020": "2019",
  "2020-2022": "2021",
  "2022-2024": "2023",
  ">2024": "2024",
} satisfies Record<
  NonNullable<EstimateAnswers["Vertragsdatum"]>,
  RentIndexYear | undefined
>;

export const getRentIndexYear = (
  answers?: FinalAnswers,
): RentIndexYear | undefined =>
  answers?.["Vertragsdatum"]
    ? contractDateToRentIndexYear[answers["Vertragsdatum"]]
    : undefined;

export const getAddress = (
  answers?: FinalAnswers,
): ReturnType<typeof parseAdresse> | undefined =>
  answers ? parseAdresse(answers["Adresse"] as string) : undefined;

export const getResidentialArea = (answers?: FinalAnswers) => {
  const rentIndexYear = getRentIndexYear(answers);
  return rentIndexYear && answers?.["Adresse"]
    ? getAddress(answers)?.lage?.[rentIndexYear]?.wohnlage
    : undefined;
};

export const getSizeOfLivingSpace = (answers?: FinalAnswers) =>
  answers ? Number(answers["Qm"]) : undefined;

export const getSizeOfLivingSpaceRange = (answers?: FinalAnswers) => {
  const rentIndexYear = getRentIndexYear(answers);
  const constructionYearRange = getConstructionYearRange(answers);
  const residentialArea = getResidentialArea(answers);
  const sizeOfLivingSpace = getSizeOfLivingSpace(answers);

  if (
    rentIndexYear &&
    constructionYearRange &&
    residentialArea &&
    sizeOfLivingSpace
  ) {
    const livingSpaceRanges = Object.keys(
      rentIndex[rentIndexYear as keyof typeof rentIndex][
        constructionYearRange as keyof (typeof rentIndex)[typeof rentIndexYear]
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

export const getConstructionYear = (answers?: FinalAnswers) =>
  answers ? Number(answers["Baujahr"]) : undefined;

export const getConstructionYearRange = (answers?: FinalAnswers) => {
  const constructionYear = getConstructionYear(answers);
  const rentIndexYear = getRentIndexYear(answers);

  if (constructionYear && rentIndexYear) {
    return constructionYearRangeByRentIndexYear[
      rentIndexYear as RentIndexYear
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

export const getNetColdRent = (answers?: FinalAnswers): number | undefined =>
  answers ? Number(answers["Kaltmiete"]) : undefined;

export const getFacilities = (answers?: FinalAnswers) => {
  return {
    centralHeating: answers?.["Wohnung hat Sammelheizung"],
    bathroom: answers?.["Badezimmer in Wohnung"],
  };
};

/*
export const getRentIndexYearFoo = (
  contractDate?: EstimateAnswers["Vertragsdatum"],
) => (contractDate ? contractDateToRentIndexYear[contractDate] : undefined);

export const getResidentialArea = (
  rentIndexYear?: RentIndexYear,
  address?: EstimateAnswers["Adresse"],
) => {
  if (rentIndexYear && address) {
    return parseAdresse(address)?.lage?.[rentIndexYear];
  } else {
    return {};
  }
};

*/
