import type { Metadata } from "next";
import type { Product } from "@/types/catalog";

export const siteUrl = "https://lumesbd.shop";
export const siteName = "LUMES BD";
export const defaultOgImage = "/lumes-logo.png";

const coreKeywords = [
  "LUMES BD",
  "lumesbd",
  "LUMES BD online shop",
  "LUMES BD jersey",
  "LUMES BD Bangladesh",
  "Bangladesh jersey shop",
  "jersey shop Bangladesh",
  "jersey shop BD",
  "online jersey shop Bangladesh",
  "premium football jersey",
  "football jersey Bangladesh",
  "football jersey BD",
  "football jersey online BD",
  "football jersey price in Bangladesh",
  "buy football jersey Bangladesh",
  "buy jersey online Bangladesh",
  "best jersey shop in Bangladesh",
  "football kit Bangladesh",
  "football kit online BD",
  "World Cup 2026 jersey",
  "World Cup jersey Bangladesh",
  "World Cup football jersey BD",
  "original copy jersey",
  "original copy jersey Bangladesh",
  "premium original copy jersey",
  "best original copy jersey BD",
  "national team jersey",
  "national team jersey Bangladesh",
  "Argentina jersey Bangladesh",
  "Argentina jersey BD",
  "Brazil jersey Bangladesh",
  "Brazil jersey BD",
  "Germany jersey Bangladesh",
  "Portugal jersey Bangladesh",
  "Spain jersey Bangladesh",
  "flag jersey Bangladesh",
  "team flag jersey BD",
  "fanwear Bangladesh",
  "football fanwear Bangladesh",
  "sportswear Bangladesh",
  "sportswear online BD",
  "men jersey",
  "men jersey Bangladesh",
  "women jersey",
  "women jersey Bangladesh",
  "unisex jersey",
  "unisex jersey Bangladesh",
  "online jersey shop",
  "Dhaka jersey delivery",
  "jersey delivery Dhaka",
  "jersey delivery Chattogram",
  "jersey delivery Sylhet",
  "jersey delivery Khulna",
  "jersey delivery Rajshahi",
  "jersey delivery Rangpur",
  "jersey delivery Barishal",
  "jersey delivery Mymensingh",
  "courier delivery jersey Bangladesh",
  "cash on delivery jersey BD",
  "Bangladesh delivery",
  "nationwide delivery Bangladesh",
  "premium fashion wear",
  "premium fashion wear Bangladesh",
  "comfortable jersey",
  "breathable jersey",
  "breathable football jersey BD",
  "football fan clothing",
  "matchday outfit",
  "matchday outfit Bangladesh",
  "team flag jersey",
  "collector jersey",
  "collector jersey Bangladesh",
  "affordable jersey BD",
  "budget football jersey Bangladesh",
  "gift jersey Bangladesh",
  "football gift Bangladesh",
  "eid gift jersey Bangladesh",
  "supporter jersey Bangladesh",
  "premium replica jersey Bangladesh",
  "quality checked jersey",
  "comfortable sports jersey Bangladesh",
  "hot weather jersey Bangladesh",
  "summer football jersey BD",
  "custom football style Bangladesh",
  "fan jersey online Bangladesh",
  "football merchandise Bangladesh",
  "football merch BD",
];

export const bangladeshCommercialKeywords = [
  "buy jersey in Dhaka",
  "buy jersey in Chattogram",
  "buy jersey in Sylhet",
  "buy jersey in Khulna",
  "buy jersey in Rajshahi",
  "buy jersey in Rangpur",
  "buy jersey in Barishal",
  "buy jersey in Mymensingh",
  "Dhaka football jersey shop",
  "Bangladesh football fan shop",
  "fast jersey delivery Bangladesh",
  "premium jersey under budget BD",
  "football jersey sale Bangladesh",
  "jersey discount Bangladesh",
  "latest football jersey BD",
  "new football jersey Bangladesh",
  "authentic look jersey BD",
  "high quality jersey Bangladesh",
  "soft fabric jersey Bangladesh",
  "regular fit jersey BD",
  "premium crest jersey",
  "matchday jersey Bangladesh",
  "streetwear jersey Bangladesh",
  "fanwear for men BD",
  "fanwear for women BD",
  "online sportswear store Bangladesh",
  "Bangladesh online fashion store",
  "sports fashion Bangladesh",
  "jersey for football fans BD",
  "football lover gift Bangladesh",
  "team supporter outfit BD",
  "World Cup outfit Bangladesh",
  "football jersey for students BD",
  "affordable football merch BD",
  "premium copy football jersey BD",
  "national jersey price BD",
  "team jersey online Bangladesh",
  "jersey with courier delivery",
  "quality football jersey BD",
  "comfortable fan jersey BD",
];

export function keywords(...groups: Array<Array<string | undefined> | string | undefined>) {
  const values = groups.flatMap((group) => (Array.isArray(group) ? group : [group])).filter(Boolean) as string[];
  return Array.from(new Set([...values, ...coreKeywords, ...bangladeshCommercialKeywords])).slice(0, 100);
}

export function metaDescription(description: string) {
  return description.length <= 155 ? description : `${description.slice(0, 152).trimEnd()}...`;
}

export function productAlt(product: Product, imageLabel = "product photo") {
  return `${product.name} ${imageLabel} for football fans in Bangladesh by LUMES BD`;
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
    description: metaDescription(description),
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
