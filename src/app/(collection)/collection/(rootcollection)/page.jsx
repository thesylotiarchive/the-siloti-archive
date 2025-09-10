"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CollectionCard } from "@/components/public/CollectionCard";

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
    <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-10 sm:py-14 md:py-16">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#74C043] via-[#0A65A8] to-[#D6A57C] mb-8 text-center">
        Explore the Archive
      </h1>

      {/* 🔍 Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex gap-2 justify-center items-center mb-8 w-full"
      >
        <div className="flex w-full max-w-xl items-center border rounded-xl overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Search collections or media..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 outline-none text-base"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-primary text-white font-medium hover:bg-primary/90 transition"
          >
            Go
          </button>
        </div>
      </form>


      {/* 🔄 Loading Skeleton */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow animate-pulse"
            >
              <div className="relative w-full aspect-[4/3] bg-gray-300" />
              <div className="p-4 pb-3 space-y-2">
                <div className="h-4 w-3/4 bg-gray-400 rounded" />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-t border-gray-700">
                <div className="w-4 h-4 bg-gray-600 rounded-full" />
                <div className="h-3 w-12 bg-gray-600 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : collections.length === 0 ? (
        <p className="text-muted-foreground">No collections available yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.isArray(collections) &&
            collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
        </div>
      )}
    </main>
  );
}
