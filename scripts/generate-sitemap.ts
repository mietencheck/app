import fs from "node:fs";
import path from "node:path";

import client from "../src/sanityClient";

const SITE = "https://mietencheck.de";

const STATIC_PATHS = [
  "/",
  "/schnelltest",
  "/eintragen",
  "/impressum",
  "/datenschutz",
  "/de/blog",
  "/en/blog",
];

interface BlogPost {
  slug: string;
  _updatedAt: string;
}

async function getBlogPosts(lang: "de" | "en") {
  return client.fetch<BlogPost[]>(
    `*[_type == "post" && language == $lang && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }`,
    { lang },
  );
}

function toLastmod(isoDate: string) {
  return isoDate.slice(0, 10);
}

function urlEntry(loc: string, lastmod?: string, changefreq?: string) {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  const changefreqTag = changefreq
    ? `\n    <changefreq>${changefreq}</changefreq>`
    : "";

  return `  <url>
    <loc>${loc}</loc>${lastmodTag}${changefreqTag}
  </url>`;
}

async function generateSitemap() {
  const [dePosts, enPosts] = await Promise.all([
    getBlogPosts("de"),
    getBlogPosts("en"),
  ]);

  const entries = [
    ...STATIC_PATHS.map((pathname) =>
      urlEntry(
        `${SITE}${pathname === "/" ? "/" : pathname}`,
        undefined,
        "weekly",
      ),
    ),
    ...dePosts
      .filter((post) => post.slug)
      .map((post) =>
        urlEntry(
          `${SITE}/de/blog/${post.slug}`,
          toLastmod(post._updatedAt),
          "monthly",
        ),
      ),
    ...enPosts
      .filter((post) => post.slug)
      .map((post) =>
        urlEntry(
          `${SITE}/en/blog/${post.slug}`,
          toLastmod(post._updatedAt),
          "monthly",
        ),
      ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

  const outputPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(outputPath, sitemap, "utf8");
  console.log(`Wrote ${entries.length} URLs to ${outputPath}`);
}

generateSitemap().catch((error) => {
  console.error("Failed to generate sitemap:", error);
  process.exit(1);
});
