import { preisspannenByMietspiegeljahr } from "~/mietspiegel/preisspannen";
import { Mietspiegeljahr, Wohnlage } from "~/mietspiegel/types";

/**
 * Sort comparator for Wohnflaeche span strings like "40-60" and "90-".
 * Empty start is treated as 0, empty end as infinity.
 *
 * Example:
 * - "40-60" comes before "60-90"
 * - "90-" comes after "60-90"
 */
export function sortSpanne(a: string, b: string) {
  const [aStartRaw, aEndRaw] = a.split("-");
  const [bStartRaw, bEndRaw] = b.split("-");
  const aStart = aStartRaw === "" ? 0 : Number(aStartRaw);
  const bStart = bStartRaw === "" ? 0 : Number(bStartRaw);
  const aEnd = aEndRaw === "" ? Number.POSITIVE_INFINITY : Number(aEndRaw);
  const bEnd = bEndRaw === "" ? Number.POSITIVE_INFINITY : Number(bEndRaw);

  if (aStart !== bStart) return aStart - bStart;
  return aEnd - bEnd;
}

/**
 * Parses a span string to numeric bounds.
 * Returns `max: null` for open-ended ranges (e.g. "90-").
 *
 * Example:
 * - parseWohnflaecheSpanne("40-60") => { min: 40, max: 60 }
 * - parseWohnflaecheSpanne("90-") => { min: 90, max: null }
 */
export function parseWohnflaecheSpanne(spanne: string): {
  min: number;
  max: number | null;
} {
  if (!spanne.includes("-")) {
    const value = Number(spanne);
    return Number.isNaN(value)
      ? { min: 0, max: null }
      : { min: value, max: value };
  }

  const [minRaw = "", maxRaw = ""] = spanne.split("-");
  const min = minRaw === "" ? 0 : Number(minRaw);
  const max = maxRaw === "" ? null : Number(maxRaw);
  return { min, max };
}

/**
 * Resolves all available Wohnflaeche Spannen for a specific Mietspiegel tuple.
 * Returns a sorted list and filters out empty table entries.
 *
 * Example:
 * - getWohnflaecheSpanneOptions("2024", "1918-1949", "einfach")
 *   => ["40-60", "60-90", "90-"] (if these rows exist in the table)
 */
export function getWohnflaecheSpanneOptions(
  mietspiegeljahr: Mietspiegeljahr | undefined,
  baujahrSpanne: string | undefined,
  wohnlage: Wohnlage | undefined,
) {
  if (!mietspiegeljahr || !baujahrSpanne || !wohnlage) return [];
  const preisspannenForWohnlage = preisspannenByMietspiegeljahr[
    mietspiegeljahr
  ][
    baujahrSpanne as keyof (typeof preisspannenByMietspiegeljahr)[typeof mietspiegeljahr]
  ]?.[wohnlage] as Record<string, unknown> | undefined;
  if (!preisspannenForWohnlage) return [];

  return Object.entries(preisspannenForWohnlage)
    .filter(([, preisspanne]) => Boolean(preisspanne))
    .map(([spanne]) => spanne)
    .sort(sortSpanne);
}

/**
 * Picks the matching Wohnfläche Spanne for a specific Wohnfläche.
 * Lower bound is inclusive, upper bound is exclusive; open-ended ranges match all larger values.
 *
 * Example:
 * - options = ["40-60", "60-90", "90-"]
 * - wohnflaeche=59 -> "40-60"
 * - wohnflaeche=60 -> "60-90"
 * - wohnflaeche=95 -> "90-"
 */
export function getSelectedWohnflaecheSpanne(
  wohnflaeche: number,
  wohnflaecheSpanneOptions: string[],
) {
  return wohnflaecheSpanneOptions.find((spanne) => {
    const { min, max } = parseWohnflaecheSpanne(spanne);
    return wohnflaeche >= min && (max === null || wohnflaeche < max);
  });
}
