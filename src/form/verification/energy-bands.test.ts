import { expect, test } from "vitest";

import { getMerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import { hash } from "~/l10n";
import { merkmaleDescriptionsByYear } from "~/mietspiegel/merkmale";

import en from "../../../public/locales/en.json";
import {
  contractScenarios,
  evaluateAnswers,
  questionNodeById,
  reachQuestions,
} from "./flow-paths";
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

const verbrauchScenarios = contractScenarios().filter((s) =>
  s.label.startsWith("unterschrieben"),
);

test.each(verbrauchScenarios)(
  "$jahr: existing Verbrauch bands match integer thresholds",
  (scenario) => {
    const { jahr } = scenario;
    const { above, below } = thresholds(jahr);
    expect(above.length + below.length).toBeGreaterThan(0);
    const ids = askedCopyIds("Energieverbrauchskennwert", scenario);
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      const labels = (questionNodeById.get(id)!.answer.options ?? []).map(
        (o) => o.text ?? "",
      );
      expect(bandProblems(labels, above, below)).toEqual([]);
    }
  },
);

// Independently transcribed from the Gebäude energy boxes: printed p.21 (2015),
// p.17 (2017), p.21 (2019), p.19 (2021/2023), p.24 (2024/2026).
// Bedarf thresholds are Verbrauch thresholds increased by 20 percent.
const bedarfGrenzen = (jahr: string) => ({
  above:
    jahr === "2015"
      ? [204, 252, 300]
      : jahr === "2024" || jahr === "2026"
        ? [174, 234, 282]
        : [186, 234, 282],
  below: [96, 120, 144],
});

// Interpret the actual displayed intervals over real numbers, without rounding
// to integers. The inclusive and exclusive ends are deliberately explicit.
function containsBedarf(label: string, value: number): boolean {
  const above = /^Größer als (\d+)(?: bis einschließlich (\d+))? kWh/.exec(
    label,
  );
  if (above) return value > +above[1] && (!above[2] || value <= +above[2]);
  const interval = /^(\d+) bis (einschließlich|kleiner als) (\d+) kWh/.exec(
    label,
  );
  if (interval)
    return (
      value >= +interval[1] &&
      (interval[2] === "einschließlich"
        ? value <= +interval[3]
        : value < +interval[3])
    );
  const below = /^Kleiner als (\d+) kWh/.exec(label);
  if (below) return value >= 0 && value < +below[1];
  throw new Error(`Unknown Bedarf interval: ${label}`);
}

const bedarfScenarios = contractScenarios();

test.each(bedarfScenarios)(
  "$jahr ($label): fractional Bedarf bands and cumulative weighting",
  (scenario) => {
    const { above, below } = bedarfGrenzen(scenario.jahr);
    const values = [
      0,
      175,
      1000,
      ...[...above, ...below].flatMap((t) => [t - 0.1, t, t + 0.1]),
    ];
    const ids = askedCopyIds("Energiebedarfskennwert", scenario);
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      const options = questionNodeById.get(id)!.answer.options!;
      for (const value of values) {
        const matching = options.filter((o) => containsBedarf(o.text!, value));
        expect(matching, `${scenario.jahr}: ${value}`).toHaveLength(1);
        const negative = above.filter((t) => value > t).length;
        const positive = below.filter((t) => value < t).length;
        const alias = negative
          ? "-".repeat(negative)
          : positive
            ? "+".repeat(positive)
            : "0";
        expect(matching[0].alias, `${scenario.jahr}: ${value}`).toBe(alias);
      }
      // Follow each displayed choice through the real questionnaire and mapping.
      for (const option of options) {
        const reached = reachQuestions(
          { Energiebedarfskennwert: option.alias },
          scenario,
          (e) => e.nodeIds.get("Energiebedarfskennwert") === id,
        );
        expect(reached).toBeDefined();
        const states = getMerkmalStates(
          reached!.answers as FinalAnswers,
          reached!.visible,
        );
        const checked = Object.entries(states)
          .filter(
            ([key, state]) =>
              key.includes("Energieverbrauchskennwert") && state === "checked",
          )
          .map(([key]) => key);
        expect(
          checked.filter((key) => key.startsWith("[Gebäude-]")),
        ).toHaveLength(
          option.alias!.startsWith("-") ? option.alias!.length : 0,
        );
        expect(
          checked.filter((key) => key.startsWith("[Gebäude+]")),
        ).toHaveLength(
          option.alias!.startsWith("+") ? option.alias!.length : 0,
        );
        const translated = (en.strings as Record<string, string>)[
          hash(option.text!)
        ];
        expect(translated).toBeTruthy();
        expect(translated).not.toContain("[DE]");
        expect(translated.match(/\d+/g)).toEqual(option.text!.match(/\d+/g));
      }
    }
  },
);

test.each(bedarfScenarios)(
  "$jahr ($label): unknown certificate does not apply stale Bedarf bands",
  (scenario) => {
    const reached = reachQuestions(
      { Energiebedarfskennwert: "---" },
      scenario,
      () => true,
    )!;
    expect(reached).toBeDefined();
    const unknown = evaluateAnswers({
      ...reached.answers,
      "Kennt Energieverbrauch oder Energiebedarf": "Nein",
    });
    expect(unknown.visible.has("Energiebedarfskennwert")).toBe(false);
    const states = getMerkmalStates(
      unknown.answers as FinalAnswers,
      unknown.visible,
    );
    expect(
      Object.entries(states).filter(
        ([key, state]) =>
          key.includes("Energieverbrauchskennwert") && state === "checked",
      ),
    ).toEqual([]);
  },
);
