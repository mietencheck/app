import type { RouteRecord } from "vite-react-ssg";

import { App } from "./App";
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
import client from "./sanityClient";

async function getBlogPostPaths(lang: "de" | "en") {
  const slugs = await client.fetch<string[]>(
    `*[_type == "post" && language == $lang && defined(slug.current)].slug.current`,
    { lang },
  );
  return slugs
    .filter(
      (slug): slug is string => typeof slug === "string" && slug.length > 0,
    )
    .map((slug) => `/${lang}/blog/${slug}`);
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
    path: "/de/blog",
    element: (
      <Providers>
        <Layout>
          <BlogIndexContent />
        </Layout>
      </Providers>
    ),
    loader: blogIndexLoaderDe,
  },
  {
    path: "/en/blog",
    element: (
      <Providers>
        <Layout>
          <BlogIndexContent />
        </Layout>
      </Providers>
    ),
    loader: blogIndexLoaderEn,
  },

  // new localized post routes
  {
    path: "/de/blog/:slug",
    element: (
      <Providers>
        <Layout>
          <BlogPostContent />
        </Layout>
      </Providers>
    ),
    loader: blogPostLoaderDe,
    getStaticPaths: async () => getBlogPostPaths("de"),
  },
  {
    path: "/en/blog/:slug",
    element: (
      <Providers>
        <Layout>
          <BlogPostContent />
        </Layout>
      </Providers>
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
