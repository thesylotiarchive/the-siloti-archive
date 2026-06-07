import { Suspense } from "react";
import MediaPageClient from "@/components/admin/MediaPageClient";

export default function MediaPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-8 h-8 border-4 border-emerald-500/80 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading media...</p>
      </div>
    }>
      <MediaPageClient />
    </Suspense>
  );
}
