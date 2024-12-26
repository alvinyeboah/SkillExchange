import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: "primary" | "secondary" | "accent";
  speed?: "slow" | "normal" | "fast";
}

const gradientMap = {
  primary: "from-primary via-primary/50 to-primary",
  secondary: "from-secondary via-secondary/50 to-secondary",
  accent: "from-accent via-accent/50 to-accent",
};

const speedMap = {
  slow: "animate-shimmer-slow",
  normal: "animate-shimmer",
  fast: "animate-shimmer-fast",
};

export function ShimmerText({
  children,
  className,
  gradient = "primary",
  speed = "normal",
}: ShimmerTextProps) {
  return (
    <span
      className={cn(
        speedMap[speed],
        "bg-gradient-to-r",
        gradientMap[gradient],
        "bg-[length:400%_100%] bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
