import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";

const categories = [
  {
    name: "World Cup 2026",
    href: "/catalog/jersey/world-cup-2026",
    image: "/assets/subcategories/world-cup-2026.svg",
    alt: "World Cup 2026 jersey collection artwork",
  },
  {
    name: "Flag Series",
    href: "/catalog/jersey/flags",
    image: "/assets/subcategories/flags.svg",
    alt: "Flag series fanwear artwork",
  },
  {
    name: "Original Copy",
    href: "/catalog/jersey/original-copy-jersey",
    image: "/assets/subcategories/original-copy-jersey.svg",
    alt: "Original copy jersey collection artwork",
  },
];

export function CategoryShowcase() {
  return (
    <section className="bg-[#f8fbff] pb-16 pt-8 sm:pb-24">
      <Container>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-zinc-950">
            Shop By <span className="text-[#01aeea]">Category</span>
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative aspect-[16/9.8] overflow-hidden rounded-lg bg-zinc-900 shadow-[0_18px_44px_-34px_rgba(24,24,27,0.75)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt={category.alt}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />
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
