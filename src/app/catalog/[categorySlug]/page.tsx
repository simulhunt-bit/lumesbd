import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogShell } from "@/components/catalog/catalog-shell";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/catalog";
import { buildMetadata, keywords } from "@/lib/seo";

export function generateStaticParams() {
  return getCategories().map((category) => ({
    categorySlug: category.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    return buildMetadata({
      title: "Category Not Found | LUMES BD",
      description: "The requested LUMES BD category could not be found.",
      path: `/catalog/${categorySlug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${category.name} Collection Bangladesh | LUMES BD`,
    description: `Shop ${category.name.toLowerCase()} products from LUMES BD with premium quality, buyer-friendly prices, and delivery across Bangladesh.`,
    path: `/catalog/${category.slug}`,
    image: category.coverImage,
    pageKeywords: keywords([
      `${category.name} Bangladesh`,
      `${category.name} online shop`,
      `${category.name} LUMES BD`,
      `buy ${category.name.toLowerCase()} Bangladesh`,
      `${category.name} price BD`,
      `${category.name} delivery Dhaka`,
      `premium ${category.name.toLowerCase()} BD`,
      ...category.subcategories.map((subcategory) => subcategory.name),
      ...category.subcategories.map((subcategory) => `${subcategory.name} jersey`),
    ]),
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  return (
    <CatalogShell
      title={category.name}
      description={`Shop premium ${category.name.toLowerCase()} styles from LUMES BD, selected for football fans and delivered across Bangladesh.`}
      products={getProductsByCategory(category.slug)}
    />
  );
}
