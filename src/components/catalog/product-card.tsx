"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useShop } from "@/context/shop-context";
import { SmartImage } from "@/components/shared/smart-image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/catalog";

export function ProductCard({
  product,
  variant,
}: {
  product: Product;
  variant?: { size: string; color: string };
}) {
  const router = useRouter();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useShop();
  const savedItem = wishlist.find((item) => item.slug === product.slug);
  const isSaved = Boolean(savedItem);
  const buyNowVariant = {
    size: variant?.size ?? product.sizes[0] ?? "",
    color: variant?.color ?? product.colors[0]?.name ?? "",
  };

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_24px_60px_-48px_rgba(24,24,27,0.65)] transition hover:-translate-y-1 hover:shadow-[0_32px_70px_-42px_rgba(24,24,27,0.36)]">
      <div className="relative aspect-[4/4.6] overflow-hidden bg-[linear-gradient(180deg,_#fff7ed,_#f8fafc)]">
        <SmartImage src={product.images[0]} alt={product.name} fill imageClassName="object-cover group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full bg-white/90 p-3 text-zinc-700 shadow-sm backdrop-blur transition hover:text-zinc-950"
          onClick={() => {
            if (isSaved && savedItem) {
              removeFromWishlist(savedItem.id);
            } else {
              addToWishlist(product, {
                size: product.sizes[0] ?? "",
                color: product.colors[0]?.name ?? "",
              });
            }
          }}
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-current text-rose-500" : ""}`} />
        </button>
        {product.badge && <span className="absolute left-4 top-4 rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">{product.badge}</span>}
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{product.subcategorySlug.replaceAll("-", " ")}</p>
            <Link href={`/products/${product.slug}`} className="mt-2 block text-lg font-semibold text-zinc-950 transition hover:text-orange-600">
              {product.name}
            </Link>
            {variant ? (
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-600">
                <span className="rounded-full border border-zinc-200 px-3 py-1">Size: {variant.size}</span>
                <span className="rounded-full border border-zinc-200 px-3 py-1">Color: {variant.color}</span>
              </div>
            ) : null}
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-zinc-950">{formatPrice(product.price)}</p>
            {product.compareAtPrice && <p className="text-xs text-zinc-400 line-through">{formatPrice(product.compareAtPrice)}</p>}
          </div>
        </div>
        <p className="text-sm leading-7 text-zinc-600">{product.description}</p>
        <div className="flex items-center justify-between gap-3">
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${product.stock > 0 ? "text-emerald-700" : "text-rose-700"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => {
              addToCart(product, buyNowVariant);
              router.push("/cart");
            }}
            className="rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
