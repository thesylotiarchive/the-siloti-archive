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
        // fetch current user
        const meRes = await fetch("/api/admin/users/me", { credentials: "include" });
        if (!meRes.ok) {
          const errText = await meRes.text();
          console.error("ME route error:", meRes.status, errText);
          throw new Error("Failed to load current user");
        }
        const { me } = await meRes.json();

        // fetch admins
        const listRes = await fetch("/api/admin/users", { credentials: "include" });
        if (!listRes.ok) {
          const errText = await listRes.text();
          console.error("USERS route error:", listRes.status, errText);
          throw new Error("Failed to load admin list");
        }
        const { admins } = await listRes.json();

        setMe(me);
        setAdmins(admins);
      } catch (err) {
        setError(err.message);
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
