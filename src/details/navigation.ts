import type { Group } from "flow-machine";
import { useMemo } from "react";

import type { MainSteps } from "~/form/flow-machine";
import { useLocalizeField } from "~/l10n";

import { getSlugForAlias, useMissingAnswersInSession } from "./utils";

export type NavItemData = {
  title: string;
  href: string;
  children?: {
    title: string;
    href: string;
  }[];
};

export function useMainNavItems(mainSteps: MainSteps): NavItemData[] {
  const l = useLocalizeField();
  const hadMissingFields = useMissingAnswersInSession().size > 0;
  const navItems = useMemo(
    () =>
      mainSteps
        .filter((s): s is Group => s.type == "Group" && s.category == "Page")
        .map((group) => {
          const href = "/details/" + getSlugForAlias(group.alias ?? "");
          return {
            title: group.alias ?? "",
            href: href,
            children: group.steps
              .filter(
                (s): s is Group => s.type == "Group" && s.category == "Page",
              )
              .map((g) => ({
                title: g.alias ?? "",
                href: `${href}/${getSlugForAlias(g.alias ?? "")}`,
              })),
          };
        }),
    [mainSteps],
  );
  return useMemo(
    () =>
      hadMissingFields
        ? navItems.toSpliced(1, 0, {
            title: l("Fehlende Angaben"),
            href: "/details/fehlende-angaben",
            children: [],
          })
        : navItems,
    [hadMissingFields, l, navItems],
  );
}

export function getRelNavItems(navItems: NavItemData[], pathname: string) {
  const pagesFlat = navItems.flatMap((p) =>
    p.children && p.children.length > 0 ? [...p.children] : p,
  );
  const i = pagesFlat.findIndex(({ href }) => decodeURI(href) == pathname);
  return {
    previous: i >= 1 ? pagesFlat[i - 1] : null,
    current: i >= 0 ? pagesFlat[i] : null,
    next: i >= 0 && i < pagesFlat.length - 1 ? pagesFlat[i + 1] : null,
  };
}

export function buildPageIndex(pages: NavItemData[], pathname: string) {
  const mainPageIndex = pages.findIndex(({ href }) => pathname.includes(href));
  const subPageIndex = pages
    .at(mainPageIndex)
    ?.children?.findIndex(({ href }) => pathname.includes(decodeURI(href)));
  return typeof subPageIndex === "undefined" || subPageIndex < 0
    ? `${mainPageIndex + 1}`
    : `${mainPageIndex + 1}.${subPageIndex + 1}`;
}
