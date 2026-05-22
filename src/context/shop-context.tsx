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
  slug: string;
  quantity: number;
};

type ShopContextValue = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product) => void;
  addToWishlist: (slug: string) => void;
  removeFromCart: (slug: string) => void;
  removeFromWishlist: (slug: string) => void;
  cartCount: number;
  wishlistCount: number;
};

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_KEY = "lumes-cart";
const WISHLIST_KEY = "lumes-wishlist";

export function ShopProvider({ children }: PropsWithChildren) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const storedCart = window.localStorage.getItem(CART_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
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
      addToCart: (product) =>
        setCart((current) => {
          const existing = current.find((item) => item.slug === product.slug);
          if (existing) {
            return current.map((item) =>
              item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item,
            );
          }

          return [...current, { slug: product.slug, quantity: 1 }];
        }),
      addToWishlist: (slug) =>
        setWishlist((current) => (current.includes(slug) ? current : [...current, slug])),
      removeFromCart: (slug) => setCart((current) => current.filter((item) => item.slug !== slug)),
      removeFromWishlist: (slug) =>
        setWishlist((current) => current.filter((item) => item !== slug)),
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
