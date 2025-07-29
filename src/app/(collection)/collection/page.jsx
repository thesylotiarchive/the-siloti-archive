'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CollectionCard } from "@/components/public/CollectionCard";

export default function RootCollectionPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-10 sm:py-14 md:py-16">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#74C043] via-[#0A65A8] to-[#D6A57C] mb-8 text-center sm:text-left">
        Explore the Archive
      </h1>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow animate-pulse"
            >
              {/* Thumbnail Placeholder */}
              <div className="relative w-full aspect-[4/3] bg-gray-300" />
        
              {/* Text Section */}
              <div className="p-4 pb-3 space-y-2">
                <div className="h-4 w-3/4 bg-gray-400 rounded" />
              </div>
        
              {/* Bottom Strip */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-t border-gray-700">
                <div className="w-4 h-4 bg-gray-600 rounded-full" /> {/* Simulated icon */}
                <div className="h-3 w-12 bg-gray-600 rounded" />      {/* Simulated item count text */}
              </div>
            </div>
          ))}
        </div>
      
      ) : collections.length === 0 ? (
        <p className="text-muted-foreground">No collections available yet.</p>
      ) : (
        // <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        //   {collections.map((collection) => (
        //     <CollectionCard key={collection.id} collection={collection} />
        //   ))}
        // </div>
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.isArray(collections) && collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </main>
  );
}