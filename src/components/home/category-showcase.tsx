import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";

const categories = [
  {
    name: "World Cup 2026",
    href: "/catalog/jersey/world-cup-2026",
    image: "/assets/subcategories/world-cup-2026.svg",
    alt: "World Cup 2026 football jersey collection for Bangladesh fans",
  },
  {
    name: "Flag Series",
    href: "/catalog/jersey/flags",
    image: "/assets/subcategories/flags.svg",
    alt: "Flag jersey fanwear collection with Bangladesh delivery",
  },
  {
    name: "Original Copy",
    href: "/catalog/jersey/original-copy-jersey",
    image: "/assets/subcategories/original-copy-jersey.svg",
    alt: "Premium original copy jersey collection in Bangladesh",
  },
];

export function CategoryShowcase() {
  return (
    <section className="bg-[#060c24] pb-16 pt-8 sm:pb-24">
      <Container>
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/58">Collections</p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            Shop By <span className="text-[#01c5fa]">Category</span>
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative aspect-[16/9.8] overflow-hidden rounded-[1.6rem] border border-cyan-400/16 bg-[#08112d] shadow-[0_26px_80px_-58px_rgba(1,197,250,0.52)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-[0_34px_90px_-54px_rgba(1,197,250,0.62)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt={category.alt}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#060c24]/88 via-[#060c24]/24 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-30 p-6">
                <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#01c5fa]">
                  View Collection
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
