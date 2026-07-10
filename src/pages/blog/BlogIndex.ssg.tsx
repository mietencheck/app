import { useLoaderData } from "react-router-dom";

import { loadBlogCategories } from "~/blog/loaders";
import { BlogMeta } from "~/components/BlogMeta";
import { buttonVariants } from "~/components/Button/Button";
import { useLocalizeField } from "~/l10n";
import { cn } from "~/lib/utils";
import { PostCardLink } from "~/pages/blog/PostCardLink";
import { AppRouter } from "~/router";
import { imageUrl } from "~/sanity/image";
import { FEATURED_QUERY, INDEX_QUERY } from "~/sanity/queries";
import type { BlogIndexData, PostCard } from "~/sanity/types";
import client from "~/sanityClient";

function isEnglishPath(pathname: string): boolean {
  return pathname.startsWith("/en/");
}

async function loadIndex(lang: "de" | "en"): Promise<BlogIndexData> {
  const [posts, featured, categories] = await Promise.all([
    client.fetch<PostCard[]>(INDEX_QUERY, { lang }),
    client.fetch<PostCard | null>(FEATURED_QUERY, { lang }),
    loadBlogCategories(lang),
  ]);

  const filteredPosts = featured
    ? posts.filter((post) => post._id !== featured._id)
    : posts;

  return {
    posts: filteredPosts,
    featured: featured ?? undefined,
    navCategories: categories,
    activeCategorySlugs: [],
  };
}

export async function loaderDe() {
  return loadIndex("de");
}

export async function loaderEn() {
  return loadIndex("en");
}

export function BlogIndexContent() {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/de/blog";
  const isEn = isEnglishPath(pathname);
  const lang = isEn ? "en" : "de";
  const l = useLocalizeField();
  const { posts, featured } = useLoaderData() as BlogIndexData;

  const metaDescription = isEn
    ? "Guides and articles about fair rent, tenant rights, and next steps in Berlin."
    : "Ratgeber und Artikel zu fairer Miete, Mieterrechten und den nächsten Schritten in Berlin.";

  return (
    <>
      <BlogMeta
        title={l("Ratgeber")}
        description={metaDescription}
        pathname={pathname}
        lang={lang}
      />

      <section className="bg-green-9 bg-[url('/images/hero-pattern.svg')] bg-[length:auto_100%] bg-repeat-x bg-center py-20 sm:py-24">
        <div className="container">
          <h1 className="title-36 sm:title-40 md:title-44 lg:title-48 text-center text-white">
            {l("Ratgeber")}
          </h1>
        </div>
      </section>

      {featured && (
        <section>
          <div className="container pt-16 pb-20 space-y-20 sm:space-y-24">
            <a
              className="block max-w-[960px] mx-auto"
              href={
                isEn
                  ? AppRouter.BlogPostEn({ slug: featured.slug })
                  : AppRouter.BlogPostDe({ slug: featured.slug })
              }
            >
              <div className="flex flex-col justify-between gap-6 md:flex-row md:gap-10">
                {imageUrl(featured.mainImage, {
                  width: 960,
                  height: 600,
                }) && (
                  <div className="w-full lg:pr-4">
                    <img
                      className="w-full aspect-[8/5] object-cover"
                      src={imageUrl(featured.mainImage, {
                        width: 960,
                        height: 600,
                      })}
                      alt={featured.mainImage?.alt ?? featured.title}
                    />
                  </div>
                )}
                <div className="w-full flex flex-col justify-center">
                  <h2 className="heading-24 mb-3 md:title-28 text-gray-12">
                    {featured.title}
                  </h2>
                  {(featured.excerpt ?? featured.subtitle) && (
                    <p className="text-lg mb-8 text-gray-11">
                      {featured.excerpt ?? featured.subtitle}
                    </p>
                  )}
                  <span
                    className={cn(
                      buttonVariants({ variant: "outline", color: "gray" }),
                      "self-start",
                    )}
                  >
                    {l("Artikel Lesen")}
                  </span>
                </div>
              </div>
            </a>
          </div>
        </section>
      )}

      <section>
        <div className="container py-20 space-y-20">
          <h2 className="title-36 sm:title-40 md:title-44 lg:title-48 text-gray-12 text-center">
            {l("Alle Artikel")}
          </h2>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
              {posts.map((post) => (
                <PostCardLink key={post._id} post={post} isEn={isEn} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-11">
              {l("Noch keine Artikel veröffentlicht.")}
            </p>
          )}
        </div>
      </section>
    </>
  );
}

export default function BlogIndexPage() {
  return <BlogIndexContent />;
}
