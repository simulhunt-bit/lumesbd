import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/catalog";

export const dynamic = "force-static";

const siteUrl = "https://lumesbd.shop";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/catalog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/catalog/new`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/catalog/premium`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = getCategories().flatMap((category) => [
    {
      url: `${siteUrl}/catalog/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...category.subcategories.map((subcategory) => ({
      url: `${siteUrl}/catalog/${category.slug}/${subcategory.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ]);

  const productPages: MetadataRoute.Sitemap = getProducts().map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: product.isPremium ? 0.9 : product.featured ? 0.85 : 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
