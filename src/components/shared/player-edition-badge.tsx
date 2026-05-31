import { Trophy } from "lucide-react";

export function PlayerEditionBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border border-cyan-200/25 bg-[#060c24]/82 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-50 shadow-[0_14px_34px_-24px_rgba(1,197,250,0.8)] backdrop-blur ${className}`}
    >
      <Trophy className="h-3.5 w-3.5 text-[#01c5fa]" aria-hidden="true" />
      Player Edition
    </span>
  );
}
