/**
 * Test support: finds answers that lead the questionnaire to a given question
 * or exit, so tests can prove that every Merkmal and every exit is reachable.
 *
 * The flow is a tree of `If` nodes. Reaching a node requires the test of its
 * own case to be true and the tests of all earlier cases of the same `If` to
 * be false (first matching case wins). We collect these literals per node,
 * search for an assignment that satisfies them and then confirm it by running
 * the real flow machine, so a found path is never a false positive.
 */
import { ungroup } from "flow-machine";

import { baujahrSpannenByMietspiegeljahr } from "~/mietspiegel/baujahrSpannen";
import { Mietspiegeljahr } from "~/mietspiegel/types";

import { applyDerivedAnswers } from "../flow-machine-derived-answers";
import { flowMachine } from "../flow-machine-runtime";
import flow from "../flow.fm.json";

/* ------------------------------------------------------------------------ */
/* Flow structure                                                            */
/* ------------------------------------------------------------------------ */

type Option = { id: string; alias?: string | null; text?: string };
type Answer = { type: string; options?: Option[] };
export type FlowQuestion = {
  id: string;
  type: "Question";
  alias: string;
  text: string;
  info?: string | null;
  answer: Answer;
};
export type FlowExit = {
  id: string;
  type: "Exit";
  alias: string;
  text?: string;
};

type Comparison = {
  type: string;
  negated?: boolean;
  questionRef?: { value: string };
  operator?: string;
  comparands?: unknown[];
  value?: unknown;
  conditions?: Comparison[];
};
type Literal = { test: Comparison; expected: boolean };

export type PathNode<T> = { node: T; literals: Literal[]; section: string };

const questionNodes: PathNode<FlowQuestion>[] = [];
const exitNodes: PathNode<FlowExit>[] = [];

function walk(block: unknown[], literals: Literal[], section: string) {
  for (const raw of block) {
    const node = raw as Record<string, unknown>;
    switch (node.type) {
      case "Question":
        questionNodes.push({
          node: node as unknown as FlowQuestion,
          literals,
          section,
        });
        break;
      case "Exit":
        exitNodes.push({
          node: node as unknown as FlowExit,
          literals,
          section,
        });
        break;
      case "Group":
        walk(
          node.block as unknown[],
          literals,
          section || String(node.alias ?? node.title ?? ""),
        );
        break;
      case "If": {
        const cases = node.cases as { test: Comparison; block: unknown[] }[];
        const negatedSoFar: Literal[] = [];
        for (const c of cases) {
          walk(
            c.block,
            [...literals, ...negatedSoFar, { test: c.test, expected: true }],
            section,
          );
          negatedSoFar.push({ test: c.test, expected: false });
        }
        walk(
          (node.alternate as unknown[]) ?? [],
          [...literals, ...negatedSoFar],
          section,
        );
        break;
      }
    }
  }
}
walk((flow as unknown as { main: unknown[] }).main, [], "");

export const allQuestionNodes = questionNodes;
export const allExitNodes = exitNodes;

export const questionCopiesByAlias = new Map<
  string,
  PathNode<FlowQuestion>[]
>();
for (const q of questionNodes) {
  if (!q.node.alias) continue;
  questionCopiesByAlias.set(q.node.alias, [
    ...(questionCopiesByAlias.get(q.node.alias) ?? []),
    q,
  ]);
}

export const questionNodeById = new Map(
  questionNodes.map((q) => [q.node.id, q.node]),
);

/** The first copy wins for wording: all copies share option ids. */
export function questionByAlias(alias: string): FlowQuestion | undefined {
  return questionCopiesByAlias.get(alias)?.[0]?.node;
}

/* ------------------------------------------------------------------------ */
/* Condition evaluation (mirrors flow-machine's checkCondition)              */
/* ------------------------------------------------------------------------ */

type IdState = Record<string, unknown>;
const UNANSWERED = undefined;

function literalValue(c: { type?: string; value?: unknown } | unknown) {
  return typeof c === "object" && c !== null && "value" in c
    ? (c as { value: unknown }).value
    : c;
}

function evaluate(test: Comparison, state: IdState): boolean {
  let result: boolean;
  if (test.type === "LogicalOperation") {
    const parts = (test.conditions ?? []).map((c) => evaluate(c, state));
    result =
      test.operator === "and" ? parts.every(Boolean) : parts.some(Boolean);
  } else {
    const a = state[test.questionRef!.value];
    const comparands = (test.comparands ?? []).map(literalValue);
    switch (test.type) {
      case "AnswerOptionComparison":
      case "AnswerMultiOptionComparison": {
        // flow-machine: every given answer must be one of the comparands.
        const given = typeof a === "string" ? [a] : Array.isArray(a) ? a : [];
        result = given.length > 0 && given.every((v) => comparands.includes(v));
        break;
      }
      case "AnswerNumberComparison": {
        const ops: Record<string, (x: number, y: number) => boolean> = {
          is: (x, y) => x == y,
          gt: (x, y) => x > y,
          gte: (x, y) => x >= y,
          lt: (x, y) => x < y,
          lte: (x, y) => x <= y,
        };
        result =
          a !== UNANSWERED &&
          a !== null &&
          comparands.some((b) => ops[test.operator!](a as number, b as number));
        break;
      }
      case "AnswerBooleanComparison":
        result = a == test.value;
        break;
      default:
        result = false;
    }
  }
  return test.negated ? !result : result;
}

function aliasesOf(test: Comparison): string[] {
  return test.type === "LogicalOperation"
    ? (test.conditions ?? []).flatMap(aliasesOf)
    : [test.questionRef!.value];
}

function numbersFor(alias: string, literals: Literal[]): number[] {
  const values = new Set<number>();
  const visit = (t: Comparison) => {
    if (t.type === "LogicalOperation") return t.conditions?.forEach(visit);
    if (t.type !== "AnswerNumberComparison" || t.questionRef?.value !== alias)
      return;
    for (const c of t.comparands ?? []) {
      const n = Number(literalValue(c));
      values
        .add(n - 1)
        .add(n)
        .add(n + 1);
    }
  };
  literals.forEach((l) => visit(l.test));
  return [...values];
}

/* ------------------------------------------------------------------------ */
/* Scenarios                                                                 */
/* ------------------------------------------------------------------------ */

/** Construction years the UI can produce: bucket lower bounds or a typed year. */
const BAUJAHR_VALUES = [
  1918,
  1919,
  1950,
  1965,
  1973,
  1986,
  ...Array.from({ length: 2026 - 1991 + 1 }, (_, i) => 1991 + i),
];

export type Period = { label: string; from: number; to: number; ost?: boolean };

export function periodsFor(jahr: Mietspiegeljahr): Period[] {
  return baujahrSpannenByMietspiegeljahr[jahr].map((label) => {
    const [, region, range] = /^(?:([WO]):)?(.*)$/.exec(label)!;
    const [from, to] = range.split("-").map(Number);
    return {
      label,
      from: from || 0,
      to,
      ost: region === "O" ? true : region === "W" ? false : undefined,
    };
  });
}

export type Scenario = {
  /** Mietspiegel edition the scenario is evaluated against. */
  jahr: Mietspiegeljahr;
  /** Human-readable contract situation, e.g. "unterschrieben 2024-2026". */
  label: string;
  /** Answers fixed for this scenario (alias space). */
  pinned: Record<string, unknown>;
  period?: Period;
};

const VERTRAGSDATUM_BY_JAHR: Record<Mietspiegeljahr, string> = {
  "2015": "2015-2016",
  "2017": "2016-2018",
  "2019": "2018-2020",
  "2021": "2020-2022",
  "2023": "2022-2024",
  "2024": "2024-2026",
  "2026": ">2026",
};

/** Answers the UI always forces (see AnswersProvider in flow-machine.tsx). */
export const UI_FORCED = { Typ: "Miete", "Vorherige Mieterhöhung": "Nein" };

export function contractScenarios(): Scenario[] {
  const signed = (Object.keys(VERTRAGSDATUM_BY_JAHR) as Mietspiegeljahr[]).map(
    (jahr) => ({
      jahr,
      label: `unterschrieben, Vertragsdatum ${VERTRAGSDATUM_BY_JAHR[jahr]}`,
      pinned: {
        ...UI_FORCED,
        Unterschrieben: "Ja",
        Vertragsdatum: VERTRAGSDATUM_BY_JAHR[jahr],
      },
    }),
  );
  return [
    ...signed,
    {
      jahr: "2026",
      label: "noch nicht unterschrieben",
      pinned: { ...UI_FORCED, Unterschrieben: "Nein" },
    },
  ];
}

/** Neutral answers that pass the Schnelltest without triggering an exit. */
export const BASE_ANSWERS: Record<string, unknown> = {
  ...UI_FORCED,
  Unterschrieben: "Ja",
  Mietart: "Normal",
  Nettokaltmiete: 500,
  Dachgeschoss: "Nein",
  Qm: 60,
  Wohnlage: "mittel",
  Ost: false,
  "Wohnung hat Sammelheizung": "Ja",
  "Badezimmer in Wohnung": "Ja",
  Ausnahmen: ["Keine"],
  "Baujahr vor 1.10.2014": "Ja",
};

/* ------------------------------------------------------------------------ */
/* Solving                                                                   */
/* ------------------------------------------------------------------------ */

function optionIdFor(alias: string, value: unknown): unknown {
  const q = questionByAlias(alias);
  const options = q?.answer.options;
  if (!options) return value;
  if (Array.isArray(value))
    return value.map((v) => options.find((o) => o.alias === v)?.id ?? v);
  return options.find((o) => o.alias === value)?.id ?? value;
}

function aliasValueFor(alias: string, value: unknown): unknown {
  const options = questionByAlias(alias)?.answer.options;
  if (!options) return value;
  const toAlias = (v: unknown) => options.find((o) => o.id === v)?.alias || v;
  return Array.isArray(value) ? value.map(toAlias) : toAlias(value);
}

function domainFor(
  alias: string,
  literals: Literal[],
  scenario: Scenario | undefined,
): unknown[] {
  if (alias === "Baujahr") {
    const p = scenario?.period;
    return BAUJAHR_VALUES.filter((y) => !p || (y >= p.from && y <= p.to));
  }
  if (alias === "Ost" && scenario?.period?.ost !== undefined)
    return [scenario.period.ost];
  const q = questionByAlias(alias);
  const base = BASE_ANSWERS[alias];
  const preferred = base === undefined ? [] : [optionIdFor(alias, base)];
  let values: unknown[];
  switch (q?.answer.type) {
    case "ChoiceAnswer":
      values = q.answer.options!.map((o) => o.id);
      break;
    case "MultiChoiceAnswer":
      values = q.answer.options!.map((o) => [o.id]);
      break;
    case "NumberAnswer":
      values = numbersFor(alias, literals).filter((n) => n > 0);
      break;
    case "BooleanAnswer":
      values = [true, false];
      break;
    default:
      values = [];
  }
  return [...preferred, ...values, UNANSWERED];
}

function solve(
  literals: Literal[],
  fixed: IdState,
  scenario: Scenario | undefined,
  limit = 200000,
): IdState | undefined {
  const free = [...new Set(literals.flatMap((l) => aliasesOf(l.test)))].filter(
    (a) => !(a in fixed),
  );
  const domains = free.map((a) => domainFor(a, literals, scenario));
  const assignment: IdState = { ...fixed };
  let steps = 0;

  const consistent = () =>
    literals.every((l) => {
      const needed = aliasesOf(l.test);
      if (!needed.every((a) => a in assignment)) return true;
      return evaluate(l.test, assignment) === l.expected;
    });

  if (!consistent()) return undefined;

  const search = (i: number): boolean => {
    if (++steps > limit) return false;
    if (i === free.length) return true;
    for (const value of domains[i]) {
      assignment[free[i]] = value;
      if (consistent() && search(i + 1)) return true;
    }
    delete assignment[free[i]];
    return false;
  };
  return search(0) ? assignment : undefined;
}

/** Keep construction-year inputs consistent with the derived `Baujahr`. */
function withBaujahrInputs(answers: Record<string, unknown>) {
  const baujahr = answers.Baujahr;
  if (typeof baujahr !== "number") return answers;
  const buckets: [number, string][] = [
    [1918, "-1918"],
    [1919, "1919-1949"],
    [1950, "1950-1964"],
    [1965, "1965-1972"],
    [1973, "1973-1985"],
    [1986, "1986-1990"],
  ];
  const bucket = buckets.find(([year]) => year === baujahr)?.[1];
  return {
    ...answers,
    Dachgeschoss: "Nein",
    "Baujahr vor 1991": baujahr >= 1991 ? "1991-" : bucket,
    ...(baujahr >= 1991 ? { "Baujahr ab 1991": baujahr } : {}),
  };
}

export type Evaluation = {
  answers: Record<string, unknown>;
  visible: Set<string>;
  /** Visible question alias → id of the copy that was actually asked. */
  nodeIds: Map<string, string>;
  lastStep: { type: string; alias?: string } | undefined;
};

/** Run the real flow on alias-space answers, the same way the API does. */
export function evaluateAnswers(answers: Record<string, unknown>): Evaluation {
  const derived = applyDerivedAnswers(
    flowMachine.answers(withBaujahrInputs(answers) as never).state,
  );
  const state = flowMachine.answers(derived as never).state;
  const steps = ungroup(flowMachine.run(state)) as {
    type: string;
    alias?: string;
    id: string;
  }[];
  const aliasAnswers = Object.fromEntries(
    Object.entries(state).map(([k, v]) => [k, aliasValueFor(k, v)]),
  );
  return {
    answers: aliasAnswers,
    visible: new Set(
      steps
        .filter((s) => s.type === "Question" && s.alias)
        .map((s) => s.alias!),
    ),
    nodeIds: new Map(
      steps
        .filter((s) => s.type === "Question" && s.alias)
        .map((s) => [s.alias!, s.id]),
    ),
    lastStep: steps.at(-1),
  };
}

function scenarioFixed(scenario: Scenario | undefined): IdState {
  return Object.fromEntries(
    Object.entries(scenario?.pinned ?? UI_FORCED).map(([k, v]) => [
      k,
      optionIdFor(k, v),
    ]),
  );
}

/**
 * An `If` only sees answers to questions visited before it. Every question a
 * literal refers to must therefore be reachable itself: add the literals of
 * one of its copies, transitively. Returns alternative literal sets, one per
 * combination of copies.
 */
/**
 * Schnelltest questions are always asked: the base answers pass every
 * Schnelltest branch, and the final flow run verifies it. Only detail
 * questions need their own path conditions.
 */
const SCHNELLTEST_ALIASES = new Set(
  [...questionCopiesByAlias]
    .filter(([, copies]) => copies.every((c) => c.section === "Schnelltest"))
    .map(([alias]) => alias),
);

type Alternative = {
  literals: Literal[];
  seen: Set<string>;
  /** Questions assumed not to be asked on this path (answer undefined). */
  unvisited: Set<string>;
};

function withDependencies(
  literals: Literal[],
  mustVisit: Set<string>,
  maxAlternatives = 256,
): Alternative[] {
  let alternatives: Alternative[] = [
    { literals, seen: new Set(), unvisited: new Set() },
  ];
  for (let round = 0; round < 6; round++) {
    let changed = false;
    alternatives = alternatives.flatMap((alt) => {
      const pending = [
        ...new Set(alt.literals.flatMap((l) => aliasesOf(l.test))),
      ].filter((a) => !alt.seen.has(a) && !SCHNELLTEST_ALIASES.has(a));
      if (pending.length === 0) return [alt];
      changed = true;
      return pending
        .reduce(
          (acc, alias) =>
            acc.flatMap((partial) => {
              const copies = questionCopiesByAlias.get(alias) ?? [];
              const seen = new Set([...partial.seen, alias]);
              if (copies.length === 0) return [{ ...partial, seen }];
              // A negated test is also satisfied when the question is skipped.
              const skipped = mustVisit.has(alias)
                ? []
                : [
                    {
                      ...partial,
                      seen,
                      unvisited: new Set([...partial.unvisited, alias]),
                    },
                  ];
              return [
                ...skipped,
                ...copies.map((c) => ({
                  ...partial,
                  literals: [...partial.literals, ...c.literals],
                  seen,
                })),
              ];
            }),
          [alt],
        )
        .slice(0, maxAlternatives);
    });
    alternatives = alternatives.slice(0, maxAlternatives);
    if (!changed) break;
  }
  return alternatives;
}

/**
 * Finds answers that satisfy all `literals` plus the `required` answers and
 * for which `accept` holds when the real flow is run. Returns undefined if no
 * such answers were found.
 */
export function findAnswers(
  literals: Literal[],
  required: Record<string, unknown>,
  scenario: Scenario | undefined,
  accept: (evaluation: Evaluation) => boolean,
): Evaluation | undefined {
  const mustVisit = new Set([
    ...Object.keys(scenario?.pinned ?? UI_FORCED),
    ...Object.keys(required),
  ]);
  for (const candidate of withDependencies(literals, mustVisit)) {
    const found = findAnswersFor(candidate, required, scenario, accept);
    if (found) return found;
  }
  return undefined;
}

function findAnswersFor(
  { literals, unvisited }: Alternative,
  required: Record<string, unknown>,
  scenario: Scenario | undefined,
  accept: (evaluation: Evaluation) => boolean,
): Evaluation | undefined {
  const fixed = {
    ...Object.fromEntries([...unvisited].map((a) => [a, UNANSWERED])),
    ...scenarioFixed(scenario),
    ...Object.fromEntries(
      Object.entries(required).map(([k, v]) => [k, optionIdFor(k, v)]),
    ),
  };
  const solution = solve(literals, fixed, scenario);
  if (!solution) return undefined;
  const answers: Record<string, unknown> = { ...BASE_ANSWERS };
  for (const [alias, value] of Object.entries(solution)) {
    if (value === UNANSWERED) delete answers[alias];
    else answers[alias] = aliasValueFor(alias, value);
  }
  if (scenario?.period && typeof answers.Baujahr !== "number") {
    answers.Baujahr = domainFor("Baujahr", [], scenario)[0];
  }
  if (scenario?.period?.ost !== undefined) answers.Ost = scenario.period.ost;
  const evaluation = evaluateAnswers(answers);
  return accept(evaluation) ? evaluation : undefined;
}

/** Answers reaching the exit node, or undefined if none were found. */
export function reachExit(
  exit: PathNode<FlowExit>,
  scenario?: Scenario,
): Evaluation | undefined {
  return findAnswers(
    exit.literals,
    {},
    scenario,
    (e) => e.lastStep?.type === "Exit" && e.lastStep.alias === exit.node.alias,
  );
}

/** Whether a user could give `value` as answer to the question `alias`. */
export function isValidAnswer(alias: string, value: unknown): boolean {
  const question = questionByAlias(alias);
  if (!question) return false;
  const options = question.answer.options;
  if (!options) return true;
  const values = Array.isArray(value) ? value : [value];
  return values.every((v) => options.some((o) => o.alias === v));
}

/** Answers making all questions in `aliases` visible, or undefined. */
export function reachQuestions(
  required: Record<string, unknown>,
  scenario: Scenario | undefined,
  accept: (evaluation: Evaluation) => boolean,
): Evaluation | undefined {
  const aliases = Object.keys(required);
  if (aliases.some((a) => !isValidAnswer(a, required[a]))) return undefined;
  const copyChoices = aliases.map((a) => questionCopiesByAlias.get(a) ?? []);
  if (copyChoices.some((c) => c.length === 0)) return undefined;
  // Try every combination of question copies (duplicates sit in year branches).
  const combos = copyChoices.reduce<PathNode<FlowQuestion>[][]>(
    (acc, copies) => acc.flatMap((combo) => copies.map((c) => [...combo, c])),
    [[]],
  );
  for (const combo of combos) {
    const literals = combo.flatMap((c) => c.literals);
    const found = findAnswers(
      literals,
      required,
      scenario,
      (e) => aliases.every((a) => e.visible.has(a)) && accept(e),
    );
    if (found) return found;
  }
  return undefined;
}
