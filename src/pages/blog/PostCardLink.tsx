import { AppRouter } from "~/router";
import { imageUrl } from "~/sanity/image";
import type { PostCard } from "~/sanity/types";

export function PostCardLink({
  post,
  isEn,
}: {
  post: PostCard;
  isEn: boolean;
}) {
  const imageSrc = imageUrl(post.mainImage, { width: 640, height: 400 });
  const summary = post.excerpt ?? post.subtitle;

  return (
    <a
      href={
        isEn
          ? AppRouter.BlogPostEn({ slug: post.slug })
          : AppRouter.BlogPostDe({ slug: post.slug })
      }
    >
      <article className="flex flex-wrap justify-between">
        {imageSrc && (
          <img
            className="w-full aspect-[8/5] object-cover mb-5"
            src={imageSrc}
            alt={post.mainImage?.alt ?? post.title}
            loading="lazy"
          />
        )}
        <div className="w-full">
          <h3 className="heading-22 mb-2 text-gray-12">{post.title}</h3>
          {summary && <p className="text-lg text-gray-11">{summary}</p>}
        </div>
      </article>
    </a>
  );
}
