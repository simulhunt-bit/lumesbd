"use client";

import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
import { useShop } from "@/context/shop-context";
import { getProducts } from "@/lib/catalog";

export function WishlistView() {
  const { wishlist } = useShop();
  const items = getProducts().filter((product) => wishlist.includes(product.slug));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-600">Wishlist</p>
        <h1 className="mt-3 text-4xl font-semibold text-zinc-950">Saved pieces</h1>
      </div>
      {items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-sm leading-7 text-zinc-600">
          No products saved yet. <Link href="/catalog" className="font-medium text-zinc-950">Browse the catalog</Link> and add items to your wishlist.
        </div>
      )}
    </div>
  );
}
