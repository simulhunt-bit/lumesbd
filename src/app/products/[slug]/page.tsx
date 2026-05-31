import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionSection } from "@/components/catalog/collection-section";
import { ProductDetail } from "@/components/product/product-detail";
import { Container } from "@/components/shared/container";
import { getProducts, getProductBySlug, getRecommendedProducts } from "@/lib/catalog";
import { buildMetadata, keywords, productKeywords } from "@/lib/seo";

export function generateStaticParams() {
  return getProducts().map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return buildMetadata({
      title: "Product Not Found | LUMES BD",
      description: "The requested LUMES BD product could not be found.",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  const description = `${product.description} Available in ${product.sizes.join(", ")} with Bangladesh delivery.`;

  return buildMetadata({
    title: `${product.name} | LUMES BD`,
    description,
    path: `/products/${product.slug}`,
    image: product.images[0],
    pageKeywords: keywords(productKeywords(product)),
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <Container>
      <ProductDetail product={product} />
      <CollectionSection
        eyebrow="Recommended"
        title="More from this category"
        description="Related items from the same category, shown before the footer for easy browsing."
        products={getRecommendedProducts(product.slug)}
      />
    </Container>
  );
}
