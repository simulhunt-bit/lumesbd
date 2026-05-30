import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/assets/", "/manifest.json", "/favicon.png", "/lumes-logo.png"],
        disallow: ["/api/", "/dashboard", "/login", "/cart", "/wishlist", "/*.json"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/assets/", "/manifest.json", "/favicon.png", "/lumes-logo.png"],
        disallow: ["/api/", "/dashboard", "/login", "/cart", "/wishlist", "/*.json"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/assets/", "/manifest.json", "/favicon.png", "/lumes-logo.png"],
        disallow: ["/api/", "/dashboard", "/login", "/cart", "/wishlist", "/*.json"],
      },
    ],
    sitemap: "https://lumesbd.shop/sitemap.xml",
    host: "https://lumesbd.shop",
  };
}
