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
  Error: "/error",
  Blog: "/blog",
  BlogPost: "/blog/:slug",
  BlogDe: "/de/blog",
  BlogEn: "/en/blog",
  BlogPostDe: "/de/blog/:slug",
  BlogPostEn: "/en/blog/:slug",
});
