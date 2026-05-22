import type { NavItem } from "@/types/catalog";

export const brand = {
  name: "LUMES BD",
  bengaliName: "লুমেস",
  tagline: "Light Up Your Style",
  bio: "Premium Jerseys & Modern Fashion Wear for Men & Women. Quality, Comfort, Trend. Delivery all over Bangladesh.",
  supportEmail: "hello@lumesbd.com",
  supportPhone: "+880 1XXX-XXXXXX",
  socials: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "TikTok", href: "#" },
  ],
};

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/catalog" },
  { label: "Jersey", href: "/catalog/jersey" },
  { label: "New In", href: "/catalog/new" },
  { label: "Premium", href: "/catalog/premium" },
  { label: "Dashboard", href: "/dashboard" },
];

export const footerLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/catalog" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", href: "/cart" },
  { label: "Login", href: "/login" },
];
