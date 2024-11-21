import { useAnswers } from "~/2024/form/flow-machine";

import { getLowestHighestPreisspanne } from "./calculation/preisspanne";
import {
  getAdresse,
  getAusstattung,
  getBaujahr,
  getBaujahrSpanne,
  getMietspiegelJahr,
  getNettokaltmiete,
  getWohnflaeche,
  getWohnflaecheSpanne,
  getWohnlage,
} from "./form/api";
import { useLowestHighestZulaessigeHoechstmiete } from "./utils";

export function Page2024() {
  const answers = useAnswers().getAliasedState();
  useLowestHighestZulaessigeHoechstmiete();

  const address = getAdresse(answers);
  const values = {
    Adresse: address
      ? `${address.strasse} ${address.nummer}, ${address.plz} Berlin`
      : undefined,
    Baujahr: getBaujahr(answers),
    Wohnfläche: getWohnflaeche(answers),
    Nettokaltmiete: getNettokaltmiete(answers),
    Ausstattung: JSON.stringify(getAusstattung(answers), null, 2),
  };

  const mietspiegeltabelle = {
    "Mietspiegel Jahr": getMietspiegelJahr(answers),
    "Baujahr Spanne": getBaujahrSpanne(answers),
    Wohnlage: JSON.stringify(getWohnlage(answers), null, 2),
    "Wohnfläche Spanne": getWohnflaecheSpanne(answers),
    Preisspanne: JSON.stringify(getLowestHighestPreisspanne(answers), null, 2),
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
        <h2 className="title-20">Mietspiegeltabelle</h2>
        {Object.keys(mietspiegeltabelle).map((key) => (
          <div className="" key={key}>
            <label className="block text-base-book mb-2">{key}</label>
            <div className="px-3 py-2 border border-neutral bg-gray-1 shadow-sm text-sm rounded">
              {mietspiegeltabelle[key as keyof typeof mietspiegeltabelle] ||
                "undefined"}
            </div>
          </div>
        ))}
      </div>

      <hr />

      <div className="flex flex-col gap-6">
        <h2 className="title-20">Merkmalsgruppen</h2>
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
