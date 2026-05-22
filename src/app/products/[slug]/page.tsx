import { notFound } from "next/navigation";
import { CollectionSection } from "@/components/catalog/collection-section";
import { ProductDetail } from "@/components/product/product-detail";
import { StoryStrip } from "@/components/product/story-strip";
import { Container } from "@/components/shared/container";
import { getProducts, getProductBySlug, getRecommendedProducts } from "@/lib/catalog";

export function generateStaticParams() {
  return getProducts().map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <Container>
      <ProductDetail product={product} />
      <StoryStrip story={product.story} />
      <CollectionSection
        eyebrow="Recommended"
        title="More from this category"
        description="Related items from the same category, shown before the footer for easy browsing."
        products={getRecommendedProducts(product.slug)}
      />
    </Container>
  );
}
