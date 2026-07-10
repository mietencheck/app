import { PortableText } from "@portabletext/react";
import { useEffect } from "react";
import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";

import { useBlogTranslation } from "~/blog/BlogTranslationContext";
import { getCategorySlugs } from "~/blog/categorySlugs";
import { loadBlogCategories } from "~/blog/loaders";
import { Link } from "~/components";
import { BlogMeta } from "~/components/BlogMeta";
import { useInlineLocale, useLocalizeField } from "~/l10n";
import { AppRouter } from "~/router";
import { imageUrl } from "~/sanity/image";
import { portableTextComponents } from "~/sanity/portableText";
import { POST_QUERY } from "~/sanity/queries";
import type { BlogPostData } from "~/sanity/types";
import client from "~/sanityClient";

function formatPublishedAt(date: string | undefined, lang: "de" | "en") {
  if (!date) return null;
  return new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function getMetaDescription(post: BlogPostData) {
  return post.seo?.description ?? post.excerpt ?? post.subtitle;
}

function getMetaTitle(post: BlogPostData) {
  return post.seo?.title ?? post.title;
}

function getOgImage(post: BlogPostData) {
  return (
    imageUrl(post.seo?.ogImage, { width: 1200, height: 630 }) ??
    imageUrl(post.mainImage, { width: 1200, height: 630 })
  );
}

async function loadPost(slug: string, lang: "de" | "en") {
  const [post, categories] = await Promise.all([
    client.fetch<BlogPostData | null>(POST_QUERY, {
      slug,
      lang,
    }),
    loadBlogCategories(lang),
  ]);
  if (!post) throw new Response("Not Found", { status: 404 });
  return {
    ...post,
    navCategories: categories,
    activeCategorySlugs: getCategorySlugs(post.category),
  };
}

export async function loaderDe({ params }: LoaderFunctionArgs) {
  return loadPost(params.slug!, "de");
}

export async function loaderEn({ params }: LoaderFunctionArgs) {
  return loadPost(params.slug!, "en");
}

export function BlogPostContent() {
  const post = useLoaderData() as BlogPostData | undefined;
  const l = useLocalizeField();
  const inlineL = useInlineLocale();
  const { setSiblingSlug } = useBlogTranslation();

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/de/blog";
  const isEn = pathname.startsWith("/en/");
  const lang = isEn ? "en" : "de";

  useEffect(() => {
    setSiblingSlug(post?.siblingSlug ?? null);
    return () => setSiblingSlug(null);
  }, [post?.siblingSlug, setSiblingSlug]);

  if (!post) {
    return (
      <article className="container py-24 text-center">
        <h1 className="title-32 mb-6">{l("Artikel nicht gefunden")}</h1>
        <Link href={isEn ? AppRouter.BlogEn() : AppRouter.BlogDe()}>
          {l("Zurück zur Übersicht")}
        </Link>
      </article>
    );
  }

  const heroImage = imageUrl(post.mainImage, { width: 1536, height: 960 });
  const publishedLabel = formatPublishedAt(post.publishedAt, lang);
  const metaTitle = getMetaTitle(post);
  const metaDescription = getMetaDescription(post);
  const ogImage = getOgImage(post);
  const siblingPathname = post.siblingSlug
    ? isEn
      ? AppRouter.BlogPostDe({ slug: post.siblingSlug })
      : AppRouter.BlogPostEn({ slug: post.siblingSlug })
    : undefined;

  return (
    <article>
      <BlogMeta
        title={metaTitle}
        description={metaDescription}
        pathname={pathname}
        imageUrl={ogImage}
        lang={lang}
        noIndex={post.seo?.noIndex}
        siblingPathname={siblingPathname}
        type="article"
        publishedAt={post.publishedAt}
      />

      <div className="container pt-12 pb-16">
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-12 sm:gap-8">
          <div className="col-span-4 sm:col-span-12 lg:col-start-2 lg:col-span-10 xl:col-start-4 xl:col-span-7">
            {post.category?.slug ? (
              <Link
                href={
                  isEn
                    ? AppRouter.BlogCategoryEn({
                        categorySlug: post.category.slug,
                      })
                    : AppRouter.BlogCategoryDe({
                        categorySlug: post.category.slug,
                      })
                }
                className="inline-block text-lg-medium text-gray-12 mb-4"
              >
                {post.category.title}
              </Link>
            ) : (
              <Link
                href={isEn ? AppRouter.BlogEn() : AppRouter.BlogDe()}
                className="inline-block text-lg-medium text-gray-12 mb-5 sm:mb-6"
              >
                {l("Ratgeber")}
              </Link>
            )}
            <h1 className="title-36 lg:title-40">{post.title}</h1>
            {post.subtitle && (
              <p className="text-lg text-gray-11 mt-6">{post.subtitle}</p>
            )}
            {(publishedLabel || post.author?.name) && (
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-11">
                {publishedLabel && (
                  <span>
                    {inlineL({ de: "Veröffentlicht am ", en: "Published on " })}
                    <time dateTime={post.publishedAt}>{publishedLabel}</time>
                  </span>
                )}
                {post.author?.name && (
                  <span>
                    {l("von")} {post.author.name}
                  </span>
                )}
              </div>
            )}
          </div>

          {heroImage && (
            <div className="col-span-4 sm:col-span-12 xl:col-start-3 xl:col-span-9">
              <img
                className="w-full aspect-[8/5] object-cover mt-8"
                src={heroImage}
                alt={post.mainImage?.alt ?? post.title}
              />
            </div>
          )}

          <div className="col-span-4 sm:col-span-12 lg:col-start-2 lg:col-span-10 xl:col-start-4 xl:col-span-7 prose md:prose-lg pt-8 lg:pt-12">
            {post.body ? (
              <PortableText
                value={post.body}
                components={portableTextComponents}
              />
            ) : (
              <p>{l("Dieser Artikel hat noch keinen Inhalt.")}</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function BlogPostPage() {
  return <BlogPostContent />;
}
