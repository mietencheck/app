import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";

import { loadBlogCategories } from "~/blog/loaders";
import { BlogMeta } from "~/components/BlogMeta";
import { useInlineLocale } from "~/l10n";
import { PostCardLink } from "~/pages/blog/PostCardLink";
import { CATEGORY_BY_SLUG_QUERY, CATEGORY_POSTS_QUERY } from "~/sanity/queries";
import type { BlogCategoryData } from "~/sanity/types";
import client from "~/sanityClient";

function isEnglishPath(pathname: string): boolean {
  return pathname.startsWith("/en/");
}

async function loadCategory(
  categorySlug: string,
  lang: "de" | "en",
): Promise<BlogCategoryData> {
  const [category, posts, categories] = await Promise.all([
    client.fetch<BlogCategoryData["category"] | null>(CATEGORY_BY_SLUG_QUERY, {
      lang,
      categorySlug,
    }),
    client.fetch<BlogCategoryData["posts"]>(CATEGORY_POSTS_QUERY, {
      lang,
      categorySlug,
    }),
    loadBlogCategories(lang),
  ]);

  if (!category?.slug) throw new Response("Not Found", { status: 404 });

  return {
    category,
    posts,
    navCategories: categories,
    activeCategorySlugs: category.slug ? [category.slug] : [],
  };
}

export async function loaderDe({ params }: LoaderFunctionArgs) {
  return loadCategory(params.categorySlug!, "de");
}

export async function loaderEn({ params }: LoaderFunctionArgs) {
  return loadCategory(params.categorySlug!, "en");
}

export function BlogCategoryContent() {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/de/blog";
  const isEn = isEnglishPath(pathname);
  const lang = isEn ? "en" : "de";
  const l = useInlineLocale();
  const { category, posts } = useLoaderData() as BlogCategoryData;

  const categoryTitle = category.title ?? l({ de: "Ratgeber", en: "Guide" });

  const metaDescription =
    category.description ??
    l({
      de: `Artikel in der Kategorie „${categoryTitle}“.`,
      en: `Articles in the “${categoryTitle}” category.`,
    });

  return (
    <>
      <BlogMeta
        title={categoryTitle}
        description={metaDescription}
        pathname={pathname}
        lang={lang}
      />

      <section>
        <div className="container py-20 space-y-20">
          <h1 className="title-36 sm:title-40 md:title-44 lg:title-48 text-gray-12 text-center">
            {categoryTitle}
          </h1>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
              {posts.map((post) => (
                <PostCardLink key={post._id} post={post} isEn={isEn} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-11">
              {l({
                de: "Noch keine Artikel in dieser Kategorie.",
                en: "No articles in this category yet.",
              })}
            </p>
          )}
        </div>
      </section>
    </>
  );
}

export default function BlogCategoryPage() {
  return <BlogCategoryContent />;
}
