import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogShell } from "@/components/catalog/catalog-shell";
import { getCategories, getProductsBySubcategory, getSubcategoryBySlug } from "@/lib/catalog";
import { buildMetadata, keywords } from "@/lib/seo";

export function generateStaticParams() {
  return getCategories().flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      categorySlug: category.slug,
      subcategorySlug: subcategory.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug, subcategorySlug } = await params;
  const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug);
  if (!subcategory) {
    return buildMetadata({
      title: "Subcategory Not Found | LUMES BD",
      description: "The requested LUMES BD collection could not be found.",
      path: `/catalog/${categorySlug}/${subcategorySlug}`,
      noIndex: true,
    });
  }

  const products = getProductsBySubcategory(subcategory.slug);

  return buildMetadata({
    title: `${subcategory.name} Jerseys Bangladesh | LUMES BD`,
    description: `Buy ${subcategory.name.toLowerCase()} jerseys from LUMES BD with premium fabric, quality checks, and delivery across Bangladesh.`,
    path: `/catalog/${categorySlug}/${subcategory.slug}`,
    image: subcategory.coverImage,
    pageKeywords: keywords([
      subcategory.name,
      `${subcategory.name} Bangladesh`,
      `${subcategory.name} online`,
      `${subcategory.name} price BD`,
      `buy ${subcategory.name.toLowerCase()} Bangladesh`,
      `${subcategory.name} jersey Dhaka`,
      `${subcategory.name} delivery Bangladesh`,
      `premium ${subcategory.name.toLowerCase()} jersey`,
      ...products.map((product) => product.name),
      ...products.map((product) => product.shortName),
    ]),
  });
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
}) {
  const { categorySlug, subcategorySlug } = await params;
  const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug);
  if (!subcategory) notFound();

  return (
    <CatalogShell
      title={subcategory.name}
      description={`Find ${subcategory.name.toLowerCase()} styles for matchday, gifting, and everyday fanwear with delivery throughout Bangladesh.`}
      products={getProductsBySubcategory(subcategory.slug)}
    />
  );
}
