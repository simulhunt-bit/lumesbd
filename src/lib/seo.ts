import type { Metadata } from "next";
import type { Product } from "@/types/catalog";

export const siteUrl = "https://lumesbd.shop";
export const siteName = "LUMES BD";
export const defaultOgImage = "/lumes-logo.png";

const coreKeywords = [
  "LUMES BD",
  "lumesbd",
  "Bangladesh jersey shop",
  "premium football jersey",
  "football jersey Bangladesh",
  "World Cup 2026 jersey",
  "original copy jersey",
  "national team jersey",
  "fanwear Bangladesh",
  "sportswear Bangladesh",
  "men jersey",
  "women jersey",
  "unisex jersey",
  "online jersey shop",
  "Dhaka jersey delivery",
  "Bangladesh delivery",
  "premium fashion wear",
  "comfortable jersey",
  "breathable jersey",
  "football fan clothing",
  "matchday outfit",
  "team flag jersey",
  "collector jersey",
  "affordable jersey BD",
];

export function keywords(...groups: Array<Array<string | undefined> | string | undefined>) {
  const values = groups.flatMap((group) => (Array.isArray(group) ? group : [group])).filter(Boolean) as string[];
  return Array.from(new Set([...values, ...coreKeywords])).slice(0, Math.max(20, values.length + coreKeywords.length));
}

export function buildMetadata({
  title,
  description,
  path,
  pageKeywords = [],
  image = defaultOgImage,
  noIndex = false,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  pageKeywords?: string[];
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const canonical = new URL(path, siteUrl).toString();
  const imageUrl = new URL(image, siteUrl).toString();

  return {
    title,
    description,
    keywords: keywords(pageKeywords),
    alternates: {
      canonical,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type,
      locale: "en_BD",
      images: [
        {
          url: imageUrl,
          width: 512,
          height: 512,
          alt: title,
          type: image.endsWith(".png") ? "image/png" : "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: {
        url: imageUrl,
        alt: title,
      },
    },
  };
}

export function productKeywords(product: Product) {
  return keywords([
    product.name,
    product.shortName,
    product.categorySlug.replaceAll("-", " "),
    product.subcategorySlug.replaceAll("-", " "),
    product.gender,
    ...product.colors.map((color) => `${color.name} jersey`),
    ...product.sizes.map((size) => `${product.shortName} size ${size}`),
    ...product.highlights,
    `${product.shortName} Bangladesh`,
    `${product.shortName} price BD`,
    `${product.shortName} online`,
  ]);
}
