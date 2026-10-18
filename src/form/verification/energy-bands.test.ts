import { expect, test } from "vitest";

import { merkmaleDescriptionsByYear } from "~/mietspiegel/merkmale";

import { contractScenarios, questionNodeById } from "./flow-paths";
import { askedCopyIds } from "./merkmal-coverage";

/**
 * The energy questions offer kWh/(m²a) bands. Their edges must match the
 * thresholds of the Orientierungshilfe ("größer als 145", "kleiner als 120").
 * Per Mietspiegel, thresholds for an Energiebedarfskennwert are 20 % higher.
 */
type Band = { lo: number; hi: number; label: string };

function parseBand(label: string): Band {
  const between = /Zwischen (\d+) und (\d+)/i.exec(label);
  if (between) return { lo: +between[1], hi: +between[2], label };
  const above = /Größer als (\d+)/i.exec(label);
  if (above) return { lo: +above[1] + 1, hi: Infinity, label };
  const below = /Kleiner als (\d+)/i.exec(label);
  if (below) return { lo: 0, hi: +below[1] - 1, label };
  throw new Error(`Unknown band: ${label}`);
}

function thresholds(jahr: string) {
  const texts = Object.values(merkmaleDescriptionsByYear[jahr]).join("\n");
  const numbers = (pattern: RegExp) =>
    [...texts.matchAll(pattern)].map((m) => Number(m[1]));
  return {
    above: numbers(/Energieverbrauchskennwert größer als (\d+) kWh/gi),
    below: numbers(/Energieverbrauchskennwert kleiner als (\d+) kWh/gi),
  };
}

/** Problems in the bands of one question copy, in words. */
function bandProblems(labels: string[], above: number[], below: number[]) {
  const bands = labels.map(parseBand).sort((a, b) => a.lo - b.lo);
  const problems: string[] = [];
  bands.slice(1).forEach((band, i) => {
    const previous = bands[i];
    if (band.lo !== previous.hi + 1)
      problems.push(
        `gap/overlap between "${previous.label}" and "${band.label}"`,
      );
  });
  for (const t of above) {
    // "größer als t": the first value counting as worse is floor(t) + 1.
    const start = Math.floor(t) + 1;
    if (!bands.some((b) => b.lo === start))
      problems.push(`no band starts at ${start} (größer als ${t})`);
  }
  for (const t of below) {
    // "kleiner als t": the last value counting as better is ceil(t) - 1.
    const end = Math.ceil(t) - 1;
    if (!bands.some((b) => b.hi === end))
      problems.push(`no band ends at ${end} (kleiner als ${t})`);
  }
  return problems;
}

const cases = contractScenarios()
  .filter((s) => s.label.startsWith("unterschrieben"))
  .flatMap((scenario) =>
    (["Energieverbrauchskennwert", "Energiebedarfskennwert"] as const).map(
      (alias) => ({ jahr: scenario.jahr, alias, scenario }),
    ),
  );

// Known deviations, to be fixed in the floma.io editor.
const KNOWN_PROBLEMS: Record<string, string[]> = {
  // 250 kWh * 1.2 = 300: a value of exactly 300 falls between the bands.
  "2015 Energiebedarfskennwert": [
    'gap/overlap between "Zwischen 253 und 299 kWH/(m2*a)" and "Größer als 300 kWH/(m2*a)"',
  ],
  // 145 kWh * 1.2 = 174: values of 175 must already count as worse.
  "2024 Energiebedarfskennwert": ["no band starts at 175 (größer als 174)"],
  "2026 Energiebedarfskennwert": ["no band starts at 175 (größer als 174)"],
};

test.each(cases)(
  "$jahr: $alias bands match the thresholds",
  ({ jahr, alias, scenario }) => {
    const factor = alias === "Energiebedarfskennwert" ? 1.2 : 1;
    const { above, below } = thresholds(jahr);
    expect(above.length + below.length).toBeGreaterThan(0);
    const ids = askedCopyIds(alias, scenario);
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      const labels = (questionNodeById.get(id)!.answer.options ?? []).map(
        (o) => o.text ?? "",
      );
      expect(
        bandProblems(
          labels,
          above.map((t) => Math.round(t * factor * 100) / 100),
          below.map((t) => Math.round(t * factor * 100) / 100),
        ),
      ).toEqual(KNOWN_PROBLEMS[`${jahr} ${alias}`] ?? []);
    }
  },
);
