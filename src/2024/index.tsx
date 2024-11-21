import { useAnswers } from "~/2024/form/flow-machine";

import { getLowestHighestRentBracket } from "./calculation/rentBracket";
import {
  getAddress,
  getConstructionYear,
  getConstructionYearRange,
  getFacilities,
  getNetColdRent,
  getRentIndexYear,
  getResidentialArea,
  getSizeOfLivingSpace,
  getSizeOfLivingSpaceRange,
} from "./form/api";
import { useHighestLowestMaximumPermissibleRent } from "./utils";

export function Page2024() {
  const answers = useAnswers().getAliasedState();
  useHighestLowestMaximumPermissibleRent();

  const address = getAddress(answers);
  const values = {
    address: address
      ? `${address.strasse} ${address.nummer}, ${address.plz} Berlin`
      : undefined,
    constructionYear: getConstructionYear(answers),
    sizeOfLivingSpace: getSizeOfLivingSpace(answers),
    netColdRent: getNetColdRent(answers),
    facilities: JSON.stringify(getFacilities(answers), null, 2),
  };

  const rentIndexTable = {
    rentIndexYear: getRentIndexYear(answers),
    constructionYearRange: getConstructionYearRange(answers),
    residentialArea: JSON.stringify(getResidentialArea(answers), null, 2),
    sizeOfLivingSpaceRange: getSizeOfLivingSpaceRange(answers),
    highestLowestRentIndexBracket: JSON.stringify(
      getLowestHighestRentBracket(answers),
      null,
      2,
    ),
  };

  const featureGroups = {};

  return (
    <main className="container my-8 flex flex-col gap-12">
      <h1 className="title-32">2024 Update</h1>

      <div className="flex flex-col gap-6">
        <h2 className="title-20">Input</h2>
        <div className="">
          <label className="block text-base-book mb-2">Local Storage</label>
          <pre className="px-3 py-2 border border-neutral bg-gray-1 shadow-sm text-sm rounded overflow-auto">
            {Object.keys(localStorage).map(
              (key) =>
                `${key} = ${JSON.stringify(
                  JSON.parse(localStorage.getItem(key) || "{}"),
                  null,
                  2,
                )}\n`,
            )}
          </pre>
        </div>
      </div>

      <hr />

      <div className="flex flex-col gap-6">
        <h2 className="title-20">Values</h2>
        {Object.keys(values).map((key) => (
          <div className="" key={key}>
            <label className="block text-base-book mb-2">{key}</label>
            <div className="px-3 py-2 border border-neutral bg-gray-1 shadow-sm text-sm rounded">
              {values[key as keyof typeof values] || "undefined"}
            </div>
          </div>
        ))}
      </div>

      <hr />

      <div className="flex flex-col gap-6">
        <h2 className="title-20">Rent Index Bracket</h2>
        {Object.keys(rentIndexTable).map((key) => (
          <div className="" key={key}>
            <label className="block text-base-book mb-2">{key}</label>
            <div className="px-3 py-2 border border-neutral bg-gray-1 shadow-sm text-sm rounded">
              {rentIndexTable[key as keyof typeof rentIndexTable] ||
                "undefined"}
            </div>
          </div>
        ))}
      </div>

      <hr />

      <div className="flex flex-col gap-6">
        <h2 className="title-20">Feature Groups</h2>
        {Object.keys(featureGroups).map((key) => (
          <div className="" key={key}>
            <label className="block text-base-book mb-2">{key}</label>
            <div className="px-3 py-2 border border-neutral bg-gray-1 shadow-sm text-sm rounded">
              {featureGroups[key as keyof typeof featureGroups] || "undefined"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
