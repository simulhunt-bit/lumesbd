import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <Image
        src="/lumes-logo.png"
        alt="LUMES BD Logo"
        width={120}
        height={40}
        priority
        className="h-auto w-auto"
      />
    </Link>
  );
}
