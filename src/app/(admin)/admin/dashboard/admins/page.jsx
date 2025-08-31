"use client";

import { useEffect, useState } from "react";
import AdminUsersManager from "@/components/admin/AdminUsersManager";

export default function AdminUsersPage() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/users/me", { credentials: "include" });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Unauthorized" }));
          throw new Error(err?.error || "Unauthorized");
        }
        const data = await res.json();
        setMe(data.me);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // 🚫 Restrict contributor
  if (me?.role === "CONTRIBUTOR") {
    return <p className="text-red-500">Access Denied</p>;
  }

  return (
    <AdminUsersManager
      initialMe={me}
      canManageSuperadmin={me?.role === "SUPERADMIN"}
    />
  );
}
