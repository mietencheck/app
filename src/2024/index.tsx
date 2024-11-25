import {
  useAnswers,
  useVisibleQuestionAliases,
} from "~/2024/form/flow-machine";

import { getLowestHighestOrtsueblicheVergleichsmiete } from "./calculation/ortsueblicheVergleichsmiete";
import { getLowestHighestPreisspanne } from "./calculation/preisspanne";
import { getLowestHighestSpanneneinordnung } from "./calculation/spanneneinordnung";
import { getLowestHighestZulaessigeHoechstmiete } from "./calculation/zulaessigeHoechstmiete";
import {
  getAdresse,
  getAusstattung,
  getBaujahr,
  getBaujahrSpanne,
  getMerkmalStates,
  getMietspiegeljahr,
  getNettokaltmiete,
  getWohnflaeche,
  getWohnflaecheSpanne,
  getWohnlage,
} from "./form/api";
import { useLowestHighestZulaessigeHoechstmiete } from "./utils";

export function Page2024() {
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAliases = useVisibleQuestionAliases();
  useLowestHighestZulaessigeHoechstmiete();

  const address = getAdresse(answers, visibleQuestionAliases);

  const sections = {
    Values: {
      Adresse: address
        ? `${address.strasse} ${address.nummer}, ${address.plz} Berlin`
        : undefined,
      Baujahr: getBaujahr(answers, visibleQuestionAliases),
      Wohnfläche: getWohnflaeche(answers, visibleQuestionAliases),
      Nettokaltmiete: getNettokaltmiete(answers, visibleQuestionAliases),
      Ausstattung: JSON.stringify(
        getAusstattung(answers, visibleQuestionAliases),
      ),
    },
    Mietspiegeltabelle: {
      "Mietspiegel Jahr": getMietspiegeljahr(answers, visibleQuestionAliases),
      "Baujahr Spanne": getBaujahrSpanne(answers, visibleQuestionAliases),
      Wohnlage: JSON.stringify(
        getWohnlage(answers, visibleQuestionAliases),
        null,
        2,
      ),
      "Wohnfläche Spanne": getWohnflaecheSpanne(
        answers,
        visibleQuestionAliases,
      ),
      Preisspanne: JSON.stringify(
        getLowestHighestPreisspanne(answers, visibleQuestionAliases),
      ),
    },
    Merkmalsgruppen: {
      Merkmale: JSON.stringify(
        getMerkmalStates(answers, visibleQuestionAliases),
        null,
        2,
      ),
      LowestHighestSpanneneinordnung: JSON.stringify(
        getLowestHighestSpanneneinordnung(answers, visibleQuestionAliases),
      ),
    },
    Result: {
      LowestHighestOrtsueblicheVergleichsmiete: JSON.stringify(
        getLowestHighestOrtsueblicheVergleichsmiete(
          answers,
          visibleQuestionAliases,
        ),
      ),
      LowestHighestZulaessigeHoechstmiete: JSON.stringify(
        getLowestHighestZulaessigeHoechstmiete(answers, visibleQuestionAliases),
      ),
    },
  };

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
      {Object.entries(sections).map(([sectionName, table]) => (
        <div key={sectionName} className="flex flex-col gap-6">
          <h2 className="title-20">{sectionName}</h2>
          {Object.entries(table).map(([rowName, row]) => (
            <div key={rowName}>
              <label className="block text-base-book mb-2">{rowName}</label>
              <div
                className="px-3 py-2 border border-neutral bg-gray-1 shadow-sm text-sm rounded"
                dangerouslySetInnerHTML={{
                  __html: row
                    ? row.toString().replace(/\n/g, "<br />")
                    : "undefined",
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
