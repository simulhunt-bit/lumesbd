import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

export function Container({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-8", className)}>{children}</div>;
}
