"use client";

import { useEffect, useState, useRef } from "react";
import { Download, FileText, ChevronDown } from "lucide-react";

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
    return <div className="text-center py-20 text-gray-500">Loading reports...</div>;
  }

  if (!page || !page.sections) {
    return (
      <div className="text-center py-20 text-red-600 font-medium">
        Reports page content not found.
      </div>
    );
  }

  const { title, intro, sections } = page.sections;

  const scrollToReports = () => {
    reportSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="w-full min-h-screen bg-gradient-to-b from-[#1276AB] via-[#1276AB] to-[#7DB9E8] text-white flex flex-col items-center justify-center px-4 space-y-6 text-center">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
            {title || page.title}
          </h1>
          {intro && (
            <p className="text-xl md:text-2xl text-white/85 max-w-3xl mx-auto">
              {intro}
            </p>
          )}
          <button
            onClick={scrollToReports}
            className="mt-6 inline-flex items-center gap-2 bg-[#D4A574] text-[#1F1F1F] px-6 py-3 text-lg font-bold rounded-full shadow hover:-translate-y-0.5 transition-transform"
          >
            View Reports
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Report Sections */}
      <section
        ref={reportSectionRef}
        className="bg-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto space-y-16">
          {sections.map((section, sIndex) => (
            <div key={sIndex} className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1276AB]">
                  {section.title}
                </h2>
                {section.description && (
                  <p className="text-gray-600 mt-3 max-w-3xl mx-auto">
                    {section.description}
                  </p>
                )}
              </div>

              {/* Reports list */}
              <div className="divide-y bg-white rounded-xl shadow-sm border">
                {section.reports.map((report) => {
                  const downloadUrl = report.fileUrl || report.externalUrl;

                  return (
                    <div
                      key={report.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5"
                    >
                      <div className="flex items-start gap-4">
                        <FileText className="w-6 h-6 text-[#1276AB] mt-1" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {report.title}
                          </h3>
                          {report.year && (
                            <p className="text-sm text-gray-500 mt-1">{report.year}</p>
                          )}
                        </div>
                      </div>

                      {downloadUrl ? (
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#1276AB] text-white px-5 py-2.5 rounded-full font-semibold transition-all hover:bg-[#0f5f8a] hover:-translate-y-0.5 shadow"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">
                          File not available
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
