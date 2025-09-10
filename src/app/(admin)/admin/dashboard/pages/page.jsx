"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const pages = [
  {
    slug: "about",
    title: "About Page",
    description: "Edit the About page content and images.",
    color: "from-blue-50 to-blue-100",
  },
  {
    slug: "what-we-do",
    title: "What We Do",
    description: "Manage the services and bullet points.",
    color: "from-green-50 to-green-100",
  },
  {
    slug: "people",
    title: "People",
    description: "Update team members and their details.",
    color: "from-purple-50 to-purple-100",
  },
];

export default function PagesDashboard() {
  const { me, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!me || !["ADMIN", "SUPERADMIN"].includes(me.role))) {
      router.replace("/admin/dashboard");
    }
  }, [authLoading, me, router]);

  if (authLoading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (!me || !["ADMIN", "SUPERADMIN"].includes(me.role)) {
    return (
      <div className="p-6 text-red-600 font-medium">
        🚫 Access denied. You don’t have permission to view this page.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Page Editors</h1>
        <p className="text-gray-600">
          Manage the static content of your website pages below.
        </p>
      </div>

      <div className="space-y-6">
        {pages.map((p, index) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl shadow-sm bg-gradient-to-br ${p.color} p-5 flex flex-col md:flex-row md:items-center justify-between`}
          >
            <div>
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <p className="text-gray-700 mt-1">{p.description}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                className="flex items-center gap-2 px-4 py-2"
                onClick={() => router.push(`/admin/dashboard/pages/${p.slug}/edit`)}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
