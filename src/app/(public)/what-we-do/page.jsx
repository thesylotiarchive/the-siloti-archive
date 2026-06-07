"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function WhatWeDoPage() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch("/api/public/pages/what-we-do");
        if (!res.ok) throw new Error("Failed to load page");
        const data = await res.json();
        setPage(data);
      } catch (err) {
        console.error("Error fetching What We Do page:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, []);

  const SkeletonCard = () => (
    <div className="bg-white/[0.02] border border-white/5 p-10 rounded-3xl animate-pulse">
      <div className="h-1 w-full bg-gradient-to-r from-slate-800 to-slate-700 rounded mb-6" />
      <div className="w-12 h-12 bg-slate-800 rounded-full mx-auto mb-6" />
      <div className="h-5 bg-slate-800 rounded w-3/4 mx-auto mb-4" />
      <ul className="space-y-2 mt-4">
        <li className="h-4 bg-slate-800 rounded w-full" />
        <li className="h-4 bg-slate-800 rounded w-5/6" />
        <li className="h-4 bg-slate-800 rounded w-4/6" />
      </ul>
    </div>
  );

  if (loading) {
    return (
      <section className="py-28 bg-slate-950 text-white min-h-screen relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          {/* Hero Skeleton */}
          <div className="animate-pulse text-center">
            <div className="h-8 bg-slate-800 rounded w-64 mx-auto mb-4" />
            <div className="h-5 bg-slate-800 rounded w-96 mx-auto mb-2" />
            <div className="h-4 bg-slate-800 rounded w-2/3 mx-auto" />
          </div>

          {/* Services Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!page) {
    return (
      <section className="py-28 bg-slate-950 text-white min-h-screen relative overflow-hidden flex items-center justify-center">
        <p className="text-red-400 font-semibold uppercase tracking-wider">Page not found</p>
      </section>
    );
  }

  const { sections } = page;
  const hero = sections?.hero || {};
  const services = sections?.services || [];

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden selection:bg-emerald-400 selection:text-slate-950 pt-28 pb-20">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <div className="mb-6 flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md animate-luxury-float">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
              Our Initiatives & Operations
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-light tracking-tight leading-none mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl font-serif italic font-bold">
              {hero.heading || "What We Do"}
            </span>
          </h2>
          
          {hero.subheading && (
            <p className="text-lg md:text-xl text-amber-300/90 font-light mt-2 tracking-wide font-sans">
              {hero.subheading}
            </p>
          )}
          
          {hero.description && (
            <p className="text-base sm:text-lg text-white/60 leading-relaxed font-light mt-6 max-w-3xl font-sans">
              {hero.description}
            </p>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white/[0.02] border border-white/10 p-8 sm:p-10 rounded-[2rem] text-center hover:translate-y-[-8px] transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-400/5 hover:border-emerald-400/40 relative overflow-hidden group flex flex-col items-center"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-70 group-hover:opacity-100 transition-opacity" />
              
              {service.icon && (
                <div className="text-4xl mb-6 text-emerald-400 transition-transform duration-300 group-hover:scale-110">
                  {service.icon}
                </div>
              )}
              
              <h3 className="text-xl font-bold text-white/95 mb-4 font-serif italic tracking-wide">
                {service.title}
              </h3>
              
              {service.summary && (
                <p className="text-white/60 text-sm leading-relaxed mb-6 font-light font-sans">
                  {service.summary}
                </p>
              )}
              
              {service.bullets?.length > 0 && (
                <ul className="text-left text-white/50 text-xs space-y-2.5 mt-auto w-full border-t border-white/5 pt-6 font-sans">
                  {service.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-400 font-serif italic font-bold">0{j+1}.</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
