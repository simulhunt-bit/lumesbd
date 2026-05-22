import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/login", "/cart", "/wishlist"],
    },
    sitemap: "https://lumesbd.shop/sitemap.xml",
    host: "https://lumesbd.shop",
  };
}
