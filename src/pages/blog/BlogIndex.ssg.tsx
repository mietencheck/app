import { useLoaderData } from "react-router-dom";

import { useLocalizeField } from "~/l10n";
import { AppRouter } from "~/router";
import client from "~/sanityClient";

function isEnglishPath(pathname: string): boolean {
  return pathname.startsWith("/en/");
}

const FEATURED_SLUG = {
  de: "was-ist-die-mietpreisbremse",
} as const;

interface Post {
  title: string;
  slug: string;
  subtitle?: string;
  imageUrl?: string;
}

const INDEX_QUERY = `*[
  _type == "post" &&
  language == $lang &&
  !(_id match "drafts.*") &&
  defined(slug.current)
] | order(_updatedAt desc) {
  "_id": _id,
  "title": title,
  "slug": slug.current,
  "subtitle": subtitle,
  "imageUrl": mainImage.asset->url
}`;

export async function loaderDe() {
  const data = await client.fetch<Post[]>(INDEX_QUERY, { lang: "de" });
  console.log(
    "loaderDe",
    data.length,
    data.map((d: any) => d._id),
  );
  return data;
}

export async function loaderEn() {
  const data = await client.fetch<Post[]>(INDEX_QUERY, { lang: "en" });
  console.log(
    "loaderEn",
    data.length,
    data.map((d: any) => d._id),
  );
  return data;
}

// Layout-free content component used by vite-react-ssg routes
export function BlogIndexContent() {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/de/blog";
  const isEn = isEnglishPath(pathname);
  const l = useLocalizeField();
  const posts = useLoaderData() as Post[];
  const featuredPost =
    posts.find((post) => post.slug === FEATURED_SLUG.de) ?? posts[0];

  return (
    <>
      {/* Hero Section */}
      <section>
        <div className="container pt-16 pb-20 space-y-20 sm:space-y-24 text-purple-11">
          <div className="space-y-12">
            <h2 className="title-40 sm:title-44 md:title-48 lg:title-56 text-purple-11 text-center">
              <span className="inline-block px-4 py-3 transform -rotate-6 bg-yellow-9 text-purple-11">
                {l("Ratgeber")}
              </span>
            </h2>
            <p className="text-xl-book text-purple-11 max-w-xl text-center mx-auto">
              {l("alles was du wissen musst über die Mietpreisbremse")}
            </p>
          </div>

          {/* Featured Article */}
          <div className="max-w-[960px] mx-auto space-y-16">
            <a
              className="flex flex-col justify-between gap-6 md:flex-row md:gap-10"
              href={
                isEn
                  ? AppRouter.BlogEn()
                  : AppRouter.BlogPostDe({ slug: FEATURED_SLUG.de })
              }
            >
              <div className="w-full lg:pr-4">
                {featuredPost?.imageUrl ? (
                  <img
                    className="w-full aspect-[8/5] object-cover"
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                  />
                ) : (
                  <div className="w-full aspect-[8/5] bg-purple-3" />
                )}
              </div>
              <div className="w-full flex flex-col justify-center">
                <h3 className="title-24 mb-3 md:title-28">
                  {l("FAQ 1 Frage")}
                </h3>
                <p className="text-lg-book mb-8">FAQ</p>
                <span className="bg-purple-9 text-base-book rounded-full text-white px-4 py-3 self-start hover:bg-purple-10">
                  {l("Artikel Lesen")}
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* All Articles Section */}
      <section>
        <div className="container py-20 space-y-20">
          {/* Section Title */}
          <h2 className="title-32 sm:title-36 md:title-40 lg:title-44 text-purple-11 text-center">
            <span className="inline-block px-4 py-3 transform -rotate-6 bg-yellow-9 text-purple-11">
              {l("Alle Artikel")}
            </span>
          </h2>

          {/* Articles Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
              {posts.map((post) => {
                const title = post.title;
                const subtitle = post.subtitle;
                const imageSrc = post.imageUrl;

                return (
                  <a
                    key={post.slug}
                    href={
                      isEn
                        ? AppRouter.BlogPostEn({ slug: post.slug })
                        : AppRouter.BlogPostDe({ slug: post.slug })
                    }
                  >
                    <article className="flex flex-wrap justify-between">
                      {imageSrc && (
                        <img
                          className="w-full aspect-[8/5] object-cover mb-6"
                          src={imageSrc}
                          alt={title}
                        />
                      )}
                      <div className="w-full text-purple-11">
                        <h3 className="title-22 mb-3">{title}</h3>
                        {subtitle && <p className="text-lg-book">{subtitle}</p>}
                      </div>
                    </article>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-purple-11">
              {l("Noch keine Artikel veröffentlicht.")}
            </p>
          )}
        </div>
      </section>
    </>
  );
}

// Default export keeps the same API if used elsewhere
export default function BlogIndexPage() {
  return <BlogIndexContent />;
}
