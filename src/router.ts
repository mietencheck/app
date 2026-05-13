import { createRouter } from "@swan-io/chicane";

export const AppRouter = createRouter({
  Landing: "/",
  Login: "/login",
  Eintragen: "/eintragen",
  BeratungDetail: "/beratung/:id",
  Beratung: "/beratung",
  Datenschutz: "/datenschutz",
  Impressum: "/impressum",
  Schnelltest: "/schnelltest",
  Details: "/fragebogen/*",
  PDFs: "/pdfs",
  Error: "/error",
  Blog: "/blog",
  BlogPost: "/blog/:slug",
  BlogDe: "/de/blog",
  BlogEn: "/en/blog",
  BlogPostDe: "/de/blog/:slug",
  BlogPostEn: "/en/blog/:slug",
});
