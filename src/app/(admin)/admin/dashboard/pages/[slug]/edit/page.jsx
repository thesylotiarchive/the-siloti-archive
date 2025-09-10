"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AboutPageEditor from "@/components/admin/pages/AboutPageEditor";
import WhatWeDoEditor from "@/components/admin/pages/WhatWeDoEditor";
import PeoplePageEditor from "@/components/admin/pages/PeoplePageEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { me, authLoading } = useAuth();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      const res = await fetch(`/api/admin/pages/${slug}`);
      const data = await res.json();
      setPage(data);
      setLoading(false);
    }
    fetchPage();
  }, [slug]);

  // Show skeleton while auth is still loading
  if (authLoading || me === undefined) {
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-8 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
        <div className="h-4 w-48 bg-gray-200 rounded" />
      </div>
    );
  }

  // After authLoading is done and me is definitively null (unauthenticated)
  if (!me) {
    return <div className="p-6">Validating session...</div>;
  }

  // Restrict access for non-admin roles (only after auth is ready)
  if (me.role !== "ADMIN" && me.role !== "SUPERADMIN") {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-red-600 font-semibold text-lg">🚫 Access Denied</p>
        <p className="text-gray-600">
          You do not have permission to access this page.
        </p>
        <Button onClick={() => router.push("/admin/dashboard")} variant="secondary">
          Go Back to Dashboard
        </Button>
      </div>
    );
  }

  if (loading)
    return (
      <div className="p-6">
        <Button
          variant="secondary"
          onClick={() => router.push("/admin/dashboard/pages")}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        {/* <div className="p-6 animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div> */}
        loading ...
      </div>
    );

  if (!page)
    return (
      <div className="p-6">
        <Button
          variant="secondary"
          onClick={() => router.push("/admin/dashboard/pages")}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        Page not found
      </div>
    );

  return (
    <div className="p-6">
      {/* Back Button */}
      <Button
        variant="secondary"
        onClick={() => router.push("/admin/dashboard/pages")}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Pages
      </Button>

      {/* Render correct editor component */}
      {slug === "about" && <AboutPageEditor page={page} />}
      {slug === "what-we-do" && <WhatWeDoEditor />}
      {slug === "people" && <PeoplePageEditor page={page} />}
      {slug !== "about" && slug !== "what-we-do" && slug !== "people" && (
        <div className="p-6">⚠️ No editor defined for {slug}</div>
      )}
    </div>
  );
}
