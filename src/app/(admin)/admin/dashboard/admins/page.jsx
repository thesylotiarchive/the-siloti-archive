"use client";

import { useEffect, useState } from "react";
import AdminUsersManager from "@/components/admin/AdminUsersManager";

export default function AdminUsersPage() {
  const [me, setMe] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await fetch("/api/admin/users/me", { credentials: "include" });
        const listRes = await fetch("/api/admin/users", { credentials: "include" });

        if (!meRes.ok) throw new Error("Failed to load current user");
        if (!listRes.ok) throw new Error("Failed to load admin list");

        const meData = await meRes.json();
        const listData = await listRes.json();

        setMe(meData?.me || { id: "", username: "", email: "", role: "ADMIN" });
        setAdmins(Array.isArray(listData?.admins) ? listData.admins : []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // ⚠ Ensure me is always an object
  return me ? <AdminUsersManager initialMe={me} initialAdmins={admins} /> : null;
}
