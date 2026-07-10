import type { PostCategory } from "~/sanity/types";

export function getCategorySlugs(
  category: PostCategory | null | undefined,
): string[] {
  return category?.slug ? [category.slug] : [];
}
