"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
// import ImageUploaderWithToggle from "@/components/ImageUploaderWithToggle";
import { nanoid } from "nanoid";
import ImageUploaderWithToggle from "@/components/ImageUploaderWithToggle";

export default function ReportsPageEditor({ page }) {
  const [form, setForm] = useState(page);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  /* -----------------------------
     Section Handlers
  ----------------------------- */
  const addSection = () => {
    setForm({
      ...form,
      sections: {
        ...form.sections,
        sections: [
          ...form.sections.sections,
          {
            title: "",
            description: "",
            reports: [],
          },
        ],
      },
    });
  };

  const updateSectionField = (index, key, value) => {
    const updated = [...form.sections.sections];
    updated[index][key] = value;
    setForm({
      ...form,
      sections: { ...form.sections, sections: updated },
    });
  };

  const removeSection = (index) => {
    const updated = [...form.sections.sections];
    updated.splice(index, 1);
    setForm({
      ...form,
      sections: { ...form.sections, sections: updated },
    });
  };

  /* -----------------------------
     Report Handlers
  ----------------------------- */
  const addReport = (sectionIndex) => {
    const updated = [...form.sections.sections];
    updated[sectionIndex].reports.push({
      id: nanoid(),
      title: "",
      year: "",
      fileUrl: "",
      thumbnail: "",
      externalUrl: "",
    });
    setForm({
      ...form,
      sections: { ...form.sections, sections: updated },
    });
  };

  const removeReport = (sectionIndex, reportIndex) => {
    const updated = [...form.sections.sections];
    updated[sectionIndex].reports.splice(reportIndex, 1);
    setForm({
      ...form,
      sections: { ...form.sections, sections: updated },
    });
  };

  const updateReportField = (sIndex, rIndex, key, value) => {
    const updated = [...form.sections.sections];
    updated[sIndex].reports[rIndex][key] = value;
    setForm({
      ...form,
      sections: { ...form.sections, sections: updated },
    });
  };

  /* -----------------------------
     Save
  ----------------------------- */
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${page.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          sections: form.sections,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      alert("✅ Reports page saved");
    } catch (e) {
      console.error(e);
      alert("❌ Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-slate-200/50 pb-5">
        <div>
          <h1 className="text-3xl font-light tracking-tight">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
              Edit Reports Page
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">Configure published research sheets, annual archives, and report files.</p>
        </div>
      </div>

      {/* Page Settings */}
      <section className="p-6 border border-slate-200/60 rounded-[2rem] bg-white/70 backdrop-blur-md space-y-5 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic pb-2 border-b border-slate-100">
          Page Settings
        </h2>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Page Title</label>
          <input
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Intro</label>
          <textarea
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 resize-none outline-none min-h-[70px]"
            value={form.sections.intro}
            onChange={(e) =>
              setForm({
                ...form,
                sections: { ...form.sections, intro: e.target.value },
              })
            }
            rows={2}
          />
        </div>
      </section>

      {/* Sections */}
      <section className="space-y-6">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider pl-1">Report Sections</h2>

        {form.sections.sections.map((section, sIndex) => (
          <div key={sIndex} className="p-6 border border-slate-200/60 rounded-[2rem] bg-white/70 backdrop-blur-md space-y-6 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 font-serif italic">Section {sIndex + 1}</h3>
              <Button
                variant="destructive"
                onClick={() => removeSection(sIndex)}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/50 cursor-pointer transition-all duration-200"
              >
                Remove
              </Button>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Section Title</label>
              <input
                className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
                placeholder="Section title"
                value={section.title}
                onChange={(e) =>
                  updateSectionField(sIndex, "title", e.target.value)
                }
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Section Description</label>
              <textarea
                className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 resize-none outline-none min-h-[70px]"
                placeholder="Section description"
                value={section.description}
                onChange={(e) =>
                  updateSectionField(sIndex, "description", e.target.value)
                }
              />
            </div>

            {/* Reports */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider pl-1">Reports</h4>
              {section.reports.map((report, rIndex) => (
                <div
                  key={report.id}
                  className="p-5 border border-slate-200/40 rounded-2xl bg-white/40 shadow-inner space-y-4"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100/60">
                    <strong className="text-sm font-bold text-slate-800">{report.title || "New Report"}</strong>
                    <Button
                      variant="destructive"
                      onClick={() => removeReport(sIndex, rIndex)}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/50 cursor-pointer transition-all duration-200"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Report Title</label>
                    <input
                      className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
                      placeholder="Report title"
                      value={report.title}
                      onChange={(e) =>
                        updateReportField(sIndex, rIndex, "title", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Year</label>
                    <input
                      className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
                      placeholder="Year"
                      value={report.year}
                      onChange={(e) =>
                        updateReportField(sIndex, rIndex, "year", e.target.value)
                      }
                    />
                  </div>

                  {/* PDF / File Upload */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Document File</label>
                    <div className="p-1 border border-slate-200/60 rounded-xl bg-white/40">
                      <ImageUploaderWithToggle
                        name={`report-file-${report.id}`}
                        value={report.fileUrl}
                        onChange={(url) =>
                          updateReportField(sIndex, rIndex, "fileUrl", url)
                        }
                        setIsUploading={setIsUploading}
                        endpoint="mediaFileUploader"
                        placeholder="Upload PDF or document"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">External URL (optional)</label>
                    <input
                      className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
                      placeholder="External URL (optional)"
                      value={report.externalUrl}
                      onChange={(e) =>
                        updateReportField(
                          sIndex,
                          rIndex,
                          "externalUrl",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}

              <Button 
                variant="secondary" 
                onClick={() => addReport(sIndex)}
                className="text-xs font-semibold px-4.5 py-2 h-auto rounded-xl cursor-pointer border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm"
              >
                + Add Report
              </Button>
            </div>
          </div>
        ))}

        <Button 
          variant="outline" 
          onClick={addSection}
          className="text-xs font-semibold px-5 py-2 h-auto rounded-xl cursor-pointer border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm"
        >
          + Add Section
        </Button>
      </section>

      <div className="pt-4 border-t border-slate-200/40">
        <Button 
          onClick={handleSave} 
          disabled={saving || isUploading}
          className="px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
