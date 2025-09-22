'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { CollectionCard } from "@/components/public/CollectionCard";
import { Heart, PlayCircle } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function Home2Page() {
  const router = useRouter();

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

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-amber-400 max-w-[90vw] sm:max-w-3xl leading-tight mb-2">
            The Sylheti Archive
          </h1>

          <p className="mt-4 text-sm sm:text-lg md:text-2xl text-white/90 drop-shadow-lg max-w-[90vw] sm:max-w-xl px-2 sm:px-0 font-light">
            A Digital Collection of Siloti Arts, Culture, Heritage & Initiatives
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center">
            {/* Explore Archive Button */}
            <button
              onClick={() => router.push('/collection')}
              className="group relative inline-flex items-center justify-center gap-3 font-semibold px-8 py-4 text-lg rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-2xl hover:shadow-emerald-500/25 hover:shadow-2xl border border-white/10 backdrop-blur-sm"
            
            >
              <PlayCircle className="w-5 h-5 transition-transform group-hover:rotate-12" />
              <span className="relative">
                Explore the Archive
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
            </button>

            {/* Donate Button */}
            <button 
              onClick={() => router.push('/donate')}
              className="group relative inline-flex items-center justify-center gap-3 font-semibold px-8 py-4 text-lg rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 bg-white/10 text-white shadow-2xl hover:shadow-amber-500/25 hover:shadow-2xl border-2 border-white/20 backdrop-blur-md hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:border-amber-400/50"
            
            >
              <Heart className="w-5 h-5 transition-all group-hover:text-red-400 group-hover:scale-110" />
              <span className="relative">
                Support Our Mission
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
            </button>
          </div>

          {/* Additional Visual Enhancement */}
          <div className="mt-12 flex items-center gap-4 text-white/60">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/30"></div>
            <span className="text-sm font-light">Preserving Cultural Heritage</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/30"></div>
          </div>
        </div>

        {/* Floating Elements for Visual Interest */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-amber-400 rounded-full animate-pulse opacity-50 animation-delay-2000"></div>
      </section>

      {/* Featured Collections */}
      <section className="relative py-16 px-6 w-fu overflow-hidden">
        {/* Background Image */}
        <img
          src="/hero-image01.jpg"
          alt="Sylheti Archive Hero"
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
