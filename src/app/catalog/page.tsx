import type { Metadata } from "next";
import { CatalogShell } from "@/components/catalog/catalog-shell";
import { getProducts } from "@/lib/catalog";
import { buildMetadata, keywords } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Football Jersey Catalog Bangladesh | LUMES BD",
  description: "Browse all LUMES BD football jerseys, flag fanwear, and premium original copy jerseys with Bangladesh delivery.",
  path: "/catalog",
  pageKeywords: keywords([
    "all LUMES products",
    "jersey catalog Bangladesh",
    "football jersey catalog",
    "premium fanwear catalog",
    "shop jerseys online",
    "buy jersey online Bangladesh",
    "football jersey price BD",
    "Argentina Brazil jersey BD",
    "World Cup jersey catalog",
    "original copy jersey catalog BD",
  ]),
});

export default function CatalogPage() {
  return (
    <CatalogShell
      title="All Products"
      description="Browse every premium jersey, flag fanwear item, and original copy football jersey available for delivery across Bangladesh."
      products={getProducts()}
    />
  );
}
