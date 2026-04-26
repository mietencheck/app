import { useLocation } from "@swan-io/chicane";
import { Group, Question, ungroup } from "flow-machine";
import { useCallback, useEffect, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

import { getWorstBestZulaessigeHoechstmiete } from "~/calculation/zulaessigeHoechstmiete";
import { getNettokaltmiete } from "~/form/api";
import { answersToCalculationContext } from "~/form/calculation-context";
import {
  useAnswers,
  useDetailsSteps,
  useSteps,
  useVisibleQuestionAliases,
} from "~/form/flow-machine";

import { PageNavigationItemData } from "./components/Navigation/utils";

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
  const mainSteps = useDetailsSteps();
  const [visitedPages] = useVisitedPages();

  return useCallback(
    (page: PageNavigationItemData) => {
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
        ? questions.every(
            (q) => typeof answers.get([q.alias || q.id]) !== "undefined",
          )
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
        .every((q) => typeof answers.get([q.alias || q.id]) !== "undefined"),
    [answers, steps],
  );
}

export function useWorstBestZulaessigeHoechstmiete():
  | {
      worst: number;
      best: number;
    }
  | undefined {
  const answers = useAnswers();
  const visibleQuestionAliases = useVisibleQuestionAliases();
  return useMemo(() => {
    const ctx = answersToCalculationContext(
      answers.getAliasedState(),
      visibleQuestionAliases,
    );
    return ctx ? getWorstBestZulaessigeHoechstmiete(ctx) : undefined;
  }, [answers, visibleQuestionAliases]);
}

export function useWorstBestZulaessigeHoechstmieteDiff():
  | {
      worst: number;
      best: number;
    }
  | undefined {
  const answers = useAnswers().getAliasedState();
  const visibleQuestionAlises = useVisibleQuestionAliases();

  const nettokaltmiete = getNettokaltmiete(answers, visibleQuestionAlises);
  const zulaessigeHoechstmiete = useWorstBestZulaessigeHoechstmiete();

  if (nettokaltmiete === undefined || !zulaessigeHoechstmiete) {
    return undefined;
  }

  return {
    worst: Number(
      (Number(nettokaltmiete) - zulaessigeHoechstmiete.worst).toFixed(2),
    ),
    best: Number(
      (Number(nettokaltmiete) - zulaessigeHoechstmiete.best).toFixed(2),
    ),
  };
}
