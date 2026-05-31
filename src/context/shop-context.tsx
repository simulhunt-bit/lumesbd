"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useAuth } from "@/context/auth-context";
import type { JerseyCustomization } from "@/lib/orders";
import { isPurchasableSize } from "@/lib/product-availability";
import type { Product } from "@/types/catalog";

type CartItem = {
  id: string;
  slug: string;
  quantity: number;
  size: string;
  color: string;
  customizations?: JerseyCustomization[];
};

type StoredCartItem = CartItem & {
  customization?: JerseyCustomization;
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
  updateCartCustomizations: (id: string, customizations?: JerseyCustomization[]) => void;
  updateCartQuantity: (id: string, quantity: number, maxQuantity?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  removeFromWishlist: (id: string) => void;
  cartCount: number;
  wishlistCount: number;
};

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_KEY = "lumes-cart";
const WISHLIST_KEY = "lumes-wishlist";

const buildVariantId = (slug: string, size: string, color: string) => `${slug}|${size}|${color}`;

const trackWishlistDemand = async ({
  product,
  size,
  idToken,
  displayName,
  email,
}: {
  product: Product;
  size: string;
  idToken: string;
  displayName?: string;
  email?: string;
}) => {
  await fetch("/api/wishlist-demand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idToken,
      productSlug: product.slug,
      size,
      displayName,
      email,
    }),
  });
};

export function ShopProvider({ children }: PropsWithChildren) {
  const { user, profile } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const storedCart = window.localStorage.getItem(CART_KEY);
    const parsedCart = storedCart ? (JSON.parse(storedCart) as StoredCartItem[]) : [];

    return parsedCart.map(({ customization, ...item }) => ({
      ...item,
      customizations: item.customizations ?? (customization ? [customization] : undefined),
    }));
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
              item.id === id
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                    customizations: item.customizations?.length
                      ? [
                          ...item.customizations,
                          {
                            ...item.customizations[0],
                            name: "",
                            number: "",
                          },
                        ]
                      : item.customizations,
                  }
                : item,
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

        if (user && !isPurchasableSize(product, selectedSize)) {
          void user.getIdToken().then((idToken) =>
            trackWishlistDemand({
              product,
              size: selectedSize,
              idToken,
              displayName: profile?.displayName ?? user.displayName ?? undefined,
              email: profile?.email ?? user.email ?? undefined,
            }),
          );
        }
      },
      updateCartQuantity: (id, quantity, maxQuantity = Number.POSITIVE_INFINITY) => {
        const safeMaxQuantity = Math.max(1, maxQuantity);
        const safeQuantity = Number.isFinite(quantity) ? quantity : 1;
        const nextQuantity = Math.min(Math.max(1, Math.floor(safeQuantity)), safeMaxQuantity);

        setCart((current) =>
          current.map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item)),
        );
      },
      updateCartCustomizations: (id, customizations) =>
        setCart((current) =>
          current.map((item) => (item.id === id ? { ...item, customizations } : item)),
        ),
      removeFromCart: (id) => setCart((current) => current.filter((item) => item.id !== id)),
      clearCart: () => setCart([]),
      removeFromWishlist: (id) => setWishlist((current) => current.filter((item) => item.id !== id)),
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      wishlistCount: wishlist.length,
    }),
    [cart, profile, user, wishlist],
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
