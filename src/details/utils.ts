import { useLocation } from "@swan-io/chicane";
import { Group, Question, ungroup } from "flow-machine";
import { useCallback, useEffect, useMemo } from "react";
import { mapValues } from "remeda";
import { useLocalStorage, useSessionStorage } from "usehooks-ts";

import {
  useAnswers,
  useMainSteps,
  useSteps,
  useVisibleQuestionAliases,
} from "~/form/flow-machine";
import { getWorstBestZulässigeHöchstmiete } from "~/form/rechner/Miete";

import { NavItemData } from "./navigation";

export const getSlugForAlias = (title: string) =>
  encodeURIComponent(
    title.split(" ").join("-").replaceAll("&", "u").toLowerCase(),
  );

export const useVisitedPages = () =>
  useLocalStorage("visited", new Set<string>(), {
    serializer: (v) => JSON.stringify([...v]),
    deserializer: (v) => new Set(JSON.parse(v)),
  });

export const usePathname = () => {
  const pathname = "/" + useLocation().path.join("/");

  const [, setVisited] = useVisitedPages();
  useEffect(() => {
    setVisited((visited) => new Set([...visited, pathname]));
  }, [pathname, setVisited]);

  return pathname;
};

export function useCheckIsGroupCompleted() {
  const answers = useAnswers();
  const mainSteps = useMainSteps();
  const [visitedPages] = useVisitedPages();

  return useCallback(
    (page: NavItemData) => {
      const group = mainSteps
        .filter((s): s is Group => s.type == "Group" && s.category == "Page")
        .flatMap((group) => [group, ...(group.steps ?? [])])
        .filter((s): s is Group => s.type == "Group")
        .find((s) => s.alias == page.title);
      if (!group) return false;

      const questions = ungroup(group.steps).filter(
        (s): s is Question => s.type == "Question",
      );
      return questions.length > 0
        ? questions.every((q) => typeof answers.getById(q.id) !== "undefined")
        : visitedPages.has(page.href);
    },
    [answers, mainSteps, visitedPages],
  );
}

export function useIsCompleted() {
  const answers = useAnswers();
  const steps = useSteps();
  return useMemo(
    () =>
      ungroup(steps)
        .filter((s) => s.type == "Question")
        .every((q) => typeof answers.getById(q.id) !== "undefined"),
    [answers, steps],
  );
}

const eqSet = (xs: Set<unknown>, ys: Set<unknown>) =>
  xs.size === ys.size && [...xs].every((x) => ys.has(x));

export const MISSING_OPTION_ALIAS = "Nicht sicher";

const REQUIRED_QUESTION_ALIASES = ["Vertragsdatum", "Baujahr"] as const;
type RequiredQuestionAlias = (typeof REQUIRED_QUESTION_ALIASES)[number];

export function useHasMissingAnswers() {
  const answers = useAnswers();
  return useMemo(
    () =>
      REQUIRED_QUESTION_ALIASES.some(
        (alias) => answers.getWithOptionAlias(alias) == MISSING_OPTION_ALIAS,
      ),
    [answers],
  );
}

export function useMissingAnswersInSession(): Set<RequiredQuestionAlias> {
  const answers = useAnswers();
  const [missing, setMissing] = useSessionStorage<Set<RequiredQuestionAlias>>(
    "missing-answers",
    new Set(),
    {
      serializer: (v) => JSON.stringify([...v]),
      deserializer: (v) => new Set(JSON.parse(v)),
    },
  );
  useEffect(() => {
    const newMissing = new Set([
      ...missing,
      ...REQUIRED_QUESTION_ALIASES.filter(
        (alias) => answers.getWithOptionAlias(alias) == MISSING_OPTION_ALIAS,
      ),
    ]);
    if (!eqSet(missing, newMissing)) {
      setMissing(newMissing);
    }
  }, [answers, missing, setMissing]);
  return missing;
}

export function useWorstBestMiete() {
  const answers = useAnswers();
  const visibleQuestionAlises = useVisibleQuestionAliases();
  return useMemo(
    () =>
      getWorstBestZulässigeHöchstmiete(
        answers.getAliasedState(),
        visibleQuestionAlises,
      ) ?? {
        worst: 0,
        best: 0,
      },
    [answers, visibleQuestionAlises],
  );
}

export function useMieteDiff() {
  const answers = useAnswers();
  const miete = answers.get("Kaltmiete");
  const worstBestMiete = useWorstBestMiete();
  return mapValues(worstBestMiete, (n) => Number(miete) - n);
}
