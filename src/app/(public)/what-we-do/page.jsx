"use client";

import { useEffect, useState } from "react";

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
    <div className="bg-[#faf8f5] p-10 rounded-xl animate-pulse">
      <div className="h-1 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-6" />
      <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-6" />
      <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto mb-4" />
      <ul className="space-y-2 mt-4">
        <li className="h-4 bg-gray-200 rounded w-full" />
        <li className="h-4 bg-gray-200 rounded w-5/6" />
        <li className="h-4 bg-gray-200 rounded w-4/6" />
      </ul>
    </div>
  );

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Hero Skeleton */}
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4" />
            <div className="h-5 bg-gray-200 rounded w-96 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
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
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-500">Page not found</p>
        </div>
      </section>
    );
  }

  const { sections } = page;
  const hero = sections?.hero || {};
  const services = sections?.services || [];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Hero */}
        <h2 className="text-3xl font-bold text-center text-[#1276AB]">
          {hero.heading || "What We Do"}
        </h2>
        {hero.subheading && (
          <p className="text-center text-xl text-[#1276AB] mt-2">
            {hero.subheading}
          </p>
        )}
        {hero.description && (
          <p className="text-center text-lg text-[#666666] mt-4 max-w-3xl mx-auto">
            {hero.description}
          </p>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-[#faf8f5] p-10 rounded-xl text-center border-2 border-transparent hover:translate-y-[-10px] transition-all duration-300 hover:shadow-xl hover:border-[#d4a574] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1276AB] to-[#d4a574]" />
              {service.icon && (
                <div className="text-5xl mb-6 text-[#1276AB]">{service.icon}</div>
              )}
              <h3 className="text-xl font-semibold text-[#1276AB] mb-4">
                {service.title}
              </h3>
              {service.summary && (
                <p className="text-[#444] text-base mb-4">{service.summary}</p>
              )}
              {service.bullets?.length > 0 && (
                <ul className="text-left text-[#666666] space-y-2">
                  {service.bullets.map((bullet, j) => (
                    <li key={j}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
