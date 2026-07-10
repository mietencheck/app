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

export function BlogCategoryNav() {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/de/blog";
  const isEn = isEnglishPath(pathname);
  const l = useInlineLocale();
  const categories = useBlogCategories();
  const activeCategorySlugs = useActiveBlogCategorySlugs();

  const overviewHref = isEn ? AppRouter.BlogEn() : AppRouter.BlogDe();
  const isOverview = pathname === overviewHref;

  return (
    <nav
      aria-label={l({ de: "Blog-Kategorien", en: "Blog categories" })}
      className="bg-gray-3"
    >
      <div className="container flex flex-wrap justify-center gap-1 py-3">
        <Link
          href={overviewHref}
          variant="ghost"
          className={cn(!isOverview && "font-normal")}
        >
          {l({ de: "Übersicht", en: "Overview" })}
        </Link>
        {categories.map((category) => {
          if (!category.slug) return null;

          const href = isEn
            ? AppRouter.BlogCategoryEn({ categorySlug: category.slug })
            : AppRouter.BlogCategoryDe({ categorySlug: category.slug });
          const isActive = activeCategorySlugs.has(category.slug);

          return (
            <Link
              key={category.slug}
              href={href}
              variant="ghost"
              className={cn(!isActive && "font-normal")}
            >
              {category.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
