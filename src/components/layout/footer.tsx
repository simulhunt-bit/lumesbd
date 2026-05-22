import Link from "next/link";
import { brand, footerLinks } from "@/content/brand";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer className="border-t border-cyan-500/20 bg-[#060c24] text-white">
      <Container className="py-16">
        {/* Top Section */}
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          {/* Left Column */}
          <div className="space-y-6">
            <Logo />
            <div className="space-y-3">
              <p className="max-w-lg text-sm leading-7 text-cyan-100/70">{brand.bio}</p>
              <p className="text-sm text-cyan-100/60">{brand.tagline}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="grid gap-10 sm:grid-cols-2">
            {/* Navigate Section */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400/80">Navigate</p>
              <div className="flex flex-col gap-2.5">
                {footerLinks.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className="text-sm text-cyan-100/70 transition hover:text-[#01c5fa]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400/80">Contact</p>
              <div className="space-y-2 text-sm text-cyan-100/70">
                <p>{brand.supportEmail}</p>
                <p>{brand.supportPhone}</p>
                <p>Delivery all over Bangladesh.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-cyan-500/20" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-cyan-100/50 md:flex-row md:text-left">
          <p>&copy; {new Date().getFullYear()} LUMES BD. All rights reserved.</p>
          <p>Premium Fashion for Every Style</p>
        </div>
      </Container>
    </footer>
  );
}
