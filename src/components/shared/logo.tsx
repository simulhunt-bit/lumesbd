import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link 
      href="/" 
      className="inline-flex items-center justify-center transition hover:opacity-80"
      title="LUMES BD"
    >
      <Image
        src="/lumes-logo.png"
        alt="LUMES BD"
        width={120}
        height={40}
        priority
        quality={90}
        className="h-auto w-28 sm:w-32 lg:w-40"
      />
    </Link>
  );
}
