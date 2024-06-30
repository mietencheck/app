import { Fields2015 } from "./2015";
import FieldKeys2015 from "./2015.json";
import { Fields2017 } from "./2017";
import FieldKeys2017 from "./2017.json";
import { Fields2019 } from "./2019";
import FieldKeys2019 from "./2019.json";
import { Fields2021 } from "./2021";
import FieldKeys2021 from "./2021.json";
import { Fields2023 } from "./2023";
import FieldKeys2023 from "./2023.json";

export const fieldKeysByYear = {
  "2015": new Set(FieldKeys2015),
  "2017": new Set(FieldKeys2017),
  "2019": new Set(FieldKeys2019),
  "2021": new Set(FieldKeys2021),
  "2023": new Set(FieldKeys2023),
};

export type FieldsByYear = {
  "2023": Fields2023;
  "2021": Fields2021;
  "2019": Fields2019;
  "2017": Fields2017;
  "2015": Fields2015;
};

type DistributedKeyOf<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends any ? keyof T : never;
export type AllPDFFields = DistributedKeyOf<FieldsByYear[keyof FieldsByYear]>;

export const availableYears = ["2015", "2017", "2019", "2021", "2023"] as const;

export type AvailableYear = (typeof availableYears)[number];

export const filesNames = {
  // Mieterhöhung
  // 2023: "fl135a-2023-mieterhoehung-erhalten.pdf",
  // 2021: "pruefung-miethoehe-135-a-2021.pdf",
  // 2019: "pruefung-miethoehe-135-a-2019-9-19.pdf",

  2023: "fl169a-2023-wiedervermietung.pdf",
  2021: "wiedervermietung-169-a-2021-1.pdf",
  2019: "wiedervermietung-169-a-2019-9-19-3.pdf",
  2017: "wiedervermietung-169-a-2017-9-19.pdf",
  2015: "wiedervermietung-169-a-2015-9-19.pdf",
} satisfies {
  [key in AvailableYear]: string;
};

export function getPDF_URL(year: AvailableYear) {
  return `/pdfs/${filesNames[year]}`;
}

export function getPDF_Path(year: AvailableYear) {
  return `public/pdfs/${filesNames[year]}`;
}
