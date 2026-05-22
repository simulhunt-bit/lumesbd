import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import type { EventSection as EventSectionType } from "@/types/catalog";

export function EventSection({ event }: { event: EventSectionType }) {
  const palette =
    event.accent === "ember"
      ? "from-orange-500/10 via-amber-50 to-white"
      : "from-sky-500/10 via-cyan-50 to-white";

  return (
    <section className="py-6">
      <Container>
        <div className={`grid gap-6 overflow-hidden rounded-[1.6rem] border border-zinc-200 bg-gradient-to-br ${palette} p-5 shadow-[0_24px_70px_-50px_rgba(24,24,27,0.55)] sm:rounded-[2rem] sm:p-6 lg:grid-cols-[1fr_0.9fr] lg:gap-8 lg:p-8`}>
          <div className="self-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-600">{event.eyebrow}</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">{event.title}</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">{event.description}</p>
            <Link href={event.ctaHref} className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">
              {event.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem]">
            <Image src={event.image} alt={event.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
        </div>
      </Container>
    </section>
  );
}
