import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { brand } from "@/content/brand";
import { Container } from "@/components/shared/container";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-16">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_30%),linear-gradient(180deg,_#fff7ed_0%,_#f8fafc_100%)]" />
      <Container className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-orange-200 bg-white/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-700 shadow-sm sm:px-4 sm:text-xs sm:tracking-[0.28em]">
            <Sparkles className="h-4 w-4" />
            Premium Fashionwear
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 sm:mt-6 sm:text-6xl lg:text-7xl">
            {brand.name}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 sm:mt-6 sm:text-lg sm:leading-8">{brand.bio}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/catalog" className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-zinc-800">
              Shop The Drop
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/catalog/jersey" className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-3.5 text-sm font-medium text-zinc-800 transition hover:border-zinc-300">
              Explore Jerseys
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 text-center min-[420px]:grid-cols-2 sm:mt-10 sm:grid-cols-3">
            {[
              ["Nationwide", "Bangladesh Delivery"],
              ["Premium", "Quality & Comfort"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/80 bg-white/80 p-3.5 shadow-[0_18px_40px_-30px_rgba(24,24,27,0.6)] backdrop-blur sm:p-4">
                <p className="text-base font-semibold text-zinc-950 sm:text-lg">{value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-zinc-500 sm:text-xs sm:tracking-[0.18em]">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-8 -z-10 h-36 w-36 rounded-full bg-orange-300/30 blur-3xl" />
          <div className="absolute bottom-10 right-2 -z-10 h-40 w-40 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.6rem] bg-zinc-950 p-5 text-white shadow-[0_30px_80px_-40px_rgba(24,24,27,0.9)] sm:rounded-[2rem] sm:p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-orange-300">Drop 01</p>
              <h2 className="mt-6 text-2xl font-semibold sm:mt-8 sm:text-3xl">World Cup 2026</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300">Sharp supporter kits with premium detail, breathable body, and all-day comfort.</p>
            </div>
            <div className="rounded-[1.6rem] border border-zinc-200 bg-white p-5 shadow-[0_30px_80px_-40px_rgba(24,24,27,0.25)] sm:translate-y-8 sm:rounded-[2rem] sm:p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-700">Drop 02</p>
              <h2 className="mt-6 text-2xl font-semibold text-zinc-950 sm:mt-8 sm:text-3xl">Flag Series</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">Statement fanwear and collectible edits styled for everyday movement.</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
