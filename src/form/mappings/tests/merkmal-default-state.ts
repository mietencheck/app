import merkmale2015 from "~/mietspiegel/merkmale/2015.json";
import merkmale2017 from "~/mietspiegel/merkmale/2017.json";
import merkmale2019 from "~/mietspiegel/merkmale/2019.json";
import merkmale2021 from "~/mietspiegel/merkmale/2021.json";
import merkmale2023 from "~/mietspiegel/merkmale/2023.json";
import merkmale2024 from "~/mietspiegel/merkmale/2024.json";
import { sondermerkmale } from "~/mietspiegel/sondermerkmale";

export const SONDERMERKMAL_DEFAULT_STATE = Object.fromEntries(
  Object.keys(sondermerkmale).map((key) => [key, "unchecked"]),
);

export const MERKMAL_DEFAULT_STATE = {
  "2015-2016": Object.fromEntries(
    Object.keys(merkmale2015).map((key) => [key, "unchecked"]),
  ),
  "2016-2018": Object.fromEntries(
    Object.keys(merkmale2017).map((key) => [key, "unchecked"]),
  ),
  "2018-2020": Object.fromEntries(
    Object.keys(merkmale2019).map((key) => [key, "unchecked"]),
  ),
  "2020-2022": Object.fromEntries(
    Object.keys(merkmale2021).map((key) => [key, "unchecked"]),
  ),
  "2022-2024": Object.fromEntries(
    Object.keys(merkmale2023).map((key) => [key, "unchecked"]),
  ),
  ">2024": Object.fromEntries(
    Object.keys(merkmale2024).map((key) => [key, "unchecked"]),
  ),
} as const;

export const ALL_VERTRAGSDATUM = [
  "2015-2016",
  "2016-2018",
  "2018-2020",
  "2020-2022",
  "2022-2024",
  ">2024",
];
