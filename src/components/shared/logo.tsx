import Link from "next/link";
import { brand } from "@/content/brand";

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-left transition hover:opacity-80"
      title="LUMES BD"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-300/10 text-lg font-black leading-none text-white">
        L
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="text-lg font-black tracking-normal text-white sm:text-xl">{brand.name}</span>
        <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70 sm:block">
          {brand.tagline}
        </span>
      </span>
    </Link>
  );
}
