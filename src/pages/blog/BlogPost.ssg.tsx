import { PortableText } from "@portabletext/react";
import { useEffect } from "react";
import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";

import { useBlogTranslation } from "~/blog/BlogTranslationContext";
import { BlogMeta } from "~/components/BlogMeta";
import { useLocalizeField } from "~/l10n";
import { AppRouter } from "~/router";
import { imageUrl } from "~/sanity/image";
import { portableTextComponents } from "~/sanity/portableText";
import { POST_QUERY } from "~/sanity/queries";
import type { PostDetail } from "~/sanity/types";
import client from "~/sanityClient";

function formatPublishedAt(date: string | undefined, lang: "de" | "en") {
  if (!date) return null;
  return new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function getMetaDescription(post: PostDetail) {
  return post.seo?.description ?? post.excerpt ?? post.subtitle;
}

function getMetaTitle(post: PostDetail) {
  return post.seo?.title ?? post.title;
}

function getOgImage(post: PostDetail) {
  return (
    imageUrl(post.seo?.ogImage, { width: 1200, height: 630 }) ??
    imageUrl(post.mainImage, { width: 1200, height: 630 })
  );
}

async function loadPost(slug: string, lang: "de" | "en") {
  const post = await client.fetch<PostDetail | null>(POST_QUERY, {
    slug,
    lang,
  });
  if (!post) throw new Response("Not Found", { status: 404 });
  return post;
}

export async function loaderDe({ params }: LoaderFunctionArgs) {
  return loadPost(params.slug!, "de");
}

export async function loaderEn({ params }: LoaderFunctionArgs) {
  return loadPost(params.slug!, "en");
}

export function BlogPostContent() {
  const post = useLoaderData() as PostDetail | undefined;
  const l = useLocalizeField();
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
        <a
          href={isEn ? AppRouter.BlogEn() : AppRouter.BlogDe()}
          className="text-blue-600 hover:underline"
        >
          {l("Zurück zur Übersicht")}
        </a>
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

      <div className="flex flex-col items-center bg-purple-9 pt-12 pb-40 md:pb-48">
        <div className="container text-center">
          <a
            href={isEn ? AppRouter.BlogEn() : AppRouter.BlogDe()}
            className="inline-block text-lg-medium text-yellow-9 text-center mb-5 sm:mb-6"
          >
            {l("Ratgeber")}
          </a>
          <h1 className="title-36 sm:title-40 md:title-48 lg:title-56 text-yellow-9 text-center max-w-[768px] mx-auto">
            {post.title}
          </h1>
          {post.subtitle && (
            <h2 className="text-lg text-purple-11 text-center max-w-[768px] mx-auto">
              {post.subtitle}
            </h2>
          )}
          {(publishedLabel || post.author?.name || post.categories?.length) && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-purple-11">
              {publishedLabel && (
                <time dateTime={post.publishedAt}>{publishedLabel}</time>
              )}
              {post.author?.name && (
                <span>
                  {l("von")} {post.author.name}
                </span>
              )}
              {post.categories?.map((category) => (
                <span
                  key={category.slug ?? category.title}
                  className="rounded-full bg-purple-11/20 px-3 py-1"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container flex flex-col items-center -mt-24">
        {heroImage && (
          <img
            className="w-full aspect-[8/5] object-cover max-w-[768px]"
            src={heroImage}
            alt={post.mainImage?.alt ?? post.title}
          />
        )}

        <div className="prose prose-purple w-full max-w-[560px] py-16">
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
    </article>
  );
}

export default function BlogPostPage() {
  return <BlogPostContent />;
}
