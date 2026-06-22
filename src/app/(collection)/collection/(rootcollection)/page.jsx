"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CollectionCard } from "@/components/public/CollectionCard";
import ArchiveViewManager from "@/components/public/ArchiveViewManager";
import { Search, Sparkles } from "lucide-react";

export default function RootCollectionPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const fetchRootCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/public/collections?parentId=null");
      const data = await res.json();
      setCollections(Array.isArray(data) ? data : data.collections || []);
    } catch (error) {
      console.error("Failed to load root collections", error);
      setCollections([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRootCollections();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-emerald-400 selection:text-slate-950 pt-28 pb-20 transition-colors duration-300">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
          <div className="mb-6 flex items-center gap-2 px-4 py-1.5 bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full backdrop-blur-md animate-luxury-float">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">
              Linguistic & Cultural Repository
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-light tracking-tight leading-none mb-6">
            <span className="bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 dark:from-emerald-400 dark:via-blue-400 dark:to-amber-300 bg-clip-text text-transparent drop-shadow-2xl font-serif italic font-bold">
              Explore the Archive
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-light max-w-xl">
            Browse through our structured categories of manuscripts, audio recordings, field documentations, and traditional literature.
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex justify-center items-center mb-16 w-full px-4"
        >
          <div className="flex w-full max-w-xl items-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden focus-within:border-emerald-400/50 focus-within:shadow-[0_0_12px_rgba(16,185,129,0.15)] transition-all duration-300">
            <div className="pl-4 text-slate-400 dark:text-white/40">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search collections or media..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/35 px-4 py-3.5 outline-none text-base font-light font-sans"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-bold transition-all duration-300 cursor-pointer shadow-lg"
            >
              Go
            </button>
          </div>
        </form>

        {/* 🔄 Loading Skeleton */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="relative w-full aspect-[4/3] bg-slate-200 dark:bg-slate-800" />
                <div className="p-4 pb-3 space-y-2">
                  <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100/50 dark:bg-white/[0.01] border-t border-slate-200 dark:border-white/5">
                  <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-20 bg-slate-100/20 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-3xl">
            <p className="text-slate-400 dark:text-white/40 font-light">No collections available yet.</p>
          </div>
        ) : (
          <ArchiveViewManager items={collections} isLoading={loading} />
        )}
      </div>
    </main>
  );
}
