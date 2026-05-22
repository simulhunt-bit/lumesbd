import Link from "next/link";
import { brand, footerLinks } from "@/content/brand";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-200 bg-zinc-950 text-zinc-200">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-xl text-sm leading-7 text-zinc-400">{brand.bio}</p>
          <p className="text-sm text-zinc-400">{brand.tagline}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-500">Navigate</p>
            <div className="mt-4 flex flex-col gap-3">
              {footerLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-zinc-300 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-500">Contact</p>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <p>{brand.supportEmail}</p>
              <p>{brand.supportPhone}</p>
              <p>Delivery all over Bangladesh.</p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
