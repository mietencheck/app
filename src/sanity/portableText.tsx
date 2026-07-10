import type { PortableTextComponents } from "@portabletext/react";
import type { ReactNode } from "react";

import { AppRouter } from "~/router";

import { imageUrl } from "./image";
import type { SanityImageWithAlt } from "./types";

export const portableTextComponents: PortableTextComponents = {
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
        <figure>
          <img src={src} alt={value?.alt ?? ""} loading="lazy" />
          {value?.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },
  },
};
