import { readFileSync } from "node:fs";

import { expect, test } from "vitest";

import { answersToMerkmalStateMapping } from "~/form/mappings/merkmale";
import { merkmaleByYear } from "~/mietspiegel/merkmale";
import { sondermerkmale } from "~/mietspiegel/sondermerkmale";

// Independently enumerated PDF bullets, not generated from application keys.
// Cells are 1-based PDF page numbers; "-" means absent in that edition.
// The short source labels identify entries, not their complete eligibility rules.
// CI uses this frozen test data without requiring local PDFs or a PDF parser.
const [header, ...lines] = readFileSync(
  new URL("./reference/merkmal-inventory.tsv", import.meta.url),
  "utf8",
)
  .trim()
  .split("\n")
  .map((line) => line.split("\t"));
const jahre = header.slice(2);
const inventory = (jahr: string, sondermerkmal = false) =>
  lines
    .filter(
      ([merkmal, , ...pages]) =>
        merkmal.startsWith("[Sondermerkmal]") === sondermerkmal &&
        pages[jahre.indexOf(jahr)] !== "-",
    )
    .map(([merkmal]) => merkmal);

const counts = [87, 81, 81, 81, 81, 84, 83];

test("source inventory contains 578 ordinary entries and seven 2015 Sondermerkmale", () => {
  expect(jahre).toEqual([
    "2015",
    "2017",
    "2019",
    "2021",
    "2023",
    "2024",
    "2026",
  ]);
  expect(jahre.map((jahr) => inventory(jahr).length)).toEqual(counts);
  expect(counts.reduce((sum, count) => sum + count, 0)).toBe(578);
  expect(new Set(lines.map(([merkmal]) => merkmal)).size).toBe(lines.length);
  for (const [merkmal, beleg, ...pages] of lines) {
    expect(merkmal).toMatch(
      /^\[(Bad|Küche|Wohnung|Gebäude|Umfeld)[+-]\]|^\[Sondermerkmal\]/,
    );
    expect(beleg.length).toBeGreaterThan(0);
    expect(pages).toHaveLength(jahre.length);
    expect(pages.every((page) => page === "-" || /^[1-9]\d*$/.test(page))).toBe(
      true,
    );
  }
  expect(inventory("2015", true)).toHaveLength(7);
  expect(jahre.slice(1).map((jahr) => inventory(jahr, true))).toEqual([
    [],
    [],
    [],
    [],
    [],
    [],
  ]);
});

test.each(jahre)(
  "%s: every source Merkmal exists in production and has an answer mapping",
  (jahr) => {
    const expected = inventory(jahr);
    const actual = [...merkmaleByYear[jahr as keyof typeof merkmaleByYear]];
    expect(actual.sort()).toEqual([...expected].sort());
    expect(
      expected.filter((merkmal) => !(merkmal in answersToMerkmalStateMapping)),
    ).toEqual([]);
  },
);

test("2015: every source Sondermerkmal exists in production", () => {
  expect(Object.keys(sondermerkmale).sort()).toEqual(
    inventory("2015", true).sort(),
  );
});

test("an entirely omitted source item is detected even if production reachability stays green", () => {
  const omitted =
    "[Gebäude-] Wohnung ab fünftem Obergeschoss ohne Personenaufzug";
  const definitions = new Set(
    [...merkmaleByYear["2015"]].filter((merkmal) => merkmal !== omitted),
  );
  expect(
    inventory("2015").filter((merkmal) => !definitions.has(merkmal)),
  ).toEqual([omitted]);
});
