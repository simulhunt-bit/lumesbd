import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { brand } from "@/content/brand";
import { Container } from "@/components/shared/container";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f8fbff] py-10 sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_9%_8%,_rgba(249,115,22,0.16),_transparent_30%),radial-gradient(circle_at_92%_4%,_rgba(1,197,250,0.16),_transparent_28%),linear-gradient(180deg,_#fff8f1_0%,_#f8fbff_72%,_#f8fbff_100%)]" />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="max-w-2xl">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-orange-100 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-600 shadow-[0_14px_34px_-24px_rgba(249,115,22,0.8)] sm:px-4 sm:text-xs sm:tracking-[0.28em]">
            <Sparkles className="h-4 w-4" />
            Premium Fashionwear
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-normal text-[#01aef0] sm:text-6xl lg:text-7xl">
            {brand.name}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-700 sm:text-xl sm:leading-9">{brand.bio}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/catalog" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#070b13] px-7 py-4 text-sm font-semibold text-[#01c5fa] shadow-[0_18px_34px_-28px_rgba(7,11,19,0.9)] transition hover:bg-zinc-900 hover:text-cyan-100">
              Shop The Drop
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/catalog/jersey" className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-7 py-4 text-sm font-semibold text-[#01aeea] shadow-sm transition hover:border-cyan-200 hover:text-zinc-950">
              Explore Jerseys
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 text-center sm:mt-10 sm:grid-cols-2">
            {[
              ["Nationwide", "Bangladesh Delivery"],
              ["Premium", "Quality & Comfort"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-zinc-100 bg-white/90 p-4 shadow-[0_18px_45px_-32px_rgba(24,24,27,0.55)] backdrop-blur">
                <p className="text-lg font-bold text-zinc-950">{value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-zinc-500 sm:text-xs sm:tracking-[0.18em]">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="grid items-center gap-5 sm:grid-cols-2">
            <div className="rounded-[1.7rem] bg-[#070b13] p-7 text-white shadow-[0_34px_80px_-44px_rgba(7,11,19,0.9)] sm:min-h-80 sm:rounded-[2rem]">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-orange-300">Drop 01</p>
              <h2 className="mt-7 text-3xl font-bold leading-tight text-[#01c5fa]">World Cup 2026</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300">Sharp supporter kits with premium detail, breathable body, and all-day comfort.</p>
              <Link href="/catalog/jersey/world-cup-2026" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#01c5fa] transition hover:text-cyan-100">
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-[1.7rem] border border-zinc-100 bg-white p-7 shadow-[0_34px_80px_-48px_rgba(24,24,27,0.45)] sm:min-h-72 sm:translate-y-8 sm:rounded-[2rem]">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-700/70">Drop 02</p>
              <h2 className="mt-7 text-3xl font-bold leading-tight text-[#01aeea]">Flag Series</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-600">Statement fanwear and collectible edits styled for everyday movement.</p>
              <Link href="/catalog/jersey/flags" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#01aeea] transition hover:text-zinc-950">
                Shop Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
