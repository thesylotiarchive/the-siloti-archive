// File: src/app/(admin)/admin/dashboard/page.jsx
"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen p-8 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-3xl mt-2">123</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Categories</h2>
            <p className="text-3xl mt-2">6</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Media Items</h2>
            <p className="text-3xl mt-2">94</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
