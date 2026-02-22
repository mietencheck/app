import { PortableText, PortableTextComponents } from "@portabletext/react";
import { ReactNode } from "react";
import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";

import { AppRouter } from "~/router";
import client from "~/sanityClient";

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

// Loader runs at build time (and on server in dev) for `/blog/:slug`
export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug!;
  const post = await client.fetch<PostData>(
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
  );

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return post;
}

// Layout-free content component used by vite-react-ssg routes
export function BlogPostContent() {
  const post = useLoaderData() as PostData;

  return (
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
  );
}

// Default export keeps the same API if used elsewhere
export default function BlogPostPage() {
  return <BlogPostContent />;
}
