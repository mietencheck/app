import { PortableText } from "@portabletext/react"; // 1. Add this import
import { useEffect, useState } from "react";

import { AppRouter } from "~/router";
import client from "~/sanityClient";

interface PostData {
  title: string;
  body: any[];
  publishedAt: string;
}

export function BlogPostPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post" && slug.current == $slug][0]{
          title,
          body,
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
    <main className="max-w-3xl mx-auto p-10">
      <a
        href={AppRouter.Blog()}
        className="text-blue-600 hover:underline mb-8 inline-block"
      >
        ← Zurück zur Übersicht
      </a>

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      {/* 2. Display the actual date if available */}
      {post.publishedAt && (
        <p className="text-gray-500 mb-8">
          {new Date(post.publishedAt).toLocaleDateString("de-DE")}
        </p>
      )}

      <div className="prose lg:prose-xl">
        {/* 3. Use the PortableText component here */}
        {post.body ? (
          <PortableText value={post.body} />
        ) : (
          <p>Dieser Artikel hat noch keinen Inhalt.</p>
        )}
      </div>
    </main>
  );
}

export default BlogPostPage;
