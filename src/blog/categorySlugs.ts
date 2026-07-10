import type { PostCategory } from "~/sanity/types";

const CATEGORY_HERO_BACKGROUND: Record<string, string> = {
  grundlagen: "bg-blue-9",
  basics: "bg-blue-9",
  miete: "bg-red-9",
  rent: "bg-red-9",
  mieterhöhung: "bg-pink-9",
  "rent-increase": "bg-pink-9",
};

export function getCategorySlugs(
  category: PostCategory | null | undefined,
): string[] {
  return category?.slug ? [category.slug] : [];
}

export function getCategoryHeroBackgroundClass(
  categorySlug: string | undefined,
) {
  if (!categorySlug) return "bg-green-9";
  return CATEGORY_HERO_BACKGROUND[categorySlug] ?? "bg-green-9";
}
