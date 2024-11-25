import merkmale2015 from "./2015.json";
import merkmale2017 from "./2017.json";
import merkmale2019 from "./2019.json";
import merkmale2021 from "./2021.json";
import merkmale2023 from "./2023.json";
import merkmale2024 from "./2024.json";

export const merkmale = new Set([
  ...merkmale2015,
  ...merkmale2017,
  ...merkmale2019,
  ...merkmale2021,
  ...merkmale2023,
  ...merkmale2024,
]);

export const merkmaleByYear = {
  "2015": new Set(merkmale2015),
  "2017": new Set(merkmale2017),
  "2019": new Set(merkmale2019),
  "2021": new Set(merkmale2021),
  "2023": new Set(merkmale2023),
  "2024": new Set(merkmale2024),
};
