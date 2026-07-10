import { CATEGORIES_QUERY } from "~/sanity/queries";
import type { BlogCategory } from "~/sanity/types";
import client from "~/sanityClient";

export async function loadBlogCategories(
  lang: "de" | "en",
): Promise<BlogCategory[]> {
  return client.fetch<BlogCategory[]>(CATEGORIES_QUERY, { lang });
}
