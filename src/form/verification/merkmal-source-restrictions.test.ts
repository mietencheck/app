import { expect, test } from "vitest";

import { periodsFor } from "./flow-paths";
import { excludedPeriodsFromText } from "./merkmal-coverage";

// Source clauses transcribed independently of production descriptions.
const periods = periodsFor("2024");

test.each([
  "Wandhängendes WC mit in der Wand eingelassenem Spülkasten (gilt nicht für die Baualtersklassen ab 2002) oder hochwertiges Stand-WC",
  "Strukturheizkörper als Handtuchwärmer im Bad (gilt für die Baualtersklassen bis einschließlich 2001); falls elektrisch betreibbar: alle Baujahre",
  "Strukturheizkörper als Handtuchwärmer im Bad (gilt für Baualtersklassen bis einschließlich 2001); sofern zusätzlich elektrisch betreibbar: alle Baujahre",
  "Wärmedämmung zusätzlich zur vorhandenen Bausubstanz oder Einbau/Installation einer modernen Heizanlage ab 2009 (wenn Bezugsfertigkeit des Gebäudes/der Wohnung vor diesem Zeitpunkt)",
])("an eligible alternative keeps the whole Merkmal eligible: %s", (text) => {
  expect(excludedPeriodsFromText(text, periods)).toEqual([]);
});

test("a shared restriction before OR still applies to both window alternatives", () => {
  const text =
    "Wohngebäude/Wohnungen die vor 2002 bezugsfertig geworden sind: überwiegend Wärmeschutzverglasung (Einbau ab 2002) oder Schallschutzfenster";
  expect(excludedPeriodsFromText(text, periods)).toEqual([
    "2002-2009",
    "2010-2015",
    "2016-2022",
  ]);
});

test.each([
  "Wandhängendes WC mit in der Wand eingelassenem Spülkasten (gilt nicht für die Baualtersklassen ab 2002)",
  "Strukturheizkörper als Handtuchwärmer im Bad (gilt für Baualtersklassen bis einschließlich 2001)",
])("a restricted alternative alone remains restricted: %s", (text) => {
  expect(excludedPeriodsFromText(text, periods)).toEqual([
    "2002-2009",
    "2010-2015",
    "2016-2022",
  ]);
});
