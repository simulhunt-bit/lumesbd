"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/context/shop-context";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/catalog";

export function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const { addToCart, addToWishlist } = useShop();

  return (
    <section className="py-8 sm:py-14">
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-4">
          <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,_#fff7ed,_#f8fafc)] sm:rounded-[2rem]">
            <Image src={activeImage} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {product.images.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                className={`relative aspect-square overflow-hidden rounded-[1rem] border sm:rounded-[1.4rem] ${activeImage === image ? "border-zinc-950" : "border-zinc-200"}`}
              >
                <Image src={image} alt={product.name} fill className="object-cover" sizes="33vw" />
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[1.6rem] border border-zinc-200 bg-white p-5 shadow-[0_24px_70px_-46px_rgba(24,24,27,0.4)] sm:rounded-[2rem] sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{product.subcategorySlug.replaceAll("-", " ")}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-end gap-3">
            <p className="text-2xl font-semibold text-zinc-950 sm:text-3xl">{formatPrice(product.price)}</p>
            {product.compareAtPrice && <p className="text-lg text-zinc-400 line-through">{formatPrice(product.compareAtPrice)}</p>}
          </div>
          <p className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            {product.stock > 0 ? `${product.stock} pieces available` : "Out of stock"}
          </p>
          <p className="mt-5 text-sm leading-7 text-zinc-600 sm:mt-6 sm:text-base sm:leading-8">{product.description}</p>
          <div className="mt-8 space-y-5">
            <div>
              <p className="text-sm font-medium text-zinc-950">Available colors</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span key={color.name} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
                    <span className="h-4 w-4 rounded-full border border-zinc-200" style={{ backgroundColor: color.hex }} />
                    {color.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-950">Jersey sizes</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <span key={size} className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-700">
                    {size}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-950">Highlights</p>
              <div className="mt-3 space-y-3">
                {product.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-3 text-sm text-zinc-700">
                    <span className="rounded-full bg-orange-100 p-1 text-orange-700">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {product.stock > 0 ? (
              <>
                <button type="button" onClick={() => addToCart(product)} className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:border-zinc-300">
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </button>
                <Link href="/cart" className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">
                  Buy Now
                </Link>
              </>
            ) : (
              <button type="button" onClick={() => addToWishlist(product.slug)} className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 sm:col-span-2">
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
