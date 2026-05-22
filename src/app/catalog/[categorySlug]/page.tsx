import { notFound } from "next/navigation";
import { CatalogShell } from "@/components/catalog/catalog-shell";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/catalog";

export function generateStaticParams() {
  return getCategories().map((category) => ({
    categorySlug: category.slug,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  return <CatalogShell title={category.name} description={category.description} products={getProductsByCategory(category.slug)} />;
}
