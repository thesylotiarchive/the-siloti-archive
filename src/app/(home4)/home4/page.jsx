'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { CollectionCard } from "@/components/public/CollectionCard";

export default function Home4Page() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/public/collections?parentId=null");
        const data = await res.json();
        setCollections(data?.slice(0, 12) || []);
      } catch (err) {
        console.error("Failed to fetch collections", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div>
      {/* Hero Image */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <img
          src="/hero-image01.jpg"
          alt="Syloti Archive Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
          {/* <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            The Syloti Archive
          </h1> */}
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#a6e355] via-[#3d9fdc] to-[#edb991] drop-shadow-lg backdrop-brightness-125">
            The Syloti Archive
          </h1>
          <p className="mt-4 max-w-2xl text-white/90 text-lg drop-shadow">
            Preserving the stories, songs, and scripts of Sylhet’s rich heritage.
          </p>
          <div className="mt-6">
            <Link
              href="/collection"
              className="inline-block bg-[#74C043] text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-[#0A65A8] transition"
            >
              Explore the Archive
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Featured Collections
        </h2>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow animate-pulse"
              >
                {/* Image Placeholder */}
                <div className="relative w-full aspect-[4/3] bg-gray-300" />
          
                {/* Text Placeholder */}
                <div className="p-4 pb-3 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-400 rounded" />
                </div>
          
                {/* Bottom Strip Placeholder */}
                <div className="h-8 w-full bg-gray-800" />
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <p className="text-center text-muted-foreground">No featured collections yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
