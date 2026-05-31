"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, ShoppingBag, User2, X } from "lucide-react";
import { useState } from "react";
import { navigation } from "@/content/brand";
import { useAuth } from "@/context/auth-context";
import { useShop } from "@/context/shop-context";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { cartCount, wishlistCount } = useShop();
  const primaryNavigation = navigation.filter((item) => item.href !== "/dashboard");

  return (
    <header className="sticky top-0 z-[100] border-b border-cyan-500/20 bg-[rgba(6,12,36,0.96)] backdrop-blur-xl">
      <Container className="flex min-h-[68px] items-center justify-between gap-2 sm:min-h-[76px] sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Logo />
          <div className="flex items-center gap-1.5 md:hidden">
            <Link
              href="/wishlist"
              className="relative rounded-full border border-cyan-400/20 p-2 text-cyan-100/78 transition hover:border-cyan-400/50 hover:text-[#01c5fa]"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-orange-500 px-1.5 text-[10px] font-semibold text-white">{wishlistCount}</span>}
            </Link>
            <Link
              href="/cart"
              className="relative rounded-full border border-cyan-400/20 p-2 text-cyan-100/78 transition hover:border-cyan-400/50 hover:text-[#01c5fa]"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-zinc-950 px-1.5 text-[10px] font-semibold text-white">{cartCount}</span>}
            </Link>
            <Link
              href={user ? "/dashboard" : "/login"}
              className="rounded-full border border-cyan-400/20 p-2 text-cyan-100/78 transition hover:border-cyan-400/50 hover:text-[#01c5fa]"
              aria-label={user ? "Account dashboard" : "Login"}
            >
              <User2 className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <nav className="hidden items-center gap-8 lg:flex">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-semibold text-cyan-100/78 transition hover:text-[#01c5fa]",
                pathname === item.href && "text-[#01c5fa]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/wishlist" className="relative rounded-full border border-cyan-400/20 p-3 text-cyan-100/78 transition hover:border-cyan-400/50 hover:text-[#01c5fa]">
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-orange-500 px-1.5 text-[10px] font-semibold text-white">{wishlistCount}</span>}
          </Link>
          <Link href="/cart" className="relative rounded-full border border-cyan-400/20 p-3 text-cyan-100/78 transition hover:border-cyan-400/50 hover:text-[#01c5fa]">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-zinc-950 px-1.5 text-[10px] font-semibold text-white">{cartCount}</span>}
          </Link>
          <Link
            href={user ? "/dashboard" : "/login"}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/20 text-sm font-medium text-cyan-100/78 transition hover:border-cyan-400/50 hover:text-[#01c5fa]"
              aria-label={user ? "Account dashboard" : "Login"}
            >
              <User2 className="h-4 w-4" />
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex rounded-full border border-cyan-400/20 p-2 text-cyan-100/78 transition hover:border-cyan-400/50 hover:text-[#01c5fa] md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>
      <div id="mobile-navigation" className={cn("border-t border-cyan-500/20 bg-[#08112d] md:hidden", open ? "block" : "hidden")}>
        <Container className="flex flex-col gap-5 py-5">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("text-sm font-medium text-cyan-100/78", pathname === item.href && "text-[#01c5fa]")}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </Container>
      </div>
    </header>
  );
}
