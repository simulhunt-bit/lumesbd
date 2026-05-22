"use client";

import Link from "next/link";
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
  const { user } = useAuth();
  const { cartCount, wishlistCount } = useShop();

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-500/20 bg-[rgba(6,12,36,0.86)] backdrop-blur-xl">
      <Container className="flex min-h-[68px] items-center justify-between gap-4 sm:min-h-[76px]">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-cyan-100/78 transition hover:text-[#01c5fa]">
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
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 px-5 py-3 text-sm font-medium text-cyan-100/78 transition hover:border-cyan-400/50 hover:text-[#01c5fa]"
          >
            <User2 className="h-4 w-4" />
            {user ? "Dashboard" : "Login"}
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex rounded-full border border-cyan-400/20 p-3 text-cyan-100/78 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>
      <div className={cn("border-t border-cyan-500/20 bg-[#08112d] md:hidden", open ? "block" : "hidden")}>
        <Container className="flex flex-col gap-5 py-5">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-cyan-100/78" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <Link href="/wishlist" className="rounded-full border border-cyan-400/20 p-3 text-cyan-100/78" onClick={() => setOpen(false)}>
              <Heart className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="rounded-full border border-cyan-400/20 p-3 text-cyan-100/78" onClick={() => setOpen(false)}>
              <ShoppingBag className="h-5 w-5" />
            </Link>
            <Link href={user ? "/dashboard" : "/login"} className="flex-1 rounded-full border border-cyan-400/20 px-5 py-3 text-center text-sm font-medium text-cyan-100/78 transition hover:border-cyan-400/50 hover:text-[#01c5fa]" onClick={() => setOpen(false)}>
              {user ? "Dashboard" : "Login"}
            </Link>
          </div>
        </Container>
      </div>
    </header>
  );
}
