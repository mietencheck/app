import React from "react";
import type { RouteRecord } from "vite-react-ssg";

import { App } from "./App";
import {
  BlogIndexContent,
  loader as blogIndexLoader,
} from "./pages/blog/BlogIndex.ssg";
import {
  BlogPostContent,
  loader as blogPostLoader,
} from "./pages/blog/BlogPost.ssg";
import { Layout } from "./pages/landing/layout";
import { Providers } from "./provider";
import client from "./sanityClient";

export const routes: RouteRecord[] = [
  {
    path: "/blog",
    element: (
      <Layout>
        <BlogIndexContent />
      </Layout>
    ),
    loader: blogIndexLoader,
  },
  {
    path: "/blog/:slug",
    element: (
      <Layout>
        <BlogPostContent />
      </Layout>
    ),
    loader: blogPostLoader,
    getStaticPaths: async () => {
      const slugs: string[] = await client.fetch(
        `*[_type == "post" && defined(slug.current)].slug.current`,
      );
      return slugs.map((slug) => `blog/${slug}`);
    },
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
