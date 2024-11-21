import { createRouter } from "@swan-io/chicane";

export const AppRouter = createRouter({
  Landing: "/",
  UeberUns: "/ueber-uns",
  Datenschutz: "/datenschutz",
  Impressum: "/impressum",
  Starter: "/schnelltest",
  2024: "/2024", // Jonas: Temporary 2024 Fix
  Details: "/details/*",
  PDFs: "/pdfs",
  Error: "/error",
});
