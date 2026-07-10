import { useLocation, useMatches } from "react-router-dom";

import type { BlogCategory } from "~/sanity/types";

export function useBlogCategories(): BlogCategory[] {
  const matches = useMatches();

  for (let i = matches.length - 1; i >= 0; i--) {
    const data = matches[i].data as
      | { navCategories?: BlogCategory[]; categories?: BlogCategory[] }
      | undefined;
    if (data?.navCategories) return data.navCategories;
    if (data?.categories) return data.categories;
  }

  return [];
}

function getCategorySlugFromPath(pathname: string): string | null {
  const dePrefix = "/de/blog/kategorie/";
  const enPrefix = "/en/blog/category/";

  if (pathname.startsWith(dePrefix)) {
    return pathname.slice(dePrefix.length).replace(/\/$/, "");
  }

  if (pathname.startsWith(enPrefix)) {
    return pathname.slice(enPrefix.length).replace(/\/$/, "");
  }

  return null;
}

export function useActiveBlogCategorySlugs(): Set<string> {
  const { pathname } = useLocation();
  const matches = useMatches();

  const slugFromPath = getCategorySlugFromPath(pathname);
  if (slugFromPath) return new Set([slugFromPath]);

  for (let i = matches.length - 1; i >= 0; i--) {
    const data = matches[i].data as
      | { activeCategorySlugs?: string[] }
      | undefined;

    if (data?.activeCategorySlugs?.length) {
      return new Set(data.activeCategorySlugs);
    }
  }

  return new Set();
}
