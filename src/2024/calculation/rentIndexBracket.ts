import {
  getConstructionYearRange,
  getFacilities,
  getRentIndexYear,
  getResidentialArea,
  getSizeOfLivingSpaceRange,
} from "~/2024/calculation/utils";
import { facilityDiscounts, RentBracket, rentIndex } from "~/2024/rentIndex";
import { FinalAnswers } from "~/form/flow-machine";

/**
 * Calculates the lowest and highest possible facility discounts.
 *
 * @param {FinalAnswers} answers - The answers object containing user input data.
 * @returns  {{ highestDiscount: number; lowestDiscount: number } | undefined} - The lowest and highest discounts in Euro, or undefined if the calculation cannot be performed.
 */
export function getLowestHighestFacilityDiscount(
  answers: FinalAnswers,
): { highestDiscount: number; lowestDiscount: number } | undefined {
  const rentIndexYear = getRentIndexYear(answers);
  const constructionYearRange = getConstructionYearRange(answers);
  const facilities = getFacilities(answers);

  if (
    !rentIndexYear ||
    !constructionYearRange ||
    !facilities.centralHeating ||
    !facilities.bathroom
  ) {
    return undefined;
  }

  const currentFacilityDiscounts =
    facilityDiscounts[rentIndexYear as keyof typeof facilityDiscounts][
      constructionYearRange as keyof (typeof facilityDiscounts)[typeof rentIndexYear]
    ];

  if (!currentFacilityDiscounts) {
    return {
      highestDiscount: 0,
      lowestDiscount: 0,
    };
  }

  const isChecked = (m: "Ja" | "Nein" | "Nicht sicher") => m == "Ja";
  const isMaybeOrChecked = (m: "Ja" | "Nein" | "Nicht sicher") =>
    m == "Ja" || m == "Nicht sicher";

  const highestDiscount =
    isMaybeOrChecked(facilities.centralHeating) &&
    isMaybeOrChecked(facilities.bathroom)
      ? currentFacilityDiscounts["!CH && !BATH"]
      : isMaybeOrChecked(facilities.centralHeating) ||
          isMaybeOrChecked(facilities.bathroom)
        ? currentFacilityDiscounts["!CH || !BATH"]
        : 0;
  const lowestDiscount =
    isChecked(facilities.centralHeating) && isChecked(facilities.bathroom)
      ? currentFacilityDiscounts["!CH && !BATH"]
      : isChecked(facilities.centralHeating) || isChecked(facilities.bathroom)
        ? currentFacilityDiscounts["!CH || !BATH"]
        : 0;

  return {
    highestDiscount: highestDiscount,
    lowestDiscount: lowestDiscount,
  };
}

/**
 *  Calculates the lowest and highest applicable bracket from rent index based on the provided answers.
 *
 * @param {FinalAnswers} answers - The answers object containing user input data.
 * @returns {{ lowest: RentBracket; highest: RentBracket  } | undefined} - The the highest and lowest rent bracket, each represented as a tuple of three numbers (average value, lower threshold, upper threshold), or undefined if the calculation.
 */
export function getLowestHighestRentIndexBracket(
  answers: FinalAnswers,
): { lowest: RentBracket; highest: RentBracket } | undefined {
  const rentIndexYear = getRentIndexYear(answers);
  const constructionYearRange = getConstructionYearRange(answers);
  const sizeOfLivingSpaceRange = getSizeOfLivingSpaceRange(answers);
  const residentialArea = getResidentialArea(answers);
  const highestLowestfacilityDiscounts =
    getLowestHighestFacilityDiscount(answers);

  if (
    !rentIndexYear ||
    !constructionYearRange ||
    !residentialArea ||
    !sizeOfLivingSpaceRange ||
    !highestLowestfacilityDiscounts
  ) {
    return undefined;
  }

  // No idea if there's a better way to do this, TS is a mystery to me
  const rentIndexValues = rentIndex[rentIndexYear as keyof typeof rentIndex];
  const constructionYearRangeValues =
    rentIndexValues[
      constructionYearRange as keyof (typeof rentIndex)[typeof rentIndexYear]
    ];
  const residentialAreaValues = constructionYearRangeValues[residentialArea];
  const sizeOfLivingSpaceRangeValues =
    residentialAreaValues[
      sizeOfLivingSpaceRange as keyof typeof residentialAreaValues
    ];

  const rentIndexBracket = sizeOfLivingSpaceRangeValues;
  if (!rentIndexBracket) {
    return undefined;
  }

  const { highestDiscount, lowestDiscount } = highestLowestfacilityDiscounts;
  return {
    lowest: [
      Math.round((rentIndexBracket[0] - highestDiscount) * 100) / 100,
      Math.round((rentIndexBracket[1] - highestDiscount) * 100) / 100,
      Math.round((rentIndexBracket[2] - highestDiscount) * 100) / 100,
    ],
    highest: [
      Math.round((rentIndexBracket[0] - lowestDiscount) * 100) / 100,
      Math.round((rentIndexBracket[1] - lowestDiscount) * 100) / 100,
      Math.round((rentIndexBracket[2] - lowestDiscount) * 100) / 100,
    ],
  };
}
