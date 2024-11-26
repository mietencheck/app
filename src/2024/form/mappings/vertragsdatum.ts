import { FinalAnswers } from "~/2024/form/flow-machine";
import { o_Mietspiegeljahr as Mietspiegeljahr } from "~/2024/mietspiegel/types";

export const vertragsdatumToMietspiegelJahrMapping = {
  "<2015": undefined,
  "2015-2016": "2015",
  "2016-2018": "2017",
  "2018-2020": "2019",
  "2020-2022": "2021",
  "2022-2024": "2023",
  ">2024": "2024",
} satisfies Record<
  NonNullable<FinalAnswers["Vertragsdatum"]>,
  Mietspiegeljahr | undefined
>;
