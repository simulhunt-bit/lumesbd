import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlayerEditionBadge({
  className,
  variant = "overlay",
}: {
  className?: string;
  variant?: "overlay" | "inline";
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md sm:text-[11px]",
        variant === "overlay"
          ? "border-cyan-200/20 bg-[#060c24]/72 px-2.5 py-1.5 text-cyan-50 shadow-[0_16px_38px_-26px_rgba(1,197,250,0.9)]"
          : "border-cyan-300/18 bg-cyan-300/10 px-3 py-1.5 text-cyan-50/86",
        className,
      )}
    >
      <Trophy className="h-3.5 w-3.5 text-[#01c5fa]" aria-hidden="true" />
      Player Edition
    </span>
  );
}
