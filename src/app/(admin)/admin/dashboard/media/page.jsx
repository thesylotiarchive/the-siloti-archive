import { Suspense } from "react";
import MediaPageClient from "@/components/admin/MediaPageClient";

export default function MediaPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading media...</div>}>
      <MediaPageClient />
    </Suspense>
  );
}
