import { SmartImage } from "@/components/shared/smart-image";
import type { StorySlide } from "@/types/catalog";

export function StoryStrip({ story }: { story: StorySlide[] }) {
  return (
    <section className="py-8">
      <div className="rounded-[1.6rem] border border-zinc-200 bg-white p-5 sm:rounded-[2rem] sm:p-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">Material, finish, and styling details</h2>
          <p className="mt-4 text-base leading-7 text-zinc-600">A closer look at the fabric, finishing, and everyday styling details that make each LUMES piece feel ready beyond matchday.</p>
        </div>
        <div className="mt-6 flex snap-x gap-4 overflow-x-auto pb-3 sm:mt-8 sm:gap-5">
          {story.map((slide) => (
            <article key={slide.title} className="min-w-[240px] flex-1 snap-start overflow-hidden rounded-[1.3rem] border border-zinc-200 bg-zinc-50 sm:min-w-[280px] sm:rounded-[1.6rem]">
              <div className="relative aspect-[4/3]">
                <SmartImage src={slide.image} alt={slide.title} fill imageClassName="object-cover" sizes="(max-width: 768px) 80vw, 33vw" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-zinc-950">{slide.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{slide.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
