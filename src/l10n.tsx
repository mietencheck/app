import { useCallback, useContext } from "react";
import { entries } from "remeda";
import sha1 from "sync-sha1";

import DE from "../public/locales/de.json";
import { L10nContext } from "./L10nContext";

export { DE };

export function hash(text: string): string {
  return sha1(text).toString("hex").slice(0, 6);
}

export const useLocaleState = () => useContext(L10nContext);

export function useLocalizeField() {
  const { locale, localization: localizations } = useLocaleState();
  return useCallback(
    (key: keyof typeof DE, replacements?: Record<string, string>) => {
      const raw =
        locale == "de" ? DE[key] : localizations?.fields[key] ?? DE[key];
      if (!replacements) return raw;
      return entries(replacements).reduce(
        (acc, [key, value]) => acc.replaceAll("$" + key, value),
        raw,
      );
    },
    [locale, localizations],
  );
}

export function useLocalizeString() {
  const { locale, localization: localizations } = useLocaleState();
  return useCallback(
    (str: string) =>
      locale == "de" ? str : localizations?.strings[hash(str)] ?? str,
    [locale, localizations],
  );
}
