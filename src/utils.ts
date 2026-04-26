import type { ReactNode } from "react";

import {
  AdresseFormValue,
  AdresseWithLage,
} from "~/components/AdresseForm/types";

export function isKeyOfObject<T extends object>(
  key: string | number | symbol,
  obj: T,
): key is keyof T {
  return key in obj;
}

export function replaceWith(
  text: string,
  ...replacementMaps: Record<string, ReactNode>[]
): ReactNode[] {
  let parts: ReactNode[] = [text];
  for (const replacementsMap of replacementMaps) {
    for (const [needle, replacement] of Object.entries(replacementsMap)) {
      parts = parts.flatMap((part) =>
        typeof part == "string"
          ? part
              .split(needle)
              .flatMap((subpart, i, a) =>
                i + 1 < a.length ? [subpart, replacement] : [subpart],
              )
          : [part],
      );
    }
  }
  return parts;
}

export const formatEuro = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    ...({ trailingZeroDisplay: "stripIfInteger" } as object),
  }).format(n);

export const formatPercent = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(n);

export const formatDate = (n: string) =>
  new Date(n).toLocaleDateString("de-DE");

export const parseAdresse = (v: string): AdresseWithLage => JSON.parse(v);

export const formatAddresse = (a: AdresseFormValue) =>
  `${a.strasse}${"nummer" in a ? ` ${a.nummer}` : ""}, ${a.plz} Berlin`;
