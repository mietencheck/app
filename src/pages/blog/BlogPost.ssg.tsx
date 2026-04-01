import { PortableText, PortableTextComponents } from "@portabletext/react";
import { ReactNode, useEffect } from "react";
import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";

import { AppRouter } from "~/router";
import client from "~/sanityClient";

interface PostData {
  title: string;
  subtitle?: string;
  body: any[];
  publishedAt?: string;
  imageUrl?: string;
  siblingSlug?: string; // slug of the translated sibling
}

const portableTextComponents: PortableTextComponents = {
  marks: {
    internalLink: ({
      value,
      children,
    }: {
      value?: { reference?: { slug?: string; language?: "de" | "en" } };
      children: ReactNode;
    }) => {
      const slug = value?.reference?.slug;
      const lang = value?.reference?.language ?? "de";
      if (!slug) return <>{children}</>;
      return (
        <a
          href={
            lang === "en"
              ? AppRouter.BlogPostEn({ slug })
              : AppRouter.BlogPostDe({ slug })
          }
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};

const POST_QUERY = `*[_type == "post" && language == $lang && slug.current == $slug][0]{
  "title": title,
  "subtitle": subtitle,
  "imageUrl": mainImage.asset->url,
  "body": body[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "reference": reference->{
          "slug": slug.current,
          language
        }
      }
    }
  },
  publishedAt,
  "siblingSlug": *[
    _type == "post" &&
    translationGroup == ^.translationGroup &&
    language != $lang &&
    defined(slug.current)
  ][0].slug.current
}`;

async function loadPost(slug: string, lang: "de" | "en") {
  const post = await client.fetch<PostData>(POST_QUERY, { slug, lang });
  if (!post) throw new Response("Not Found", { status: 404 });
  return post;
}

export async function loaderDe({ params }: LoaderFunctionArgs) {
  return loadPost(params.slug!, "de");
}

export async function loaderEn({ params }: LoaderFunctionArgs) {
  return loadPost(params.slug!, "en");
}

// Layout-free content component used by vite-react-ssg routes
export function BlogPostContent() {
  const post = useLoaderData() as PostData;

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/de/blog";
  const isEn = pathname.startsWith("/en/");

  const title = post.title;
  const subtitle = post.subtitle;
  const body = post.body;

  useEffect(() => {
    (window as any).__BLOG_SIBLING_SLUG__ = post.siblingSlug ?? null;
    return () => {
      (window as any).__BLOG_SIBLING_SLUG__ = null;
    };
  }, [post.siblingSlug]);

  return (
    <article>
      {/* Purple Header */}
      <div className="flex flex-col items-center bg-purple-9 pt-12 pb-40 md:pb-48">
        <div className="container text-center">
          <a
            href={isEn ? AppRouter.BlogEn() : AppRouter.BlogDe()}
            className="inline-block text-lg-medium text-yellow-9 text-center mb-5 sm:mb-6"
          >
            Ratgeber
          </a>
          <h1 className="title-36 sm:title-40 md:title-48 lg:title-56 text-yellow-9 text-center max-w-[768px] mx-auto">
            {title}
          </h1>
          {subtitle && (
            <h2 className="text-lg-book text-purple-11 text-center max-w-[768px] mx-auto">
              {subtitle}
            </h2>
          )}
        </div>
      </div>

      {/* Image + Content */}
      <div className="container flex flex-col items-center -mt-24">
        {post.imageUrl && (
          <img
            className="w-full aspect-[8/5] object-cover max-w-[768px]"
            src={post.imageUrl}
            alt={title}
          />
        )}

        <div className="prose prose-purple w-full max-w-[560px] py-16">
          {body ? (
            <PortableText value={body} components={portableTextComponents} />
          ) : (
            <p>Dieser Artikel hat noch keinen Inhalt.</p>
          )}
        </div>
      </div>
    </article>
  );
}

// Default export keeps the same API if used elsewhere
export default function BlogPostPage() {
  return <BlogPostContent />;
}
