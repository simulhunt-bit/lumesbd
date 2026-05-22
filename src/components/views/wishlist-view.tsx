"use client";

import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
import { useShop } from "@/context/shop-context";
import { getProducts } from "@/lib/catalog";

type WishlistItem = {
  id: string;
  slug: string;
  size: string;
  color: string;
};

export function WishlistView() {
  const { wishlist } = useShop();
  const items = wishlist
    .map((item: WishlistItem) => {
      const product = getProducts().find((entry) => entry.slug === item.slug);
      return product ? { item, product } : null;
    })
    .filter(Boolean) as Array<{ item: WishlistItem; product: ReturnType<typeof getProducts>[number] }>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-600">Wishlist</p>
        <h1 className="mt-3 text-4xl font-semibold text-zinc-950">Saved pieces</h1>
      </div>
      {items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {items.map(({ item, product }) => (
            <ProductCard
              key={item.id}
              product={product}
              variant={{ size: item.size, color: item.color }}
            />
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
