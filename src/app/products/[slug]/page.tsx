import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionSection } from "@/components/catalog/collection-section";
import { ProductDetail } from "@/components/product/product-detail";
import { Container } from "@/components/shared/container";
import { getProducts, getProductBySlug, getRecommendedProducts } from "@/lib/catalog";
import { buildMetadata, keywords, productKeywords, siteUrl } from "@/lib/seo";

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

  const description = `Buy ${product.name} from LUMES BD. Premium ${product.subcategorySlug.replaceAll("-", " ")} with sizes ${product.sizes.join(", ")} and Bangladesh delivery.`;
  const productImages = product.images.filter(Boolean);

  return buildMetadata({
    title: `${product.name} Price in Bangladesh | LUMES BD`,
    description,
    path: `/products/${product.slug}`,
    image: productImages[0],
    pageKeywords: keywords([
      ...productKeywords(product),
      `buy ${product.name} Bangladesh`,
      `${product.name} price in Bangladesh`,
      `${product.name} online BD`,
      `${product.shortName} Dhaka delivery`,
      `${product.shortName} Chattogram delivery`,
      `${product.shortName} football fans BD`,
      `${product.shortName} premium jersey`,
    ]),
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const productImages = product.images.filter(Boolean);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "LUMES BD",
    },
    category: product.subcategorySlug.replaceAll("-", " "),
    sku: product.slug,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: "BDT",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      areaServed: "Bangladesh",
    },
    ...(productImages.length > 0
      ? { image: productImages.map((image) => new URL(image, siteUrl).toString()) }
      : {}),
  };

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
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
