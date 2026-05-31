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
  { label: "Track Order", href: "/track-order" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Dashboard", href: "/dashboard" },
];

export const footerLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/catalog" },
  { label: "Jersey", href: "/catalog/jersey" },
  { label: "Track Order", href: "/track-order" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export const customerServiceLinks: NavItem[] = [
  { label: "How to Order", href: "/how-to-order" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Return & Refund", href: "/return-refund" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "FAQ", href: "/faq" },
];
