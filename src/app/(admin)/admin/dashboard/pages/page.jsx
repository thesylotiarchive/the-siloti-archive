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
    badge: "About",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
  },
  {
    slug: "what-we-do",
    title: "What We Do",
    description: "Manage the services and bullet points.",
    badge: "Services",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  },
  {
    slug: "people",
    title: "People",
    description: "Update team members and their details.",
    badge: "Team",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
  },
  {
    slug: "reports",
    title: "Reports",
    description: "Manage published reports, sections, and files.",
    badge: "Reports",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80",
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
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-8 h-8 border-4 border-emerald-500/80 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!me || !["ADMIN", "SUPERADMIN"].includes(me.role)) {
    return (
      <div className="text-center py-16 bg-white/50 border border-slate-200/40 rounded-[2rem] shadow-sm max-w-xl mx-auto mt-10">
        <p className="text-red-500 font-medium">🚫 Access denied. You don’t have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-slate-200/50 pb-5">
        <div>
          <h1 className="text-3xl font-light tracking-tight">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
              Page Content Editors
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">Select any static web page below to update its sections and details.</p>
        </div>
      </div>

      <div className="space-y-4">
        {pages.map((p, index) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="relative flex flex-col md:flex-row md:items-center justify-between border border-slate-200/60 rounded-[2rem] p-6 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">{p.title}</h2>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${p.badgeColor}`}>
                  {p.badge}
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
            </div>
            
            <div className="shrink-0">
              <Button
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200 cursor-pointer shadow-sm"
                onClick={() => router.push(`/admin/dashboard/pages/${p.slug}/edit`)}
              >
                <Pencil className="w-3.5 h-3.5 text-emerald-600" />
                Edit Content
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
