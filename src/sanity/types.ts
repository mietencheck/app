import type { PortableTextBlock } from "@portabletext/react";

export interface SanityImageWithAlt {
  asset?: {
    _ref?: string;
    _type?: string;
    url?: string;
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  };
}

export interface PostSeo {
  title?: string;
  description?: string;
  ogImage?: SanityImageWithAlt;
  noIndex?: boolean;
}

export interface PostCategory {
  title?: string;
  slug?: string;
}

export interface PostAuthor {
  name?: string;
  image?: SanityImageWithAlt;
}

export interface PostCard {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  featured?: boolean;
  publishedAt?: string;
  mainImage?: SanityImageWithAlt;
  categories?: PostCategory[];
}

export interface PostDetail extends PostCard {
  body?: PortableTextBlock[];
  seo?: PostSeo;
  author?: PostAuthor;
  siblingSlug?: string;
}

export interface SitemapPost {
  slug: string;
  updatedAt: string;
  noIndex?: boolean;
}

export interface BlogIndexData {
  posts: PostCard[];
  featured?: PostCard;
}
