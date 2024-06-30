import { default as FlexSearch } from "flexsearch";
import memoize from "memoizerific";
import sanitize from "sanitize-filename";

import strassen from "~/../public/strassenverzeichnis/strassen.json";
import type {
  AdresseWithLage,
  LageInfo,
  LageInfoByJahr,
  StrassenDataRaw,
} from "~/form/adresse/types";

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

export const fetchStrasseData = memoize(0)(async (
  strasse: string,
): Promise<AdresseWithLage[]> => {
  if (!strassenIndex.contain(strasse)) return [];
  const rawData = await fetchWithRetryBackOff(
    "/strassenverzeichnis/" + sanitize(strasse + ".json"),
  ).then((r) => r.json() as Promise<StrassenDataRaw>);

  const result = [];
  for (const [plz, byNummer] of Object.entries(rawData)) {
    for (const [nummer, byJahr] of Object.entries(byNummer)) {
      const adresse = {
        strasse,
        nummer,
        plz,
        lage: Object.fromEntries(
          Object.entries(byJahr).map(([jahr, [wohnlage, laut, ost]]) => [
            Number(jahr) + 2015,
            {
              wohnlage:
                (["einfach", "mittel", "gut"] as const)[wohnlage] ?? "gut",
              laut: Boolean(laut),
              ost: Boolean(ost),
            } satisfies LageInfo,
          ]),
        ) as LageInfoByJahr,
      } satisfies AdresseWithLage;
      result.push(adresse);
    }
  }
  return result;
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
