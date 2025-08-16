"use client";

import { useEffect, useState } from "react";
import AdminUsersManager from "@/components/admin/AdminUsersManager";

export default function AdminUsersPage() {
  const [me, setMe] = useState({ id: "", username: "", email: "", role: "ADMIN" });
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch current user
        const meRes = await fetch("/api/admin/users/me", { credentials: "include" });
        const meData = meRes.ok ? await meRes.json() : null;

        // fetch admins
        const listRes = await fetch("/api/admin/users", { credentials: "include" });
        const listData = listRes.ok ? await listRes.json() : null;

        setMe(meData?.me || { id: "", username: "", email: "", role: "ADMIN" });
        setAdmins(Array.isArray(listData?.admins) ? listData.admins : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return <AdminUsersManager initialMe={me} initialAdmins={admins} />;
}
