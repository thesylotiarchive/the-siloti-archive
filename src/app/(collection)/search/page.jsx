"use client";

import SearchPageInner from "@/components/public/SearchPageInner";
import { Suspense } from "react";

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading search…</div>}>
      <SearchPageInner />
    </Suspense>
  );
}
