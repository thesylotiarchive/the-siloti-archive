"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/admin/dashboard/metrics");
        if (!res.ok) throw new Error("Failed to fetch metrics");
        const data = await res.json();
        setMetrics(data.metrics);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {!metrics ? (
        <p className="text-muted-foreground">Loading metrics...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-3xl mt-2">{metrics.users}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">Admins</h2>
              <p className="text-3xl mt-2">{metrics.admins}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">Collections</h2>
              <p className="text-3xl mt-2">{metrics.collections}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">Total Media Items</h2>
              <p className="text-3xl mt-2">{metrics.mediaItems}</p>
            </CardContent>
          </Card>

          {/* Dynamically render media types */}
          {metrics.mediaCounts &&
            Object.entries(metrics.mediaCounts).map(([type, count]) => (
              <Card key={type}>
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold">
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </h2>
                  <p className="text-3xl mt-2">{count}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </main>
  );
}
