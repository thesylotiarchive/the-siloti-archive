import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-300 dark:bg-gray-600",
        className
      )}
    />
  );
}
