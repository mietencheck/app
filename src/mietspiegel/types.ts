import { baujahrSpannenByMietspiegeljahr } from "./baujahrSpannen";
import { sondermerkmale } from "./sondermerkmale";

export type Merkmal = string;
export type MerkmalGruppe = "Bad" | "Küche" | "Wohnung" | "Gebäude" | "Umfeld";
export type MerkmalTyp = "Wohnwerterhoehend" | "Wohnwertmindernd";

export type Sondermerkmal = keyof typeof sondermerkmale;

type Mittelwert = number;
type Unterwert = number;
type Oberwert = number;
export type Preisspanne = [Mittelwert, Unterwert, Oberwert];

export type Mietspiegeljahr =
  | "2015"
  | "2017"
  | "2019"
  | "2021"
  | "2023"
  | "2024";

export type Wohnlage = "einfach" | "mittel" | "gut";

export type Baujahr =
  | "-1918"
  | "1919-1949"
  | "1950-1964"
  | "1965-1972"
  | "W:1973-1985"
  | "W:1973-1990"
  | "W:1986-1990"
  | "O:1973-1990"
  | "1991-2001"
  | "1991-2002"
  | "2002-2009"
  | "2003-2013"
  | "2003-2015"
  | "2003-2017"
  | "2010-2015"
  | "2016-2022";

export type BaujahrSpanne =
  (typeof baujahrSpannenByMietspiegeljahr)[keyof typeof baujahrSpannenByMietspiegeljahr][number];

export type BaujahrSpanneInMietspiegeljahr = {
  [Jahr in Mietspiegeljahr]: (typeof baujahrSpannenByMietspiegeljahr)[Jahr][number];
};

export type Wohnflaeche =
  | "-35"
  | "-40"
  | "-45"
  | "-50"
  | "-55"
  | "-60"
  | "-70"
  | "-75"
  | "-85"
  | "-90"
  | "-105"
  | "35-40"
  | "40-45"
  | "40-90"
  | "45-50"
  | "45-55"
  | "45-75"
  | "45-"
  | "40-60"
  | "40-65"
  | "45-60"
  | "45-65"
  | "50-55"
  | "50-65"
  | "55-60"
  | "55-65"
  | "55-75"
  | "55-80"
  | "60-65"
  | "60-70"
  | "60-75"
  | "60-80"
  | "60-90"
  | "60-"
  | "65-75"
  | "65-85"
  | "65-115"
  | "65-"
  | "70-75"
  | "70-95"
  | "70-"
  | "75-80"
  | "75-85"
  | "75-90"
  | "75-"
  | "80-95"
  | "80-120"
  | "80-"
  | "85-90"
  | "85-100"
  | "85-105"
  | "85-"
  | "90-100"
  | "90-105"
  | "90-"
  | "95-"
  | "100-"
  | "105-"
  | "105-120"
  | "115-"
  | "120-130"
  | "120"
  | "130-";
