import Link from "next/link";

export function Logo() {
  return (
    <Link 
      href="/" 
      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 p-2 transition hover:shadow-lg hover:shadow-cyan-500/50 sm:p-2.5"
      title="LUMES BD"
    >
      <span className="text-lg font-bold text-white sm:text-xl">LB</span>
    </Link>
  );
}
