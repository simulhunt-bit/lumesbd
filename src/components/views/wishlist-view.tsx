"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
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
    <div className="space-y-5 sm:space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-cyan-400/15 bg-[#08112d] p-5 text-white shadow-2xl shadow-slate-950/10 sm:rounded-[2rem] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Wishlist</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              Saved pieces
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Keep your favorite LUMES styles close, then move them to cart when you are ready to order.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:min-w-44">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Heart className="h-4 w-4 text-cyan-100" aria-hidden="true" />
              Saved items
            </span>
            <strong className="mt-2 block text-2xl text-white">{items.length}</strong>
          </div>
        </div>
      </section>
      {items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {items.map(({ item, product }) => (
            <ProductCard
              key={item.id}
              product={product}
              variant={{ size: item.size }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-cyan-400/15 bg-[#08112d] p-6 text-center text-sm leading-7 text-slate-300 sm:rounded-[2rem] sm:p-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-100">
            <Heart className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-xl font-semibold text-white">Start your LUMES shortlist</h2>
          <p className="mx-auto mt-2 max-w-md">
            Save standout pieces while you browse and return here when you are ready to compare.
          </p>
          <Link
            href="/catalog"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Browse the catalog
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
