export type StrassenDataRaw = Record<
  string /* plz */,
  Record<
    string /* nummer */,
    Record<
      string /* jahr */,
      [number /* wohnlage */, number /* laut */, number /* ost */]
    >
  >
>;

export type Adresse = {
  plz: string;
  strasse: string;
  nummer: string;
};

type Wohnlage = "einfach" | "mittel" | "gut";

export type LageInfo = {
  laut: boolean;
  wohnlage: Wohnlage;
  ost: boolean;
};
export type LageInfoByJahr = Partial<
  Record<"2015" | "2017" | "2019" | "2021" | "2023", LageInfo>
>;

export type AdresseWithLage = Adresse & {
  lage: LageInfoByJahr;
};

export type AdresseFormValue = Partial<AdresseWithLage>;
