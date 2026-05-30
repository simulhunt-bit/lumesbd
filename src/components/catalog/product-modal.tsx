"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useShop } from "@/context/shop-context";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/catalog";

export function ProductModal({
  product,
  open,
  onClose,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { addToCart, addToWishlist } = useShop();
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name ?? "");

  useEffect(() => {
    if (!open) return;

    setSelectedSize(product?.sizes[0] ?? "");
    setSelectedColor(product?.colors[0]?.name ?? "");

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose, product]);

  if (!open || !product) return null;

  const inStock = product.stock > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-zinc-950/60 p-2 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
      <div className="w-full max-w-3xl overflow-hidden rounded-[1.6rem] bg-white shadow-2xl sm:rounded-[2rem]">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{product.subcategorySlug.replaceAll("-", " ")}</p>
            <h3 className="mt-1 text-xl font-semibold text-zinc-950">{product.name}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-zinc-200 p-2 text-zinc-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-5 p-4 sm:grid-cols-[0.9fr_1.1fr] sm:gap-6 sm:p-6">
          <div className="overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,_#fff7ed,_#f8fafc)] p-4">
            <div className="relative aspect-[4/4.2] overflow-hidden rounded-[1.25rem]">
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-zinc-950">{formatPrice(product.price)}</p>
            <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${inStock ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {inStock ? `${product.stock} in stock` : "Out of stock"}
            </p>
            <div className="mt-5">
              <p className="text-sm font-medium text-zinc-950">Choose size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                      selectedSize === size
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-200 text-zinc-700 hover:border-zinc-950"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <p className="text-sm font-medium text-zinc-950">Choose color</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                      selectedColor === color.name
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-200 text-zinc-700 hover:border-zinc-950"
                    }`}
                  >
                    <span className="h-4 w-4 rounded-full border border-zinc-200" style={{ backgroundColor: color.hex }} />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-zinc-600">{product.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {inStock ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product, { size: selectedSize, color: selectedColor });
                      onClose();
                    }}
                    className="rounded-full border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-300"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product, { size: selectedSize, color: selectedColor });
                      onClose();
                      router.push("/cart");
                    }}
                    className="rounded-full bg-zinc-950 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-zinc-800"
                  >
                    Buy Now
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    addToWishlist(product, { size: selectedSize, color: selectedColor });
                    onClose();
                  }}
                  className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 sm:col-span-2"
                >
                  Add to Wishlist
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
