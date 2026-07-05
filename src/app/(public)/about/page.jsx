// app/(public)/about/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

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

  if (!page) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4 transition-colors duration-300">
        <div className="w-10 h-10 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
        <span className="text-xs text-muted-foreground font-light tracking-widest uppercase">Loading About Us...</span>
      </div>
    );
  }

  const { hero, mission, why } = page.sections;

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-emerald-400 selection:text-slate-950 pt-18 pb-20 transition-colors duration-300">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Hero Section */}
      <section className="w-full min-h-[75vh] flex items-center justify-center px-6 relative z-10">
        <div className="max-w-4xl text-center flex flex-col items-center">
          <div className="mb-6 flex items-center gap-2 px-4 py-1.5 bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full backdrop-blur-md animate-luxury-float">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">
              Preserving Cultural Heritage
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl font-serif italic font-bold block">
              {hero.heading}
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-amber-300 font-light tracking-wide">{hero.subheading}</p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10 font-light max-w-3xl">{hero.description}</p>
          <a
            href="#about"
            className="cursor-pointer group relative inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 text-base rounded-full transition-all duration-300 ease-in-out transform hover:scale-[1.03] active:scale-95 bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-emerald-500 shadow-xl shadow-emerald-400/10"
          >
            <span>{hero.buttonText}</span>
          </a>
        </div>
      </section>

      {/* Mission Section */}
      <section id="about" className="scroll-mt-28 py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-serif italic font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
              {mission.heading}
            </h2>
            <p className="text-slate-500 dark:text-white/40 text-sm tracking-wider uppercase font-semibold">{mission.tagline}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Text Paragraphs */}
            <div className="lg:col-span-7 bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 sm:p-10 backdrop-blur-md flex flex-col justify-center gap-6 transition-colors duration-300">
              {mission.paragraphs.map((p, i) => (
                <p key={i} className="text-sm sm:text-base text-slate-700 dark:text-white/70 leading-relaxed font-light">
                  {p}
                </p>
              ))}
            </div>

            {/* Stats */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-6">
              {mission.stats.map((s, i) => (
                <div key={i} className="bg-slate-150/50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg hover:border-emerald-400/30 transition-all duration-300 group">
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-500 dark:text-emerald-400 tracking-tight group-hover:scale-105 transition-transform duration-300">
                    {s.number}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-white/50 uppercase tracking-widest mt-3 font-semibold leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why We're Here */}
          <div className="bg-slate-100/30 dark:bg-white/[0.01] border-l-4 border-emerald-500 border-t border-r border-b border-slate-200 dark:border-white/10 p-8 sm:p-10 rounded-3xl backdrop-blur-md space-y-6 transition-colors duration-300">
            <h3 className="text-xl sm:text-2xl font-serif italic font-bold text-emerald-600 dark:text-emerald-300">
              {why.heading}
            </h3>
            {why.paragraphs.map((p, i) => (
              <p key={i} className="text-sm sm:text-base text-slate-700 dark:text-white/70 leading-relaxed font-light">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
