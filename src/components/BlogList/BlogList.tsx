import { AppRouter } from "~/router";

interface Post {
  title: string;
  slug: string;
}

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="blog-container">
      <h2 className="text-2xl font-bold mb-4">Mietencheck Articles</h2>
      {posts.map((post) => (
        <div key={post.slug} className="mb-5 border-b pb-4">
          <h3 className="text-xl">{post.title}</h3>
          {/* Using your app's specific router pattern */}
          <a
            href={AppRouter.BlogPost({ slug: post.slug })}
            className="text-blue-600 hover:underline"
          >
            Weiterlesen
          </a>
        </div>
      ))}
    </div>
  );
}
