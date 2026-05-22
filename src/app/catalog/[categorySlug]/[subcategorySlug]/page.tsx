import { notFound } from "next/navigation";
import { CatalogShell } from "@/components/catalog/catalog-shell";
import { getCategories, getProductsBySubcategory, getSubcategoryBySlug } from "@/lib/catalog";

export function generateStaticParams() {
  return getCategories().flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      categorySlug: category.slug,
      subcategorySlug: subcategory.slug,
    })),
  );
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
}) {
  const { categorySlug, subcategorySlug } = await params;
  const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug);
  if (!subcategory) notFound();

  return <CatalogShell title={subcategory.name} description={subcategory.description} products={getProductsBySubcategory(subcategory.slug)} />;
}
