import {
  localizedCategoryProjection,
  localizedString,
} from "./localizedFields";

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
  "category": category->${localizedCategoryProjection}
}`;

export const postDetailProjection = `{
  "title": title,
  "subtitle": subtitle,
  "excerpt": excerpt,
  "mainImage": mainImage,
  "publishedAt": publishedAt,
  "seo": seo,
  "author": author->{ name, "image": image },
  "category": category->${localizedCategoryProjection},
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

export const CATEGORIES_QUERY = `*[_type == "category" && defined(${localizedString("slug")})] | order(${localizedString("title")} asc) {
  "title": ${localizedString("title")},
  "slug": ${localizedString("slug")}
}`;

const categorySlugMatchFilter = `references(*[_type == "category" && ${localizedString("slug")} == $categorySlug]._id)`;

export const CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && ${localizedString("slug")} == $categorySlug][0]{
  "title": ${localizedString("title")},
  "slug": ${localizedString("slug")},
  "description": ${localizedString("description")}
}`;

export const CATEGORY_POSTS_QUERY = `*[${PUBLISHED_POST_FILTER} && ${categorySlugMatchFilter}] | order(publishedAt desc) ${postCardProjection}`;

export const CATEGORY_SLUGS_QUERY = `*[_type == "category" && defined(${localizedString("slug")})]{
  "slug": ${localizedString("slug")}
}.slug`;

export const FEATURED_QUERY = `*[${PUBLISHED_POST_FILTER} && featured == true] | order(publishedAt desc)[0] ${postCardProjection}`;

export const POST_QUERY = `*[${PUBLISHED_POST_FILTER} && slug.current == $slug][0] ${postDetailProjection}`;

export const POST_SLUGS_QUERY = `*[${PUBLISHED_POST_FILTER}].slug.current`;

export const SITEMAP_POSTS_QUERY = `*[${PUBLISHED_POST_FILTER}]{
  "slug": slug.current,
  "updatedAt": coalesce(_updatedAt, publishedAt),
  "noIndex": seo.noIndex
}`;
