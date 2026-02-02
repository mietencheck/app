import { PortableText, PortableTextComponents } from "@portabletext/react";
import { ReactNode, useEffect, useState } from "react";

import { AppRouter } from "~/router";
import client from "~/sanityClient";

import { Layout } from "../landing/layout";

interface PostData {
  title: string;
  body: any[];
  publishedAt: string;
  imageUrl?: string;
}

const portableTextComponents: PortableTextComponents = {
  marks: {
    internalLink: ({
      value,
      children,
    }: {
      value?: { reference?: { slug?: string } };
      children: ReactNode;
    }) => {
      const slug = value?.reference?.slug;
      if (!slug) return <>{children}</>;
      return (
        <a
          href={AppRouter.BlogPost({ slug })}
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};

export function BlogPostPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post" && slug.current == $slug][0]{
          title,
          "imageUrl": mainImage.asset->url,
          body[]{
            ...,
            markDefs[]{
              ...,
              _type == "internalLink" => {
                "reference": reference->{ "slug": slug.current }
              }
            }
          },
          publishedAt
        }`,
        { slug },
      )
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Sanity fetch error:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="p-10 text-center">Lade Artikel...</div>;
  if (!post)
    return <div className="p-10 text-center">Artikel nicht gefunden.</div>;

  return (
    <Layout>
      <article>
        {/* Purple Header */}
        <div className="flex flex-col items-center bg-purple-9 pt-12 pb-40 md:pb-48">
          <div className="container text-center">
            <a
              href={AppRouter.Blog()}
              className="inline-block text-lg-medium text-yellow-9 text-center mb-5 sm:mb-6"
            >
              Ratgeber
            </a>
            <h1 className="title-36 sm:title-40 md:title-48 lg:title-56 text-yellow-9 text-center max-w-[768px] mx-auto">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Image + Content */}
        <div className="container flex flex-col items-center -mt-24">
          {post.imageUrl && (
            <img
              className="w-full aspect-[8/5] object-cover max-w-[768px]"
              src={post.imageUrl}
              alt={post.title}
            />
          )}

          <div className="prose prose-purple w-full max-w-[560px] py-16">
            {post.body ? (
              <PortableText
                value={post.body}
                components={portableTextComponents}
              />
            ) : (
              <p>Dieser Artikel hat noch keinen Inhalt.</p>
            )}
          </div>
        </div>
      </article>
    </Layout>
  );
}

export default BlogPostPage;
