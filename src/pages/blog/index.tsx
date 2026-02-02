import { useEffect, useState } from "react";

import { BlogList } from "~/components/BlogList/BlogList";
import { AppRouter } from "~/router";
import client from "~/sanityClient";

import { Layout } from "../landing/layout";

interface Post {
  title: string;
  slug: string;
  subtitle?: string;
  imageUrl?: string;
}

export function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch<Post[]>(
        `*[_type == "post"] {
          title,
          "slug": slug.current,
          subtitle,
          "imageUrl": mainImage.asset->url
        }`,
      )
      .then((data: Post[]) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Sanity error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">Lade Blog...</div>;

  return (
    <Layout>
      {/* Hero Section */}
      <section>
        <div className="container pt-16 pb-20 space-y-20 sm:space-y-24 text-purple-11">
          <div className="space-y-12">
            <h2 className="title-40 sm:title-44 md:title-48 lg:title-56 text-purple-11 text-center">
              <span className="inline-block px-4 py-3 transform -rotate-6 bg-yellow-9 text-purple-11">
                Ratgeber
              </span>
            </h2>
            <p className="text-xl-book text-purple-11 max-w-xl text-center mx-auto">
              Auf dieser Seite findest du alles was du wissen musst über die
              Mietpreisbremse und wie du sie erfolgreich einsetzt.
            </p>
          </div>

          {/* Featured Article */}
          <div className="max-w-[960px] mx-auto space-y-16">
            <a
              className="flex flex-col justify-between gap-6 md:flex-row md:gap-10"
              href={AppRouter.BlogPost({ slug: "was-ist-die-mietpreisbremse" })}
            >
              <div className="w-full lg:pr-4">
                <img
                  className="w-full aspect-[8/5] object-cover"
                  src="/images/blog/mietpreisbremse-faq.png"
                  alt="Was ist die Mietpreisbremse?"
                />
              </div>
              <div className="w-full flex flex-col justify-center">
                <h3 className="title-24 mb-3 md:title-28">
                  Was ist die Mietpreisbremse?
                </h3>
                <p className="text-lg-book mb-8">FAQ</p>
                <span className="bg-purple-9 text-base-book rounded-full text-white px-4 py-3 self-start hover:bg-purple-10">
                  Artikel Lesen
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* All Articles Section */}
      {/* All Articles Section */}
      <section>
        <div className="container py-20 space-y-20">
          {/* Section Title */}
          <h2 className="title-32 sm:title-36 md:title-40 lg:title-44 text-purple-11 text-center">
            <span className="inline-block px-4 py-3 transform -rotate-6 bg-yellow-9 text-purple-11">
              Alle Artikel
            </span>
          </h2>

          {/* Articles Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
              {posts.map((post) => (
                <a
                  key={post.slug}
                  href={AppRouter.BlogPost({ slug: post.slug })}
                >
                  <article className="flex flex-wrap justify-between">
                    {post.imageUrl && (
                      <img
                        className="w-full aspect-[8/5] object-cover mb-6"
                        src={post.imageUrl}
                        alt={post.title}
                      />
                    )}
                    <div className="w-full text-purple-11">
                      <h3 className="title-22 mb-3">{post.title}</h3>
                      {post.subtitle && (
                        <p className="text-lg-book">{post.subtitle}</p>
                      )}
                    </div>
                  </article>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-center text-purple-11">
              Noch keine Artikel veröffentlicht.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default BlogPage;
