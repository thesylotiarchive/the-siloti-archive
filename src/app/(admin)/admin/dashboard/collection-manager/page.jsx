// app/(admin)/admin/dashboard/collection-manager/page.jsx

import CollectionManagerClient from "@/components/admin/CollectionManagerClient";
import { Suspense } from "react";

export default function CollectionManagerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <CollectionManagerClient />
    </Suspense>
  );
}
