"use client";

import { useRouter } from "next/navigation";
import { Check, Heart, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/context/shop-context";
import { SmartImage } from "@/components/shared/smart-image";
import { defaultPurchasableSize, isPurchasableSize } from "@/lib/product-availability";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/catalog";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(defaultPurchasableSize(product));
  const defaultColor = product.colors[0]?.name ?? "";
  const { addToCart, addToWishlist } = useShop();
  const canBuySelectedSize = product.stock > 0 && isPurchasableSize(product, selectedSize);

  return (
    <section className="py-6 sm:py-12">
      <div className="grid gap-5 sm:gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="space-y-4">
          <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.5rem] border border-cyan-400/16 bg-[radial-gradient(circle_at_30%_15%,_rgba(1,197,250,0.22),_rgba(6,12,36,0.96)_60%)] shadow-[0_34px_90px_-58px_rgba(1,197,250,0.62)] sm:rounded-[2rem]">
            <SmartImage src={activeImage} alt={product.name} fill imageClassName="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            {product.badge ? (
              <span className="absolute left-4 top-4 z-10 rounded-full border border-cyan-200/20 bg-[#01c5fa]/16 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-50 backdrop-blur">
                {product.badge}
              </span>
            ) : null}
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {product.images.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                className={`relative aspect-square overflow-hidden rounded-[1rem] border bg-[#08112d] transition sm:rounded-[1.4rem] ${
                  activeImage === image ? "border-[#01c5fa] ring-2 ring-[#01c5fa]/24" : "border-cyan-400/16 hover:border-cyan-300/40"
                }`}
                aria-label={`View ${product.name} image`}
              >
                <SmartImage src={image} alt={product.name} fill imageClassName="object-cover" sizes="33vw" />
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-cyan-400/16 bg-[#08112d] p-5 shadow-[0_26px_80px_-58px_rgba(1,197,250,0.52)] sm:rounded-[2rem] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/58 sm:tracking-[0.28em]">{product.subcategorySlug.replaceAll("-", " ")}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <p className="text-2xl font-semibold text-white sm:text-3xl">{formatPrice(product.price)}</p>
            {product.compareAtPrice && <p className="text-lg text-cyan-100/38 line-through">{formatPrice(product.compareAtPrice)}</p>}
          </div>
          <p className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${product.stock > 0 ? "bg-emerald-400/10 text-emerald-200" : "bg-rose-400/10 text-rose-200"}`}>
            {product.stock > 0 ? `${product.stock} pieces available` : "Out of stock"}
          </p>
          <p className="mt-5 text-sm leading-7 text-cyan-50/68 sm:mt-6 sm:text-base sm:leading-8">{product.description}</p>
          <div className="mt-6 grid gap-3 min-[420px]:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-cyan-200/12 bg-white/5 px-4 py-3 text-sm text-cyan-50/76">
              <Truck className="h-4 w-4 shrink-0 text-[#01c5fa]" />
              Bangladesh delivery
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-cyan-200/12 bg-white/5 px-4 py-3 text-sm text-cyan-50/76">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#01c5fa]" />
              Quality checked
            </div>
          </div>
          <div className="mt-8 space-y-5">
            <div>
              <p className="text-sm font-medium text-white">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selectedSize === size
                        ? "border-[#01c5fa] bg-[#01c5fa] text-[#061026]"
                        : "border-cyan-200/14 bg-white/5 text-cyan-50/76 hover:border-cyan-300/40 hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Colors</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span key={color.name} className="inline-flex items-center gap-2 rounded-full border border-cyan-200/14 bg-white/5 px-3 py-2 text-sm text-cyan-50/76">
                    <span className="h-3.5 w-3.5 rounded-full border border-white/35" style={{ backgroundColor: color.hex }} />
                    {color.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Highlights</p>
              <div className="mt-3 space-y-3">
                {product.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-3 text-sm text-cyan-50/76">
                    <span className="rounded-full bg-[#01c5fa]/14 p-1 text-[#01c5fa]">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {canBuySelectedSize ? (
              <>
                <button
                  type="button"
                  onClick={() => addToCart(product, { size: selectedSize, color: defaultColor })}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-400/20 px-5 py-3 text-sm font-medium text-cyan-50 transition hover:border-cyan-300/40 hover:text-[#01c5fa]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(product, { size: selectedSize, color: defaultColor });
                    router.push("/cart");
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-[#01c5fa] px-5 py-3 text-sm font-semibold text-[#061026] transition hover:bg-cyan-200"
                >
                  Buy Now
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => addToWishlist(product, { size: selectedSize, color: defaultColor })}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#01c5fa] px-5 py-3 text-sm font-semibold text-[#061026] transition hover:bg-cyan-200 sm:col-span-2"
              >
                <Heart className="h-4 w-4" />
                Add to Wishlist
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
