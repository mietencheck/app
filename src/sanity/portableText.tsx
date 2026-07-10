import type { PortableTextComponents } from "@portabletext/react";
import type { ReactNode } from "react";

import { AppRouter } from "~/router";

import { imageUrl } from "./image";
import type { SanityImageWithAlt } from "./types";

export const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h2 className="title-28 mt-10 mb-4">{children}</h2>,
    h2: ({ children }) => <h2 className="title-24 mt-8 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="title-20 mt-6 mb-2">{children}</h3>,
    h4: ({ children }) => (
      <h4 className="text-lg-medium mt-4 mb-2">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-purple-9 pl-4 italic my-6">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({
      value,
      children,
    }: {
      value?: { href?: string; blank?: boolean };
      children: ReactNode;
    }) => {
      const href = value?.href;
      if (!href) return <>{children}</>;

      return (
        <a
          href={href}
          className="text-blue-600 hover:underline"
          target={value?.blank ? "_blank" : undefined}
          rel={value?.blank ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
    internalLink: ({
      value,
      children,
    }: {
      value?: { reference?: { slug?: string; language?: "de" | "en" } };
      children: ReactNode;
    }) => {
      const slug = value?.reference?.slug;
      const lang = value?.reference?.language ?? "de";
      if (!slug) return <>{children}</>;

      return (
        <a
          href={
            lang === "en"
              ? AppRouter.BlogPostEn({ slug })
              : AppRouter.BlogPostDe({ slug })
          }
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value?: SanityImageWithAlt }) => {
      const src = imageUrl(value, { width: 800 });
      if (!src) return null;

      return (
        <figure className="my-8">
          <img
            src={src}
            alt={value?.alt ?? ""}
            className="w-full"
            loading="lazy"
          />
          {value?.caption && (
            <figcaption className="mt-2 text-sm text-purple-10">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};
