"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { Product } from "@/types/catalog";

type CartItem = {
  id: string;
  slug: string;
  quantity: number;
  size: string;
  color: string;
};

type WishlistItem = {
  id: string;
  slug: string;
  size: string;
  color: string;
};

type ShopContextValue = {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (product: Product, variant?: { size: string; color: string }) => void;
  addToWishlist: (product: Product, variant?: { size: string; color: string }) => void;
  removeFromCart: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  cartCount: number;
  wishlistCount: number;
};

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_KEY = "lumes-cart";
const WISHLIST_KEY = "lumes-wishlist";

const buildVariantId = (slug: string, size: string, color: string) => `${slug}|${size}|${color}`;

export function ShopProvider({ children }: PropsWithChildren) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const storedCart = window.localStorage.getItem(CART_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    if (typeof window === "undefined") return [];
    const storedWishlist = window.localStorage.getItem(WISHLIST_KEY);
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  });

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const value = useMemo<ShopContextValue>(
    () => ({
      cart,
      wishlist,
      addToCart: (product, variant) => {
        const selectedSize = variant?.size || product.sizes[0] || "";
        const selectedColor = variant?.color || product.colors[0]?.name || "";
        const id = buildVariantId(product.slug, selectedSize, selectedColor);

        setCart((current) => {
          const existing = current.find((item) => item.id === id);
          if (existing) {
            return current.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
            );
          }

          return [
            ...current,
            {
              id,
              slug: product.slug,
              quantity: 1,
              size: selectedSize,
              color: selectedColor,
            },
          ];
        });
      },
      addToWishlist: (product, variant) => {
        const selectedSize = variant?.size || product.sizes[0] || "";
        const selectedColor = variant?.color || product.colors[0]?.name || "";
        const id = buildVariantId(product.slug, selectedSize, selectedColor);

        setWishlist((current) => {
          if (current.some((item) => item.id === id)) {
            return current;
          }

          return [
            ...current,
            {
              id,
              slug: product.slug,
              size: selectedSize,
              color: selectedColor,
            },
          ];
        });
      },
      removeFromCart: (id) => setCart((current) => current.filter((item) => item.id !== id)),
      removeFromWishlist: (id) => setWishlist((current) => current.filter((item) => item.id !== id)),
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      wishlistCount: wishlist.length,
    }),
    [cart, wishlist],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }

  return context;
};
