// app/(public)/about/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function AboutPage() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetch("/api/public/pages/about")
      .then(async res => {
        const text = await res.text(); // see raw response
        console.log("Raw response:", text);
        try {
          return JSON.parse(text);
        } catch (err) {
          console.error("JSON parse error:", err);
          return null;
        }
      })
      .then(data => setPage(data));
  }, []);

  if (!page) return <div className="text-center py-20">Loading...</div>;

  const { hero, mission, why } = page.sections;

  return (
    <main className="min-h-screen bg-white text-white">
      {/* Hero Section */}
      <section className="w-full min-h-screen bg-gradient-to-b from-[#1276AB] via-[#1276AB] to-[#7DB9E8] text-white flex items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
            {hero.heading}
          </h1>
          <p className="text-[1.5rem] mb-8 text-[#d4a574] font-bold">{hero.subheading}</p>
          <p className="text-base md:text-lg text-white/80 leading-relaxed mb-10">{hero.description}</p>
          <a
            href="#about"
            className="inline-block bg-[#D4A574] text-[#1F1F1F] px-6 py-3 text-lg font-bold rounded-full transition-all duration-300 shadow hover:-translate-y-0.5"
          >
            {hero.buttonText}
          </a>
        </div>
      </section>

      {/* Mission Section */}
      <section id="about" className="scroll-mt-20 min-h-screen bg-[#FAF8F5] text-gray-800 py-20 px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1276AB] text-center mb-6">{mission.heading}</h2>
          <p className="text-center italic text-gray-500 mb-10 text-sm sm:text-base">{mission.tagline}</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Text */}
            <div className="space-y-6 text-base text-gray-700">
              {mission.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {mission.stats.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-xl text-center shadow">
                  <div className="text-3xl sm:text-4xl font-bold text-[#1276AB]">{s.number}</div>
                  <div className="text-xs sm:text-sm text-gray-500 uppercase mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Why We're Here */}
          <div className="bg-white p-6 sm:p-10 rounded-xl mt-12 border-l-4 border-[#D4A574] space-y-6 text-base text-gray-700">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1276AB] mb-4">{why.heading}</h3>
            {why.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>
    </main>
  );
}
