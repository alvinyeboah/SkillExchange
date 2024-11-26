import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function ShimmerText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("animate-shimmer bg-gradient-to-r from-primary via-primary/50 to-primary bg-[length:400%_100%] bg-clip-text text-transparent", className)}>
      {children}
    </span>
  );
} 