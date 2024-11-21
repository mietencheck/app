import { FinalAnswers } from "~/2024/form/flow-machine";
import { RentIndexYear } from "~/2024/rentIndex/rentBrackets";

export const contractDateToRentIndexYear = {
  "<2015": undefined,
  "2015-2016": "2015",
  "2016-2018": "2017",
  "2018-2020": "2019",
  "2020-2022": "2021",
  "2022-2024": "2023",
  ">2024": "2024",
} satisfies Record<
  NonNullable<FinalAnswers["Vertragsdatum"]>,
  RentIndexYear | undefined
>;
