import { CatalogShell } from "@/components/catalog/catalog-shell";
import { getNewProducts } from "@/lib/catalog";

export default function NewCatalogPage() {
  return (
    <CatalogShell
      title="New Products"
      description="Fresh arrivals and newly published products."
      products={getNewProducts()}
    />
  );
}
