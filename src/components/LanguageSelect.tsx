import cx from "classnames";
import { ChevronDownIcon, LanguagesIcon } from "lucide-react";
import { entries } from "remeda";

import { buttonVariants } from "~/components/ui";
import { useLocaleState, useLocalizeField } from "~/l10n";
import type { Locale } from "~/L10nContext";

type LanguageSelectProps = {
  variant?: "yellow" | "neutral";
};

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
        onChange={({ target }) => setLocale(target.value as Locale)}
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
