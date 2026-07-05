"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function PeoplePage() {
  const { data, error } = useSWR("/api/public/pages/people", fetcher);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center transition-colors duration-300">
        <p className="text-red-400 font-semibold uppercase tracking-wider font-sans">Failed to load contributors</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4 transition-colors duration-300">
        <div className="w-10 h-10 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
        <span className="text-xs text-muted-foreground font-light tracking-widest uppercase font-sans">Loading Contributors...</span>
      </div>
    );
  }

  const { title, intro, sections } = data.sections;

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-emerald-400 selection:text-slate-950 pt-28 pb-20 transition-colors duration-300">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <div className="mb-6 flex items-center gap-2 px-4 py-1.5 bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full backdrop-blur-md animate-luxury-float">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-650 dark:text-emerald-300 font-sans">
              Meet the Curators & Scholars
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-light tracking-tight leading-none mb-6"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl font-serif italic font-bold">
              {title}
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm sm:text-base text-muted-foreground font-light max-w-xl leading-relaxed font-sans"
          >
            {intro}
          </motion.p>
        </div>

        {/* Sections */}
        {sections.map((section, sIndex) => (
          <section key={sIndex} className="space-y-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl font-bold font-serif italic text-emerald-600 dark:text-emerald-300 border-b border-slate-200 dark:border-white/5 pb-4 tracking-wide"
            >
              {section.title}
            </motion.h2>

            {/* People Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.people.map((person, i) => (
                <motion.div
                  key={person.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-xl hover:border-emerald-500 dark:hover:border-emerald-400/30 transition-all duration-300 hover:shadow-emerald-400/5 group flex flex-col items-center text-center backdrop-blur-md"
                >
                  {/* Avatar */}
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={person.image || "/avatars/avatar.png"}
                    alt={person.name}
                    className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-emerald-500/20 dark:border-emerald-400/20 mb-4"
                  />

                  {/* Info */}
                  <div className="flex flex-col flex-1 w-full items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-805 dark:text-white/95 font-sans leading-tight">
                        {person.name}
                      </h3>
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-300/90 mb-3 uppercase tracking-wider mt-1 font-sans">
                        {person.role}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-white/55 leading-relaxed mb-6 font-light font-sans">
                        {person.description.length > 100
                          ? person.description.slice(0, 100) + "..."
                          : person.description}
                      </p>
                    </div>

                    <Link
                      href={`/people/${person.id}`}
                      className="cursor-pointer inline-flex items-center justify-center px-5 py-2 text-xs font-bold rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-300 mt-auto font-sans"
                    >
                      View Profile
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
