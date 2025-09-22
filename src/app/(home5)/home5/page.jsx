'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Archive } from "lucide-react";
import { CollectionCard } from "@/components/public/CollectionCard";

export default function HomePage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/public/collections?parentId=null");
        const data = await res.json();
        setCollections(data?.slice(0, 4) || []); // Only show top 4
      } catch (err) {
        console.error("Failed to fetch collections", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="text-center py-24 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#74C043] via-[#0A65A8] to-[#D6A57C]">
          The Sylheti Archive
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
          Preserving the stories, songs, and scripts of Sylhet’s rich heritage.
        </p>
        <div className="mt-8">
          <Link
            href="/collection"
            className="inline-block bg-[#74C043] text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-[#0A65A8] transition"
          >
            🌿 Explore the Archive
          </Link>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 px-6">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Featured Collections
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow animate-pulse"
              >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-[4/3] bg-gray-300" />
        
                  {/* Text Section */}
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-400 rounded" />
                    <div className="h-6 w-20 bg-[#74C043]/60 rounded-full" />
                  </div>
                </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No featured collections yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
