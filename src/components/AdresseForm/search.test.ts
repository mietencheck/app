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

  test('decodes Wohnlage code 3 ("ohne", Straßenverzeichnis 2017) as no Wohnlage', () => {
    // Abram-Joffe-Straße 2, 12489 has code 3 in 2017, "einfach" in 2019 and "mittel" in 2026.
    const adresse = strassenDataRawToAdressen(
      "Abram-Joffe-Straße",
      loadStrassenData("Abram-Joffe-Straße"),
    ).find((a) => a.plz === "12489" && a.nummer === "2");

    expect(adresse).toBeDefined();
    expect(adresse?.lage[2017]).toBeUndefined();
    expect(adresse?.lage[2019]).toEqual({ wohnlage: "einfach", ost: true });
    expect(adresse?.lage[2026]).toEqual({ wohnlage: "mittel", ost: true });
  });

  test("never decodes an unknown Wohnlage code as a Wohnlage", () => {
    const [adresse] = strassenDataRawToAdressen("Teststraße", {
      "10115": { "1": { "2": [3, 0], "11": [7, 0] } },
    });

    expect(adresse.lage).toEqual({});
  });
});
