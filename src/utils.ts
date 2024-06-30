import { AdresseFormValue, AdresseWithLage } from "~/form/adresse/types";

export function isKeyOfObject<T extends object>(
  key: string | number | symbol,
  obj: T,
): key is keyof T {
  return key in obj;
}

export const formatEuro = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    ...({ trailingZeroDisplay: "stripIfInteger" } as object),
  }).format(n);

export const parseAdresse = (v: string): AdresseWithLage => JSON.parse(v);

export const formatAddresse = (a: AdresseFormValue) =>
  `${a.strasse}${"nummer" in a ? ` ${a.nummer}` : ""}, ${a.plz} Berlin`;
