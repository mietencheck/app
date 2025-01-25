import { createRouter } from "@swan-io/chicane";

export const AppRouter = createRouter({
  Landing: "/",
  UeberUns: "/ueber-uns",
  Datenschutz: "/datenschutz",
  Impressum: "/impressum",
  Starter: "/schnelltest",
  Details: "/details/*",
  PDFs: "/pdfs",
  Error: "/error",
});
