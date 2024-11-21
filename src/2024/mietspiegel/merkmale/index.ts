import FeatureKeys2015 from "./2015.json";
import FeatureKeys2017 from "./2017.json";
import FeatureKeys2019 from "./2019.json";
import FeatureKeys2021 from "./2021.json";
import FeatureKeys2023 from "./2023.json";
import FeatureKeys2024 from "./2024.json";

export const featureKeysByYear = {
  "2015": new Set(FeatureKeys2015),
  "2017": new Set(FeatureKeys2017),
  "2019": new Set(FeatureKeys2019),
  "2021": new Set(FeatureKeys2021),
  "2023": new Set(FeatureKeys2023),
  "2024": new Set(FeatureKeys2024),
};
