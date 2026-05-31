import type { Product } from "@/types/catalog";

export const AVAILABLE_JERSEY_SIZES = ["L", "XL"] as const;

export const isFlagProduct = (product: Product) => product.subcategorySlug === "flags";

export const isPurchasableSize = (product: Product, size: string) =>
  isFlagProduct(product) || AVAILABLE_JERSEY_SIZES.includes(size as (typeof AVAILABLE_JERSEY_SIZES)[number]);

export const defaultPurchasableSize = (product: Product) =>
  product.sizes.find((size) => isPurchasableSize(product, size)) ?? product.sizes[0] ?? "";
