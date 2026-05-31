import type { NavItem } from "@/types/catalog";

export const brand = {
  name: "LUMES BD",
  tagline: "Light Up Your Style",
  bio: "Premium Jerseys & Modern Fashion Wear for Men & Women. Quality, Comfort, Trend. Delivery all over Bangladesh.",
  supportEmail: "hello@lumesbd.com",
  supportPhone: "+880 1XXX-XXXXXX",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/lumesbd/" },
    { label: "X", href: "https://x.com/lumesbd" },
    { label: "Facebook", href: "https://www.facebook.com/lumesbd" },
  ],
};

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/catalog" },
  { label: "Jersey", href: "/catalog/jersey" },
  { label: "Dashboard", href: "/dashboard" },
];

export const footerLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/catalog" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", href: "/cart" },
  { label: "Login", href: "/login" },
];
