import Link from "next/link";
import { categories } from "@/content/catalog";
import { Container } from "@/components/shared/container";
import { ProductGrid } from "@/components/catalog/product-grid";
import type { Product } from "@/types/catalog";

export function CatalogShell({ title, description, products }: { title: string; description: string; products: Product[] }) {
  return (
    <section className="py-8 sm:py-14">
      <Container className="grid gap-5 sm:gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        <aside className="space-y-6">
          <div className="rounded-[1.6rem] border border-zinc-200 bg-white p-5 shadow-[0_22px_50px_-40px_rgba(24,24,27,0.45)] sm:rounded-[2rem] sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-600">Browse</p>
            <h1 className="mt-4 text-2xl font-semibold text-zinc-950 sm:text-3xl">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-zinc-600">{description}</p>
          </div>
          <div className="rounded-[1.6rem] border border-zinc-200 bg-white p-5 sm:rounded-[2rem] sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-500">Categories</p>
            <div className="mt-4 space-y-4">
              {categories.map((category) => (
                <div key={category.slug}>
                  <Link href={`/catalog/${category.slug}`} className="text-base font-semibold text-zinc-950">
                    {category.name}
                  </Link>
                  <div className="mt-2 flex flex-col gap-2">
                    {category.subcategories.map((subcategory) => (
                      <Link key={subcategory.slug} href={`/catalog/${category.slug}/${subcategory.slug}`} className="text-sm text-zinc-600 transition hover:text-zinc-950">
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
        <div className="space-y-6">
          <div className="rounded-[1.6rem] border border-zinc-200 bg-[linear-gradient(180deg,_#fff7ed,_#ffffff)] p-5 sm:rounded-[2rem] sm:p-6">
            <p className="text-sm text-zinc-600">{products.length} products available</p>
          </div>
          <ProductGrid products={products} />
        </div>
      </Container>
    </section>
  );
}
