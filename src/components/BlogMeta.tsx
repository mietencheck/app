import { Helmet } from "react-helmet-async";

const SITE = "https://mietencheck.de";
const SITE_NAME = "mietencheck.de";

interface BlogMetaProps {
  title: string;
  description?: string;
  pathname: string;
  imageUrl?: string;
  lang: "de" | "en";
  noIndex?: boolean;
  siblingPathname?: string;
  type?: "website" | "article";
  publishedAt?: string;
}

export function BlogMeta({
  title,
  description,
  pathname,
  imageUrl,
  lang,
  noIndex,
  siblingPathname,
  type = "website",
  publishedAt,
}: BlogMetaProps) {
  const canonical = `${SITE}${pathname}`;
  const fullTitle = `${title} | ${SITE_NAME}`;
  const ogImage = imageUrl ?? `${SITE}/og-image.jpg`;

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {siblingPathname && (
        <>
          <link rel="alternate" hrefLang={lang} href={canonical} />
          <link
            rel="alternate"
            hrefLang={lang === "de" ? "en" : "de"}
            href={`${SITE}${siblingPathname}`}
          />
          <link rel="alternate" hrefLang="x-default" href={canonical} />
        </>
      )}
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={lang === "de" ? "de_DE" : "en_US"} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
      {type === "article" && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
    </Helmet>
  );
}
