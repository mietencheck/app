import { createRouter } from "@swan-io/chicane";

export const DetailsRouter = createRouter(
  {
    Summary: "/bisherige-angaben",
    Missing: "/fehlende-angaben",
    Result: "/auswertung",
    Questions: "/*",
  },
  { basePath: "/fragebogen" },
);
