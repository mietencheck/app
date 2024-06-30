import { createRouter } from "@swan-io/chicane";

export const DetailsRouter = createRouter(
  {
    Intro: "/einleitung",
    Summary: "/bisherige-angaben",
    Missing: "/fehlende-angaben",
    Result: "/auswertung",
    FormPage: "/*",
  },
  { basePath: "/details" },
);
