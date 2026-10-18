import { expect, test } from "vitest";

import { allQuestionNodes, findAnswers } from "./flow-paths";
import { allScenarios } from "./merkmal-coverage";
import { AskedQuestion, renderQuestionCatalogue } from "./review-sheets";

// Every question copy that can be asked in the Miete flow, per edition.
const asked: AskedQuestion[] = allQuestionNodes.flatMap(
  ({ node, literals }) => {
    const jahre = allScenarios()
      .filter((scenario) =>
        findAnswers(
          literals,
          {},
          scenario,
          (evaluation) => evaluation.nodeIds.get(node.alias) === node.id,
        ),
      )
      .map((scenario) => scenario.jahr);
    return jahre.length > 0
      ? [{ id: node.id, jahre: [...new Set(jahre)] }]
      : [];
  },
);

// Questions that are never asked in the Miete flow: the Mieterhöhung branch
// (work in progress, hidden in the UI) and the follow-ups of "Vorherige
// Mieterhöhung", which the UI always answers with "Nein".
const NOT_ASKED_IN_MIETE_FLOW = [
  "Datum Mieterhöhungsschreiben",
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
  const askedAliases = new Set(
    asked.map(
      ({ id }) => allQuestionNodes.find((q) => q.node.id === id)!.node.alias,
    ),
  );
  const neverAsked = [
    ...new Set(allQuestionNodes.map((q) => q.node.alias)),
  ].filter((alias) => !askedAliases.has(alias));
  expect(neverAsked.sort()).toEqual([...NOT_ASKED_IN_MIETE_FLOW].sort());
});

test("question catalogue is up to date", async () => {
  await expect(renderQuestionCatalogue(asked)).toMatchFileSnapshot(
    "../../../docs/review/fragen.md",
  );
});
