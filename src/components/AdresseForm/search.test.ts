import { readFileSync } from "node:fs";
import { join } from "node:path";

import sanitize from "sanitize-filename";
import { describe, expect, test } from "vitest";

import { strassenDataRawToAdressen } from "./search";
import type { StrassenDataRaw } from "./types";

/** Address where Wohnlage was reclassified between Mietspiegel editions (gut → mittel from 2019). */
const STRASSE = "Aachener Straße";
const PLZ = "10713";
const NUMMER = "1";

function loadStrassenData(strasse: string): StrassenDataRaw {
  const file = join(
    process.cwd(),
    "public/strassenverzeichnis",
    sanitize(strasse + ".json"),
  );
  return JSON.parse(readFileSync(file, "utf8")) as StrassenDataRaw;
}

describe("strassenDataRawToAdressen", () => {
  test("decodes Wohnlage per Mietspiegel year from Straßenverzeichnis data", () => {
    const adressen = strassenDataRawToAdressen(
      STRASSE,
      loadStrassenData(STRASSE),
    );
    const adresse = adressen.find((a) => a.plz === PLZ && a.nummer === NUMMER);

    expect(adresse).toBeDefined();
    expect(adresse?.lage[2015]?.wohnlage).toBe("gut");
    expect(adresse?.lage[2017]?.wohnlage).toBe("gut");
    expect(adresse?.lage[2019]?.wohnlage).toBe("mittel");
    expect(adresse?.lage[2023]?.wohnlage).toBe("mittel");
    expect(adresse?.lage[2024]?.wohnlage).toBe("mittel");
    expect(adresse?.lage[2026]?.wohnlage).toBe("mittel");
  });
});
