import { expect, test } from "vitest";

import { allQuestionNodes, findAnswers } from "./flow-paths";
import { allScenarios } from "./merkmal-coverage";

// Questions that are never asked in the Miete flow: the Mieterhöhung branch
// (work in progress, hidden in the UI) and the follow-ups of "Vorherige
// Mieterhöhung", which the UI always answers with "Nein".
// Legacy energy bands are retained for old saved answers; new Miete inputs
// use the numeric certificate value and the Warmwasser questions.
const NOT_ASKED_IN_MIETE_FLOW = [
  "Datum Mieterhöhungsschreiben",
  "Energieverbrauchskennwert",
  "Energiebedarfskennwert",
  "Geforderte Nettokaltmiete",
  "Kappungsgrenze durch aktuelle Mieterhöhung überschritten",
  "Kappungsgrenze überschritten",
  "Mieterhöhung Grund",
  "Mieterhöhung in letzten 33 Monaten",
  "Mieterhöhung innerhalb der letzten 15 Monaten",
  "Mieterhöhung wegen  Indexmiete maximal bis zu Inflationsrate",
  "Mieterhöhung wegen  Staffelmiete maximal bis zu Staffel",
  "Mieterhöhung zugestimmt",
  "Staffelmietvertrag aktiv",
  "Vorherige Mieterhöhung Grund",
  "Vorherige Mieterhöhung Grund (Indexmiete)",
  "Vorherige Mieterhöhung Grund (Staffelmiete)",
];

test("every question outside the Mieterhöhung branch is asked in some edition", () => {
  const asked = new Set(
    allQuestionNodes
      .filter(({ node, literals }) =>
        allScenarios().some((scenario) =>
          findAnswers(literals, {}, scenario, (evaluation) =>
            evaluation.visible.has(node.alias),
          ),
        ),
      )
      .map(({ node }) => node.alias),
  );
  const neverAsked = [
    ...new Set(allQuestionNodes.map((q) => q.node.alias)),
  ].filter((alias) => !asked.has(alias));
  expect(neverAsked.sort()).toEqual([...NOT_ASKED_IN_MIETE_FLOW].sort());
});
