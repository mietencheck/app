/**
 * Test support: for every Mietspiegel edition, contract situation and
 * construction period, determines which Merkmale the questionnaire can mark
 * as present ("checked"). Used by the reachability test and the review sheet.
 */
import { getMerkmalStates } from "~/form/api";
import { FinalAnswers } from "~/form/flow-machine-runtime";
import {
  answersToMerkmalStateMapping,
  Condition,
  ConditionGroup,
} from "~/form/mappings/merkmale";
import { merkmaleByYear } from "~/mietspiegel/merkmale";
import { Merkmal } from "~/mietspiegel/types";

import {
  contractScenarios,
  evaluateAnswers,
  findAnswers,
  Period,
  periodsFor,
  questionCopiesByAlias,
  reachQuestions,
  Scenario,
} from "./flow-paths";

type Mapping = { checked_if: Condition | ConditionGroup };

/** Alternative answer sets, each of which would satisfy the mapping. */
export function answerAlternatives(
  mapping: Mapping,
): Record<string, unknown>[] {
  const checkedIf = mapping.checked_if as Record<string, unknown>;
  if ("conditions" in checkedIf && "logic" in checkedIf) {
    const conditions = checkedIf.conditions as Record<string, unknown>[];
    return checkedIf.logic === "and"
      ? [Object.assign({}, ...conditions)]
      : conditions.map((c) => ({ ...c }));
  }
  return [{ ...checkedIf }];
}

export const mappingFor = (merkmal: string) =>
  (answersToMerkmalStateMapping as Record<string, Mapping>)[merkmal];

function isChecked(merkmal: string) {
  return (e: ReturnType<typeof evaluateAnswers>) =>
    getMerkmalStates(e.answers as FinalAnswers, e.visible)[
      merkmal as Merkmal
    ] === "checked";
}

/** Answers marking `merkmal` as present in the scenario, or undefined. */
export function reachMerkmal(merkmal: string, scenario: Scenario) {
  for (const required of answerAlternatives(mappingFor(merkmal))) {
    const found = reachQuestions(required, scenario, isChecked(merkmal));
    if (found) return found;
  }
  return undefined;
}

export type CoverageRow = {
  merkmal: string;
  /** Period label → whether the Merkmal can be marked as present. */
  checkable: Record<string, boolean>;
  /** Ids of the question copies that can be asked in this scenario. */
  questionIds: string[];
};

export type ScenarioCoverage = {
  scenario: Scenario;
  periods: Period[];
  rows: CoverageRow[];
};

/** Flats first occupied after 2014 always leave the flow (Neubau, § 556f BGB). */
export const LAST_BAUJAHR_IN_SCOPE = 2014;

export function coverageFor(scenario: Scenario): ScenarioCoverage {
  const periods = periodsFor(scenario.jahr).filter(
    (period) => period.from <= LAST_BAUJAHR_IN_SCOPE,
  );
  const merkmale = [...merkmaleByYear[scenario.jahr]];
  const rows = merkmale.map((merkmal) => {
    const aliases = new Set(
      answerAlternatives(mappingFor(merkmal)).flatMap(Object.keys),
    );
    const checkable = Object.fromEntries(
      periods.map((period) => [
        period.label,
        Boolean(reachMerkmal(merkmal, { ...scenario, period })),
      ]),
    );
    const questionIds = [...aliases]
      .flatMap((alias) => askedCopyIds(alias, scenario))
      .sort();
    return { merkmal, checkable, questionIds };
  });
  return { scenario, periods, rows };
}

const askedCopyCache = new Map<string, string[]>();

/** Ids of the copies of `alias` that can be asked in the scenario. */
export function askedCopyIds(alias: string, scenario: Scenario): string[] {
  const key = `${scenario.jahr}|${scenario.label}|${alias}`;
  if (!askedCopyCache.has(key)) {
    askedCopyCache.set(
      key,
      (questionCopiesByAlias.get(alias) ?? [])
        .filter((copy) =>
          findAnswers(
            copy.literals,
            {},
            scenario,
            (e) => e.nodeIds.get(alias) === copy.node.id,
          ),
        )
        .map((copy) => copy.node.id),
    );
  }
  return askedCopyCache.get(key)!;
}

export const allScenarios = contractScenarios;

/* ------------------------------------------------------------------------ */
/* Construction-period restrictions stated in the Mietspiegel text           */
/* ------------------------------------------------------------------------ */

/**
 * Periods the Mietspiegel text excludes, e.g. "gilt nicht für die
 * Baualtersklassen ab 2002" or "gilt nicht in der Baualtersklasse 1973 bis
 * 1990 Ost". Returns the excluded period labels.
 */
export function excludedPeriodsFromText(
  text: string,
  periods: Period[],
): string[] {
  const excluded = new Set<string>();
  const exclude = (hit: (p: Period) => boolean) =>
    periods.filter(hit).forEach((p) => excluded.add(p.label));

  // "gilt nicht für die Baualtersklassen ab 2002 / bis 1949 / 1973 bis 1990 Ost"
  const notFor =
    /gilt nicht (?:für|in) (?:die|der) Baualtersklassen? (?:ab (\d{4})|bis (\d{4})|(\d{4}) bis (\d{4})( Ost| West)?)/gi;
  for (const [, ab, bis, from, to, region] of text.matchAll(notFor)) {
    exclude((p) =>
      ab
        ? p.from >= Number(ab)
        : bis
          ? p.to <= Number(bis)
          : p.from === Number(from) &&
            p.to === Number(to) &&
            (!region || p.ost === (region.trim() === "Ost")),
    );
  }
  // "gilt für Baualtersklassen bis einschließlich 2001"
  for (const [, bis] of text.matchAll(
    /gilt für (?:die )?Baualtersklassen? bis (?:einschließlich )?(\d{4})/gi,
  )) {
    exclude((p) => p.from > Number(bis));
  }
  // "vor 2002 bezugsfertig", "ab 2009 (wenn Bezugsfertigkeit ... vor diesem
  // Zeitpunkt)", "nach dem 01.07.1994 (wenn Baujahr vor diesem Zeitpunkt)"
  for (const [, , year] of text.matchAll(
    /(vor|ab|nach dem (?:\d{2}\.\d{2}\.)?)\s?(\d{4})(?= bezugsfertig|\s*\(wenn (?:Bezugsfertigkeit|Baujahr))/gi,
  )) {
    exclude((p) => p.from >= Number(year));
  }
  return [...excluded];
}

export type Deviation = {
  jahr: string;
  scenario: string;
  merkmal: string;
  period: string;
  /** What the Mietspiegel text says vs. what the questionnaire does. */
  kind:
    | "Text schließt aus, Fragebogen erlaubt"
    | "Text erlaubt, Fragebogen nie";
};

export function deviationsFor(
  coverage: ScenarioCoverage,
  descriptions: Record<string, string>,
): Deviation[] {
  return coverage.rows.flatMap((row) => {
    const excluded = excludedPeriodsFromText(
      descriptions[row.merkmal] ?? "",
      coverage.periods,
    );
    return coverage.periods.flatMap((period) => {
      const textAllows = !excluded.includes(period.label);
      const checkable = row.checkable[period.label];
      if (textAllows === checkable) return [];
      return [
        {
          jahr: coverage.scenario.jahr,
          scenario: coverage.scenario.label,
          merkmal: row.merkmal,
          period: period.label,
          kind: checkable
            ? ("Text schließt aus, Fragebogen erlaubt" as const)
            : ("Text erlaubt, Fragebogen nie" as const),
        },
      ];
    });
  });
}
