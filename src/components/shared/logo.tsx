import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link 
      href="/" 
      className="inline-flex items-center justify-center rounded-xl bg-[#060c24] p-1.5 transition hover:opacity-80 sm:p-2"
      title="LUMES BD"
    >
      <Image
        src="/favicon.png"
        alt="LUMES BD"
        width={32}
        height={32}
        priority
        quality={90}
        className="h-8 w-8 sm:h-10 sm:w-10"
      />
    </Link>
  );
}
