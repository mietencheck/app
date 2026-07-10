import type { RouteRecord } from "vite-react-ssg";

import { App } from "./App";
import { BlogTranslationProvider } from "./blog/BlogTranslationContext";
import { BlogCategoryNav } from "./components/Blog/BlogCategoryNav";
import {
  BlogCategoryContent,
  loaderDe as blogCategoryLoaderDe,
  loaderEn as blogCategoryLoaderEn,
} from "./pages/blog/BlogCategory.ssg";
import {
  BlogIndexContent,
  loaderDe as blogIndexLoaderDe,
  loaderEn as blogIndexLoaderEn,
} from "./pages/blog/BlogIndex.ssg";
import {
  BlogPostContent,
  loaderDe as blogPostLoaderDe,
  loaderEn as blogPostLoaderEn,
} from "./pages/blog/BlogPost.ssg";
import { Layout } from "./pages/layout";
import { Providers } from "./provider";
import { CATEGORY_SLUGS_QUERY, POST_SLUGS_QUERY } from "./sanity/queries";
import client from "./sanityClient";

async function getBlogPostPaths(lang: "de" | "en") {
  const slugs = await client.fetch<string[]>(POST_SLUGS_QUERY, { lang });
  return slugs
    .filter(
      (slug): slug is string => typeof slug === "string" && slug.length > 0,
    )
    .map((slug) => `/${lang}/blog/${slug}`);
}

async function getBlogCategoryPaths(lang: "de" | "en") {
  const slugs = await client.fetch<string[]>(CATEGORY_SLUGS_QUERY, { lang });
  return slugs
    .filter(
      (slug): slug is string => typeof slug === "string" && slug.length > 0,
    )
    .map((slug) =>
      lang === "en"
        ? `/en/blog/category/${slug}`
        : `/de/blog/kategorie/${slug}`,
    );
}

function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <BlogTranslationProvider>
        <Layout subheader={<BlogCategoryNav />}>{children}</Layout>
      </BlogTranslationProvider>
    </Providers>
  );
}

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: (
      <Providers>
        <App />
      </Providers>
    ),
  },
  {
    path: "/beratung",
    element: (
      <Providers>
        <App />
      </Providers>
    ),
  },
  {
    path: "/de/blog",
    element: (
      <BlogLayout>
        <BlogIndexContent />
      </BlogLayout>
    ),
    loader: blogIndexLoaderDe,
  },
  {
    path: "/en/blog",
    element: (
      <BlogLayout>
        <BlogIndexContent />
      </BlogLayout>
    ),
    loader: blogIndexLoaderEn,
  },
  {
    path: "/de/blog/kategorie/:categorySlug",
    element: (
      <BlogLayout>
        <BlogCategoryContent />
      </BlogLayout>
    ),
    loader: blogCategoryLoaderDe,
    getStaticPaths: async () => getBlogCategoryPaths("de"),
  },
  {
    path: "/en/blog/category/:categorySlug",
    element: (
      <BlogLayout>
        <BlogCategoryContent />
      </BlogLayout>
    ),
    loader: blogCategoryLoaderEn,
    getStaticPaths: async () => getBlogCategoryPaths("en"),
  },
  {
    path: "/de/blog/:slug",
    element: (
      <BlogLayout>
        <BlogPostContent />
      </BlogLayout>
    ),
    loader: blogPostLoaderDe,
    getStaticPaths: async () => getBlogPostPaths("de"),
  },
  {
    path: "/en/blog/:slug",
    element: (
      <BlogLayout>
        <BlogPostContent />
      </BlogLayout>
    ),
    loader: blogPostLoaderEn,
    getStaticPaths: async () => getBlogPostPaths("en"),
  },
  {
    path: "/*",
    element: (
      <Providers>
        <App />
      </Providers>
    ),
  },
];

export default routes;
