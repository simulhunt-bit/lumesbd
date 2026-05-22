import { CatalogShell } from "@/components/catalog/catalog-shell";
import { getProducts } from "@/lib/catalog";

export default function CatalogPage() {
  return (
    <CatalogShell
      title="All Products"
      description="Browse every currently published item. Product, category, and event content are structured in editable files for easy updates."
      products={getProducts()}
    />
  );
}
