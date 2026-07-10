import { useLocation } from "react-router-dom";

import {
  useActiveBlogCategorySlugs,
  useBlogCategories,
} from "~/blog/useBlogCategories";
import { Link } from "~/components";
import { useInlineLocale } from "~/l10n";
import { cn } from "~/lib/utils";
import { AppRouter } from "~/router";

function isEnglishPath(pathname: string): boolean {
  return pathname.startsWith("/en/");
}

function isBlogOverviewPath(pathname: string, overviewHref: string): boolean {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const normalizedOverview = overviewHref.replace(/\/$/, "");
  return normalizedPath === normalizedOverview;
}

type NavItem = {
  key: string;
  href: string;
  label: string;
  isActive: boolean;
};

function categoryNavLinkClass(isActive: boolean) {
  return cn(
    "shrink-0 rounded-full max-sm:px-4 max-sm:py-2 max-sm:text-sm",
    isActive
      ? "font-medium max-sm:bg-gray-12 max-sm:text-white"
      : "font-normal max-sm:border max-sm:border-gray-6 max-sm:bg-white max-sm:text-gray-12",
  );
}

export function BlogCategoryNav() {
  const { pathname } = useLocation();
  const isEn = isEnglishPath(pathname);
  const l = useInlineLocale();
  const categories = useBlogCategories();
  const activeCategorySlugs = useActiveBlogCategorySlugs();

  const overviewHref = isEn ? AppRouter.BlogEn() : AppRouter.BlogDe();
  const isOverview = isBlogOverviewPath(pathname, overviewHref);

  const navItems: NavItem[] = [
    {
      key: "overview",
      href: overviewHref,
      label: l({ de: "Übersicht", en: "Overview" }),
      isActive: isOverview,
    },
    ...categories.flatMap((category) => {
      if (!category.slug) return [];

      return [
        {
          key: category.slug,
          href: isEn
            ? AppRouter.BlogCategoryEn({ categorySlug: category.slug })
            : AppRouter.BlogCategoryDe({ categorySlug: category.slug }),
          label: category.title ?? category.slug,
          isActive: activeCategorySlugs.has(category.slug),
        },
      ];
    }),
  ];

  return (
    <nav
      aria-label={l({ de: "Blog-Kategorien", en: "Blog categories" })}
      className="bg-gray-3"
    >
      <div className="overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:overflow-x-visible">
        <div className="container -mx-2.5 sm:m-0">
          <div className="flex w-max min-w-full items-center gap-2 sm:mx-auto sm:w-full sm:flex-wrap sm:justify-center sm:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                variant="ghost"
                size="sm"
                className={categoryNavLinkClass(item.isActive)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
