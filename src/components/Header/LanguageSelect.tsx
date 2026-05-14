"use client";

import { useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components";
import { useLocaleState, useLocalizeField } from "~/l10n";
import type { Locale } from "~/L10nContext";

function switchBlogPath(
  pathname: string,
  nextLocale: "de" | "en",
): string | null {
  if (
    pathname === "/de/blog" ||
    pathname === "/en/blog" ||
    pathname === "/blog"
  ) {
    return `/${nextLocale}/blog`;
  }

  const postMatch = pathname.match(/^\/(de|en)\/blog\/(.+)$/);
  if (postMatch) {
    const siblingSlug = (window as Window & { __BLOG_SIBLING_SLUG__?: string })
      .__BLOG_SIBLING_SLUG__;
    if (siblingSlug) {
      return `/${nextLocale}/blog/${siblingSlug}`;
    }
    return `/${nextLocale}/blog`;
  }

  if (pathname.startsWith("/blog/")) {
    return `/${nextLocale}/blog`;
  }

  return null;
}

const localeCodes: Locale[] = ["de", "en"];

export function LanguageSelect() {
  const { locale, setLocale } = useLocaleState();
  const l = useLocalizeField();

  const items = useMemo(
    () => ({
      de: l("German"),
      en: l("English"),
    }),
    [l],
  );

  return (
    <Select
      value={locale}
      onValueChange={(v) => {
        if (v !== "de" && v !== "en") return;
        const nextLocale = v;
        setLocale(nextLocale);
        const nextBlogPath = switchBlogPath(
          window.location.pathname,
          nextLocale,
        );
        if (nextBlogPath && nextBlogPath !== window.location.pathname) {
          window.location.pathname = nextBlogPath;
        }
      }}
      items={items}
    >
      <SelectTrigger aria-label={l("Language")}>
        <SelectValue placeholder={l("Language")} />
      </SelectTrigger>
      <SelectContent>
        {localeCodes.map((code) => (
          <SelectItem key={code} value={code} label={items[code]}>
            {items[code]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
