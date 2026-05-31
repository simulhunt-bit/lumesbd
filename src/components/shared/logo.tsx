import Link from "next/link";
import Image from "next/image";
import { brand } from "@/content/brand";

export function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 text-left transition hover:opacity-90"
      title="LUMES BD"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-300/28 bg-[linear-gradient(145deg,_rgba(1,197,250,0.18),_rgba(8,17,45,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_26px_-20px_rgba(1,197,250,0.75)] transition group-hover:border-cyan-300/45 sm:h-11 sm:w-11">
        <Image
          src="/lumes-image-placeholder.png"
          alt=""
          width={30}
          height={24}
          priority
          className="h-auto w-6 drop-shadow-[0_0_12px_rgba(1,197,250,0.22)] sm:w-7"
        />
      </span>
      <span className="flex min-w-0 flex-col justify-center leading-none">
        <span className="text-lg font-extrabold tracking-normal text-white sm:text-xl">{brand.name}</span>
        <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200/68 sm:block">
          {brand.tagline}
        </span>
      </span>
    </Link>
  );
}
