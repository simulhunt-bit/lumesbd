import type { Metadata } from "next";
import { CatalogShell } from "@/components/catalog/catalog-shell";
import { getProducts } from "@/lib/catalog";
import { buildMetadata, keywords } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "All Products | LUMES BD",
  description: "Browse every LUMES BD jersey, flag series item, and premium original copy football jersey in one catalog.",
  path: "/catalog",
  pageKeywords: keywords([
    "all LUMES products",
    "jersey catalog Bangladesh",
    "football jersey catalog",
    "premium fanwear catalog",
    "shop jerseys online",
  ]),
});

export default function CatalogPage() {
  return (
    <CatalogShell
      title="All Products"
      description="Browse every currently published item. Product, category, and event content are structured in editable files for easy updates."
      products={getProducts()}
    />
  );
}
