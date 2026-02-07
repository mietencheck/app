import { createRouter } from "@swan-io/chicane";

export const AppRouter = createRouter({
  Landing: "/",
  UeberUns: "/ueber-uns",
  Datenschutz: "/datenschutz",
  Impressum: "/impressum",
  Schnelltest: "/schnelltest",
  Details: "/details/*",
  Beratung: "/beratung/*",
  PDFs: "/pdfs",
  RechnerKappungsgrenze: "/rechner/kappungsgrenze",
  Error: "/error",
});
