import { expect, test } from "vitest";

import { Exits } from "~/pages/schnelltest/exit/SchnelltestExit";

import { allExitNodes, reachExit, UI_FORCED } from "./flow-paths";

const MIETE = {
  jahr: "2026",
  label: "Miete",
  pinned: { Typ: "Miete" },
} as const;
const UI = { jahr: "2026", label: "UI", pinned: UI_FORCED } as const;

// Exits of the Miete flow (the Mieterhöhung branch is work in progress).
const mieteExits = allExitNodes.filter((exit) => reachExit(exit, MIETE));
const aliases = (exits: typeof allExitNodes) =>
  [...new Set(exits.map((exit) => exit.node.alias))].sort();

test("the Miete flow has exactly these exits reachable in the UI", () => {
  expect(aliases(mieteExits.filter((exit) => reachExit(exit, UI)))).toEqual([
    "Exit: Ein-/Zweifamilienhäuser oder Reihenhäuser",
    "Exit: Keine Wohnlage gefunden",
    "Exit: Mietspiegel Feld Leer",
    "Exit: Mietvertrag zu alt",
    "Exit: Möblierte Wohnung",
    "Exit: Neubauwohnung",
    "Exit: Sozialwohnung",
    "Exit: Wohnung ohne WC",
  ]);
});

test("Miete exits behind 'Vorherige Mieterhöhung' are unreachable because the UI answers it with Nein", () => {
  expect(aliases(mieteExits.filter((exit) => !reachExit(exit, UI)))).toEqual([
    "Exit: Vorherige Mieterhöhung (Anderer Grund)",
    "Exit: Vorherige Mieterhöhung (Freiwillig)",
    "Exit: Vorherige Mieterhöhung bei Indexmiete (Anderer Grund)",
    "Exit: Vorherige Mieterhöhung bei Indexmiete (Freiwillig)",
    "Exit: Vorherige Mieterhöhung bei Staffelmiete (Anderer Grund)",
    "Exit: Vorherige Mieterhöhung bei Staffelmiete (Freiwillig)",
  ]);
});

test.each(aliases(mieteExits))("%s has an exit page", (alias) => {
  expect(Object.keys(Exits)).toContain(alias);
});
