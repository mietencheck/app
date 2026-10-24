import { default as FlexSearch } from "flexsearch";
import memoize from "memoizerific";
import sanitize from "sanitize-filename";

import strassen from "~/strassenverzeichnis/strassen.json";

import type {
  AdresseWithLage,
  LageInfo,
  LageInfoByJahr,
  StrassenDataRaw,
} from "./types";

async function fetchWithRetryBackOff(url: string): Promise<Response> {
  const MAX_RETRIES = 30;
  for (let retries = 0; retries < MAX_RETRIES + 1; retries++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (retries === MAX_RETRIES) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1.2 ** retries * 500));
    }
  }
  return null as never;
}

export const strassenIndex = new FlexSearch.Index({
  tokenize: "forward",
  // The only charset (afaik) that treats Umlaute as a their base char
  charset: "latin:simple",
});

for (const strasse of strassen) {
  strassenIndex.add(strasse, strasse);
}

const WOHNLAGE_BY_CODE: Partial<Record<number, LageInfo["wohnlage"]>> = {
  0: "einfach",
  1: "mittel",
  2: "gut",
};

export function strassenDataRawToAdressen(
  strasse: string,
  rawData: StrassenDataRaw,
): AdresseWithLage[] {
  const result: AdresseWithLage[] = [];
  for (const [plz, byNummer] of Object.entries(rawData)) {
    for (const [nummer, byJahr] of Object.entries(byNummer)) {
      result.push({
        strasse,
        nummer,
        plz,
        lage: Object.fromEntries(
          Object.entries(byJahr).flatMap(([jahr, [wohnlage, ost]]) => {
            const decoded = WOHNLAGE_BY_CODE[wohnlage];
            // Code 3 ("ohne", Straßenverzeichnis 2017) means the address has
            // no Wohnlage in that edition. Omitting the edition makes the flow
            // exit with "Keine Wohnlage gefunden" instead of guessing one.
            if (!decoded) return [];
            return [
              [
                Number(jahr) + 2015,
                { wohnlage: decoded, ost: Boolean(ost) } satisfies LageInfo,
              ],
            ];
          }),
        ) as LageInfoByJahr,
      });
    }
  }
  return result;
}

export const fetchStrasseData = memoize(0)(async (
  strasse: string,
): Promise<AdresseWithLage[]> => {
  if (!strassenIndex.contain(strasse)) return [];
  const rawData = await fetchWithRetryBackOff(
    "/strassenverzeichnis/" + sanitize(strasse + ".json"),
  ).then((r) => r.json() as Promise<StrassenDataRaw>);

  return strassenDataRawToAdressen(strasse, rawData);
});

// parseInt is a better choice than Number() here because it e.g.:
// - evals to 5 for "5A", where the other evals to NaN
const startsNumeric = (s: string) => !Number.isNaN(parseInt(s, 10));

export function extractNummerQuery(query: string) {
  const parts = query.split(" ");
  const lastPart = parts.at(-1);
  const nummerQuery = lastPart && startsNumeric(lastPart) ? lastPart : null;
  return nummerQuery == null
    ? ([query, null] as const)
    : ([parts.slice(0, -1).join(" "), nummerQuery] as const);
}
