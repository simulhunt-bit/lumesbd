import Link from "next/link";
import { brand, footerLinks } from "@/content/brand";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";

type SocialIconProps = {
  className?: string;
};

function InstagramIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.5" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

function XIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 5l12 14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M18 5L6 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function FacebookIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 8.2H17V5h-2.9c-3 0-4.6 1.8-4.6 4.4V12H7v3.2h2.5V20H13v-4.8h3l.5-3.2H13V9.7c0-1 .5-1.5 1.5-1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

const socialIcons = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  X: XIcon,
};

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

            {/* Social Section */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400/80">Social</p>
              <div className="flex items-center gap-3">
                {brand.socials.map((item) => {
                  const Icon = socialIcons[item.label as keyof typeof socialIcons];

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-label={item.label}
                      target="_blank"
                      rel="noreferrer"
                      className="flex size-10 items-center justify-center rounded-full border border-cyan-400/25 text-cyan-100/70 transition hover:border-[#01c5fa] hover:bg-[#01c5fa]/10 hover:text-[#01c5fa]"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </Link>
                  );
                })}
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
