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
import { Layout } from "./pages/landing/layout";
import { Providers } from "./provider";

export const routes: RouteRecord[] = [
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
    // getStaticPaths: async () => {
    //   const slugs: string[] = await client.fetch(
    //     `*[_type == "post_v2" && language == "de" && defined(slug.current)].slug.current`,
    //   );
    //   return slugs.map((slug) => `de/blog/${slug}`);
    // },
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
    // getStaticPaths: async () => {
    //   const slugs: string[] = await client.fetch(
    //     `*[_type == "post_v2" && language == "en" && defined(slug.current)].slug.current`,
    //   );
    //   return slugs.map((slug) => `en/blog/${slug}`);
    // },
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
