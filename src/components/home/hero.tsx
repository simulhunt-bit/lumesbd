import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { brand } from "@/content/brand";
import { Container } from "@/components/shared/container";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#060c24] py-10 sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(1,197,250,0.12)_0%,_rgba(6,12,36,0)_34%),radial-gradient(circle_at_82%_16%,_rgba(1,197,250,0.18),_transparent_30%)]" />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="max-w-2xl">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/20 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-100/72 shadow-[0_18px_46px_-34px_rgba(1,197,250,0.75)] backdrop-blur sm:px-4 sm:text-xs sm:tracking-[0.28em]">
            <Sparkles className="h-4 w-4" />
            Premium Fashionwear
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-normal text-[#01c5fa] sm:text-6xl lg:text-7xl">
            {brand.name}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-cyan-50/72 sm:text-xl sm:leading-9">{brand.bio}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/catalog" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#01c5fa] px-7 py-4 text-sm font-semibold text-[#061026] shadow-[0_22px_54px_-38px_rgba(1,197,250,0.85)] transition hover:bg-cyan-200">
              Shop The Drop
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/catalog/jersey" className="inline-flex items-center justify-center rounded-full border border-cyan-400/20 bg-white/5 px-7 py-4 text-sm font-semibold text-cyan-50 transition hover:border-cyan-300/40 hover:text-[#01c5fa]">
              Explore Jerseys
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 text-center sm:mt-10 sm:grid-cols-2">
            {[
              ["Nationwide", "Bangladesh Delivery"],
              ["Premium", "Quality & Comfort"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-cyan-400/16 bg-[#08112d] p-4 shadow-[0_26px_80px_-58px_rgba(1,197,250,0.52)] backdrop-blur">
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-cyan-200/58 sm:text-xs sm:tracking-[0.18em]">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="grid items-center gap-5 sm:grid-cols-2">
            <div className="rounded-[1.7rem] border border-cyan-400/16 bg-[#08112d] p-7 text-white shadow-[0_34px_90px_-58px_rgba(1,197,250,0.62)] sm:min-h-80 sm:rounded-[2rem]">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-200/58">Drop 01</p>
              <h2 className="mt-7 text-3xl font-bold leading-tight text-[#01c5fa]">World Cup 2026</h2>
              <p className="mt-3 text-sm leading-7 text-cyan-50/68">Sharp supporter kits with premium detail, breathable body, and all-day comfort.</p>
              <Link href="/catalog/jersey/world-cup-2026" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#01c5fa] transition hover:text-cyan-100">
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-[1.7rem] border border-cyan-400/16 bg-[#08112d] p-7 shadow-[0_26px_80px_-58px_rgba(1,197,250,0.52)] sm:min-h-72 sm:translate-y-8 sm:rounded-[2rem]">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-200/58">Drop 02</p>
              <h2 className="mt-7 text-3xl font-bold leading-tight text-[#01aeea]">Flag Series</h2>
              <p className="mt-4 text-sm leading-7 text-cyan-50/68">Statement fanwear and collectible edits styled for everyday movement.</p>
              <Link href="/catalog/jersey/flags" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#01aeea] transition hover:text-cyan-100">
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
