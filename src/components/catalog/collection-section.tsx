import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductGrid } from "@/components/catalog/product-grid";
import type { Product } from "@/types/catalog";

export function CollectionSection({
  eyebrow,
  title,
  description,
  products,
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
}) {
  return (
    <section className="py-8 sm:py-10">
      <Container className="space-y-8">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <ProductGrid products={products} />
      </Container>
    </section>
  );
}
