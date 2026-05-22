import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center">
      <div className="relative h-12 w-auto sm:h-14 lg:h-16">
        <Image
          src="/lumes-logo.png"
          alt="LUMES BD Logo"
          width={200}
          height={60}
          priority
          quality={90}
          className="h-full w-auto object-contain"
        />
      </div>
    </Link>
  );
}
