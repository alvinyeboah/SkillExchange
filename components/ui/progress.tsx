"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "default" | "success" | "warning" | "error";
  showLabel?: boolean;
  labelPosition?: "top" | "right";
  isIndeterminate?: boolean;
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value,
      variant = "default",
      showLabel = false,
      labelPosition = "right",
      isIndeterminate = false,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: "bg-primary",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500",
    };

    return (
      <div className="relative w-full">
        {showLabel && labelPosition === "top" && (
          <div className="mb-2 flex justify-between text-sm">
            <span>Progress</span>
            <span>{value}%</span>
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(
            "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
            isIndeterminate && "after:animate-progress-loading",
            className
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full w-full flex-1 transition-all",
              variantStyles[variant],
              isIndeterminate && "animate-indeterminate"
            )}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          />
        </ProgressPrimitive.Root>
        {showLabel && labelPosition === "right" && (
          <span className="ml-2 text-sm text-muted-foreground">{value}%</span>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";
