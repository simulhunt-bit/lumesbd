"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
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
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-cyan-400/16 bg-[#08112d] shadow-[0_26px_80px_-58px_rgba(1,197,250,0.52)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-[0_34px_90px_-54px_rgba(1,197,250,0.62)]">
      <div className="relative aspect-[4/4.6] overflow-hidden bg-[radial-gradient(circle_at_30%_15%,_rgba(1,197,250,0.22),_rgba(6,12,36,0.96)_60%)]">
        <SmartImage src={product.images[0]} alt={product.name} fill imageClassName="object-cover group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
        <button
          type="button"
          className="absolute right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-200/20 bg-[#060c24]/78 text-cyan-50 shadow-sm backdrop-blur transition hover:border-cyan-300/40 hover:text-[#01c5fa]"
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
          <Heart className={`h-4 w-4 ${isSaved ? "fill-current text-rose-400" : ""}`} />
        </button>
        {product.badge && (
          <span className="absolute left-4 top-4 z-40 rounded-full border border-cyan-200/20 bg-[#01c5fa]/16 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-50 backdrop-blur">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/58">{product.subcategorySlug.replaceAll("-", " ")}</p>
            <Link href={`/products/${product.slug}`} className="mt-2 block text-lg font-semibold leading-7 text-white transition hover:text-[#01c5fa]">
              {product.name}
            </Link>
            {variant ? (
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-cyan-50/76">
                <span className="rounded-full border border-cyan-200/14 bg-white/5 px-3 py-1.5">Size: {variant.size}</span>
                <span className="rounded-full border border-cyan-200/14 bg-white/5 px-3 py-1.5">Color: {variant.color}</span>
              </div>
            ) : null}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-semibold text-white">{formatPrice(product.price)}</p>
            {product.compareAtPrice && <p className="text-xs text-cyan-100/38 line-through">{formatPrice(product.compareAtPrice)}</p>}
          </div>
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-cyan-50/68">{product.description}</p>
        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${product.stock > 0 ? "bg-emerald-400/10 text-emerald-200" : "bg-rose-400/10 text-rose-200"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>
            <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/68 transition hover:text-[#01c5fa]">
              Details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => {
              addToCart(product, buyNowVariant);
              router.push("/cart");
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#01c5fa] px-4 py-3 text-sm font-semibold text-[#061026] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-cyan-50/40"
          >
            <ShoppingBag className="h-4 w-4" />
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
