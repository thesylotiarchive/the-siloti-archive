"use client";

import { useEffect, useState, useRef } from "react";
import { Download, FileText, ChevronDown, Sparkles } from "lucide-react";

export default function ReportsPage() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportSectionRef = useRef(null);

  useEffect(() => {
    fetch("/api/public/pages/reports")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched reports page:", data);
        setPage(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Reports page error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
        <span className="text-xs text-white/55 font-light tracking-widest uppercase font-sans">Loading Reports...</span>
      </div>
    );
  }

  if (!page || !page.sections) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans">
        <p className="text-red-400 font-semibold uppercase tracking-wider">Reports content not found</p>
      </div>
    );
  }

  const { title, intro, sections } = page.sections;

  const scrollToReports = () => {
    reportSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden selection:bg-emerald-400 selection:text-slate-950">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Hero */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center px-6 relative z-10 text-center">
        <div className="max-w-4xl flex flex-col items-center">
          <div className="mb-6 flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md animate-luxury-float">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 font-sans">
              Publications & Reports
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-none mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl font-serif italic font-bold block">
              {title || page.title}
            </span>
          </h1>
          {intro && (
            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto font-light font-sans">
              {intro}
            </p>
          )}
          <button
            onClick={scrollToReports}
            className="cursor-pointer group relative inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 text-base rounded-full transition-all duration-300 ease-in-out transform hover:scale-[1.03] active:scale-95 bg-white text-slate-950 hover:bg-emerald-400 shadow-xl shadow-emerald-400/10 font-sans"
          >
            <span>View Reports</span>
            <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </section>

      {/* Report Sections */}
      <section
        ref={reportSectionRef}
        className="relative z-10 py-24 px-6 max-w-5xl mx-auto space-y-20"
      >
        {sections.map((section, sIndex) => (
          <div key={sIndex} className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-serif italic font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                {section.title}
              </h2>
              {section.description && (
                <p className="text-sm text-white/50 mt-3 max-w-2xl mx-auto leading-relaxed font-sans font-light">
                  {section.description}
                </p>
              )}
            </div>

            {/* Reports list */}
            <div className="divide-y divide-white/5 bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md">
              {section.reports.map((report) => {
                const downloadUrl = report.fileUrl || report.externalUrl;

                return (
                  <div
                    key={report.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-8 py-6 hover:bg-white/[0.01] transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white/95 font-sans leading-tight">
                          {report.title}
                        </h3>
                        {report.year && (
                          <p className="text-xs text-white/40 mt-1 font-sans">{report.year}</p>
                        )}
                      </div>
                    </div>

                    {downloadUrl ? (
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all hover:from-emerald-400 hover:to-blue-500 shadow-lg hover:scale-105 active:scale-95 cursor-pointer font-sans"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                      </a>
                    ) : (
                      <span className="text-xs text-white/30 font-sans italic">
                        File not available
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
