import { localizedCategoryProjection } from "./localizedFields";

/** GROQ filter for publicly visible blog posts. */
export const PUBLISHED_POST_FILTER = `_type == "post" &&
  language == $lang &&
  !(_id in path("drafts.**")) &&
  defined(slug.current) &&
  defined(publishedAt) &&
  publishedAt <= now()`;

const SIBLING_SLUG_PROJECTION = `"siblingSlug": *[
  _type == "post" &&
  translationGroup == ^.translationGroup &&
  language != $lang &&
  !(_id in path("drafts.**")) &&
  defined(slug.current) &&
  defined(publishedAt) &&
  publishedAt <= now()
][0].slug.current`;

export const postCardProjection = `{
  "_id": _id,
  "title": title,
  "slug": slug.current,
  "subtitle": subtitle,
  "excerpt": excerpt,
  "featured": featured,
  "publishedAt": publishedAt,
  "mainImage": mainImage,
  "categories": categories[]->${localizedCategoryProjection}
}`;

export const postDetailProjection = `{
  "title": title,
  "subtitle": subtitle,
  "excerpt": excerpt,
  "mainImage": mainImage,
  "publishedAt": publishedAt,
  "seo": seo,
  "author": author->{ name, "image": image },
  "categories": categories[]->${localizedCategoryProjection},
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
  ${SIBLING_SLUG_PROJECTION}
}`;

export const INDEX_QUERY = `*[${PUBLISHED_POST_FILTER}] | order(publishedAt desc) ${postCardProjection}`;

export const FEATURED_QUERY = `*[${PUBLISHED_POST_FILTER} && featured == true] | order(publishedAt desc)[0] ${postCardProjection}`;

export const POST_QUERY = `*[${PUBLISHED_POST_FILTER} && slug.current == $slug][0] ${postDetailProjection}`;

export const POST_SLUGS_QUERY = `*[${PUBLISHED_POST_FILTER}].slug.current`;

export const SITEMAP_POSTS_QUERY = `*[${PUBLISHED_POST_FILTER}]{
  "slug": slug.current,
  "updatedAt": coalesce(_updatedAt, publishedAt),
  "noIndex": seo.noIndex
}`;
