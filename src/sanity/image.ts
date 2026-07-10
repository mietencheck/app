import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import client from "~/sanityClient";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource | null | undefined) {
  return builder.image(source ?? "");
}

export function imageUrl(
  source: SanityImageSource | null | undefined,
  options?: { width?: number; height?: number; quality?: number },
) {
  if (!source) return undefined;

  let image = urlFor(source)
    .auto("format")
    .quality(options?.quality ?? 80);

  if (options?.width) {
    image = image.width(options.width);
  }
  if (options?.height) {
    image = image.height(options.height);
  }

  return image.url();
}
