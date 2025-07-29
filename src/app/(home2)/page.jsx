'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { CollectionCard } from "@/components/public/CollectionCard";

export default function Home2Page() {
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
      {/* Hero Video */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#74C043] via-[#0A65A8] to-[#D6A57C] max-w-[90vw] sm:max-w-3xl leading-tight">
            The Siloti Archive
          </h1>

          <p className="mt-4 text-sm sm:text-lg md:text-2xl text-white/90 drop-shadow max-w-[90vw] sm:max-w-xl px-2 sm:px-0">
            A Digital Collection of Siloti Arts, Culture, Heritage & Initiatives
          </p>

          <div className="mt-6">
            <Link
              href="/collection"
              className="inline-block font-medium px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg shadow transition text-white bg-gradient-to-r from-[#74C043] via-[#0A65A8] to-[#D6A57C] hover:brightness-110 hover:scale-105"
            >
              Explore the Archive
            </Link>
          </div>
        </div>

      </section>

      {/* Featured Collections */}
      <section className="relative py-16 px-6 w-fu overflow-hidden">
        {/* Background Image */}
        <img
          src="/hero-image01.jpg"
          alt="Syloti Archive Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Optional Overlay */}
        <div className="absolute inset-0" />

        <div className="relative max-w-7xl mx-auto">
          <h2 className="text-2xl text-white font-semibold text-center mb-8">
            Featured Collections
          </h2>

          {loading ? (
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-t border-gray-700">
                    <div className="w-4 h-4 bg-gray-600 rounded-full" /> {/* Simulated icon */}
                    <div className="h-3 w-12 bg-gray-600 rounded" />      {/* Simulated item count text */}
                  </div>
                </div>
              ))}
            </div>
          ) : collections.length === 0 ? (
            <p className="text-center text-muted-foreground">No featured collections yet.</p>
          ) : (
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
