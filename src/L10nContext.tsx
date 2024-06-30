import React, { useMemo } from "react";
import useSWRImmutable from "swr/immutable";
import { useLocalStorage } from "usehooks-ts";

import DE from "../public/locales/de.json";

export type Locale = "de" | "en";

type Localization = {
  fields: typeof DE;
  strings: Record<string, string>;
};

const pickByPrefix = (
  obj: Record<string, string>,
  prefix: string,
): Record<string, string> =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, value]) => [key.substring(prefix.length), value]),
  );

export const L10nContext = React.createContext<{
  locale: Locale;
  setLocale: (_: Locale) => void;

  localization?: Localization;
  glossary: Record<string, string>;
}>({ locale: "de", setLocale: () => {}, glossary: {} });
export function L10nPovider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useLocalStorage<Locale>("locale", "de");

  const { data: localization } = useSWRImmutable(
    locale == "de" ? null : `/locales/${locale}.json`,
    (url) => fetch(url).then((res) => res.json() as Promise<Localization>),
  );

  const glossary = useMemo(() => {
    const fields = localization?.fields ?? DE;
    const termsMap = pickByPrefix(fields, "glossary-term:");
    const textsMap = pickByPrefix(fields, "glossary-text:");
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(termsMap)) {
      if (key in textsMap) {
        result[value] = textsMap[key];
      }
    }
    return result;
  }, [localization?.fields]);

  const contextValue = useMemo(
    () => ({ locale, setLocale, localization, glossary }),
    [glossary, locale, localization, setLocale],
  );
  return (
    <L10nContext.Provider value={contextValue}>{children}</L10nContext.Provider>
  );
}
