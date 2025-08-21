"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const PdfReader = dynamic(() => import("@/components/public/PdfReader"), { ssr: false });

function PdfViewerInner() {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get("fileUrl");

  if (!fileUrl) {
    return <div className="p-4 text-red-500">No PDF file provided.</div>;
  }

  return (
    <div className="w-full h-screen bg-gray-100">
      <PdfReader fileUrl={fileUrl} initialMode="scroll" className="h-full" />
    </div>
  );
}

export default function PdfViewerPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading PDF Viewer...</div>}>
      <PdfViewerInner />
    </Suspense>
  );
}
