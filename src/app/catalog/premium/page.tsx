import { CatalogShell } from "@/components/catalog/catalog-shell";
import { getPremiumProducts } from "@/lib/catalog";

export default function PremiumCatalogPage() {
  return (
    <CatalogShell
      title="Premium Products"
      description="Higher-tier products and collector-focused pieces."
      products={getPremiumProducts()}
    />
  );
}
