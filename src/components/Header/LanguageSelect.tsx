import cx from "classnames";
import { ChevronDownIcon, LanguagesIcon } from "lucide-react";
import { entries } from "remeda";

import { buttonVariants } from "~/components";
import { useLocaleState, useLocalizeField } from "~/l10n";
import type { Locale } from "~/L10nContext";

type LanguageSelectProps = {
  variant?: "yellow" | "neutral";
};

function switchBlogPath(
  pathname: string,
  nextLocale: "de" | "en",
): string | null {
  // Blog index pages — simple prefix swap is fine
  if (
    pathname === "/de/blog" ||
    pathname === "/en/blog" ||
    pathname === "/blog"
  ) {
    return `/${nextLocale}/blog`;
  }

  // Blog post pages — use the sibling slug if available
  const postMatch = pathname.match(/^\/(de|en)\/blog\/(.+)$/);
  if (postMatch) {
    const siblingSlug = (window as any).__BLOG_SIBLING_SLUG__;
    if (siblingSlug) {
      return `/${nextLocale}/blog/${siblingSlug}`;
    }
    // No translation exists — fall back to blog index
    return `/${nextLocale}/blog`;
  }

  // Legacy /blog/:slug route
  if (pathname.startsWith("/blog/")) {
    return `/${nextLocale}/blog`;
  }

  return null;
}

export function LanguageSelect({ variant = "neutral" }: LanguageSelectProps) {
  const { locale, setLocale } = useLocaleState();
  const l = useLocalizeField();

  const languages = {
    de: l("German"),
    en: l("English"),
  };

  const classNames =
    variant == "neutral"
      ? cx("relative flex items-center", buttonVariants())
      : cx(
          "relative rounded-full !px-3 border-2 border-yellow-9 text-yellow-11 rounded-full sm:rounded-none",
          "flex items-center",
          buttonVariants({ color: "unstyled", variant: "unstyled" }),
        );

  return (
    <div className={classNames}>
      <LanguagesIcon
        className="md:hidden flex items-center justify-center"
        width={20}
        height={20}
        strokeWidth={2}
      />
      <select
        className="absolute left-0 top-0 w-full h-full opacity-0"
        value={locale}
        onChange={({ target }) => {
          const nextLocale = target.value as Locale;
          setLocale(nextLocale);
          const nextBlogPath = switchBlogPath(
            window.location.pathname,
            nextLocale,
          );
          if (nextBlogPath && nextBlogPath !== window.location.pathname) {
            window.location.pathname = nextBlogPath;
          }
        }}
      >
        {entries(languages).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="hidden md:block">{languages[locale]}</div>
      <ChevronDownIcon size={20} />
    </div>
  );
}
