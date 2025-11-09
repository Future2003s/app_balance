"use client";

import { memo } from "react";
import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton = memo(function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  lines,
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200 rounded";

  if (variant === "text" && lines) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              "h-4",
              i === lines - 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    );
  }

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height)
    style.height = typeof height === "number" ? `${height}px` : height;

  const variantClasses = {
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  );
});

// Skeleton components específicos para diferentes partes de la UI
export const CardSkeleton = memo(function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
      <Skeleton variant="text" width="40%" height={24} />
      <Skeleton variant="text" lines={3} />
    </div>
  );
});

export const StatsCardSkeleton = memo(function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="40%" height={32} />
        </div>
        <Skeleton variant="circular" width={48} height={48} />
      </div>
    </div>
  );
});

export const TableSkeleton = memo(function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3">
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="20%" height={20} />
          <Skeleton variant="text" width="15%" height={20} />
        </div>
      ))}
    </div>
  );
});
