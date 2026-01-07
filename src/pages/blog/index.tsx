import { useEffect, useState } from "react";

import { BlogList } from "~/components/BlogList/BlogList";
import client from "~/sanityClient";

export function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(`*[_type == "post"]{title, "slug": slug.current}`)
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Sanity error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">Lade Blog...</div>;

  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">Mietencheck Blog</h1>
      {posts.length > 0 ? (
        <BlogList posts={posts} />
      ) : (
        <p>Noch keine Artikel veröffentlicht.</p>
      )}
    </main>
  );
}

export default BlogPage;
