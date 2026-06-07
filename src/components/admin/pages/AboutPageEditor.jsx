"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AboutPageEditor({ page }) {
  const [form, setForm] = useState(page);
  const [saving, setSaving] = useState(false);

  const updateField = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: {
          ...prev.sections[section],
          [field]: value,
        },
      },
    }));
  };

  const updateArrayItem = (section, field, index, value) => {
    const newArray = [...form.sections[section][field]];
    newArray[index] = value;
    updateField(section, field, newArray);
  };

  const addArrayItem = (section, field, emptyValue) => {
    updateField(section, field, [
      ...form.sections[section][field],
      emptyValue,
    ]);
  };

  const removeArrayItem = (section, field, index) => {
    const newArray = form.sections[section][field].filter((_, i) => i !== index);
    updateField(section, field, newArray);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/admin/pages/${form.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title, sections: form.sections }),
    });
    setSaving(false);
    alert("Saved!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-slate-200/50 pb-5">
        <div>
          <h1 className="text-3xl font-light tracking-tight">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
              Edit About Page
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">Configure the main hero details, mission text block paragraphs, and statistic meters.</p>
        </div>
      </div>
  
      {/* Hero Section */}
      <section className="p-6 border border-slate-200/60 rounded-[2rem] bg-white/70 backdrop-blur-md space-y-5 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic pb-2 border-b border-slate-100">
          Hero Section
        </h2>
  
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Heading</label>
          <input
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
            value={form.sections.hero.heading}
            onChange={(e) => updateField("hero", "heading", e.target.value)}
          />
        </div>
  
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subheading</label>
          <input
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
            value={form.sections.hero.subheading}
            onChange={(e) => updateField("hero", "subheading", e.target.value)}
          />
        </div>
  
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
          <textarea
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 resize-none outline-none min-h-[90px]"
            value={form.sections.hero.description}
            onChange={(e) => updateField("hero", "description", e.target.value)}
          />
        </div>
  
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Button Text</label>
          <input
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
            value={form.sections.hero.buttonText}
            onChange={(e) => updateField("hero", "buttonText", e.target.value)}
          />
        </div>
      </section>
  
      {/* Mission Section */}
      <section className="p-6 border border-slate-200/60 rounded-[2rem] bg-white/70 backdrop-blur-md space-y-5 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic pb-2 border-b border-slate-100">
          Mission Section
        </h2>
  
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Heading</label>
          <input
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
            value={form.sections.mission.heading}
            onChange={(e) => updateField("mission", "heading", e.target.value)}
          />
        </div>
  
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Tagline</label>
          <input
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
            value={form.sections.mission.tagline}
            onChange={(e) => updateField("mission", "tagline", e.target.value)}
          />
        </div>
  
        {/* Paragraphs */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Paragraphs</h3>
          {form.sections.mission.paragraphs.map((p, i) => (
            <div key={i} className="flex items-start gap-3">
              <textarea
                className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 resize-none outline-none min-h-[90px]"
                value={p}
                onChange={(e) =>
                  updateArrayItem("mission", "paragraphs", i, e.target.value)
                }
              />
              <button
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 border border-red-200/50 shrink-0 cursor-pointer"
                onClick={() => removeArrayItem("mission", "paragraphs", i)}
              >
                ✕
              </button>
            </div>
          ))}
          <Button
            className="text-xs font-semibold px-3 py-1.5 h-auto rounded-xl cursor-pointer border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-200 bg-white shadow-sm"
            onClick={() => addArrayItem("mission", "paragraphs", "")}
            variant="default"
          >
               + Add Paragraph
          </Button>
        </div>
  
        {/* Stats */}
        <div className="space-y-3 pt-2 border-t border-slate-100/80">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Stats</h3>
          {form.sections.mission.stats.map((stat, i) => (
            <div key={i} className="flex gap-3 items-end p-4 border border-slate-200/40 rounded-2xl bg-white/40">
              <div className="flex-1 space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Number</label>
                <input
                  className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
                  placeholder="Number"
                  value={stat.number}
                  onChange={(e) => {
                    const updated = { ...stat, number: e.target.value };
                    updateArrayItem("mission", "stats", i, updated);
                  }}
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Label</label>
                <input
                  className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => {
                    const updated = { ...stat, label: e.target.value };
                    updateArrayItem("mission", "stats", i, updated);
                  }}
                />
              </div>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 border border-red-200/50 shrink-0 cursor-pointer mb-1"
                onClick={() => removeArrayItem("mission", "stats", i)}
              >
                ✕
              </button>
            </div>
          ))}
          <Button
            className="text-xs font-semibold px-3 py-1.5 h-auto rounded-xl cursor-pointer border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-200 bg-white shadow-sm"
            onClick={() =>
                addArrayItem("mission", "stats", { number: "", label: "" })
              }
            variant="default"
          >
                + Add Stat
          </Button>
        </div>
      </section>
  
      {/* Why Section */}
      <section className="p-6 border border-slate-200/60 rounded-[2rem] bg-white/70 backdrop-blur-md space-y-5 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic pb-2 border-b border-slate-100">
          Why Section
        </h2>
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Paragraphs</h3>
          {form.sections.why.paragraphs.map((p, i) => (
            <div key={i} className="flex items-start gap-3">
              <textarea
                className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 resize-none outline-none min-h-[90px]"
                value={p}
                onChange={(e) =>
                  updateArrayItem("why", "paragraphs", i, e.target.value)
                }
              />
              <button
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 border border-red-200/50 shrink-0 cursor-pointer"
                onClick={() => removeArrayItem("why", "paragraphs", i)}
              >
                ✕
              </button>
            </div>
          ))}
          <Button
            className="text-xs font-semibold px-3 py-1.5 h-auto rounded-xl cursor-pointer border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-200 bg-white shadow-sm"
            onClick={() => addArrayItem("why", "paragraphs", "")}
            variant="default"
          >
                + Add Paragraph
          </Button>
        </div>
      </section>
 
      <div className="pt-4 border-t border-slate-200/40">
        <Button
          className="px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          onClick={handleSave}
          variant="default"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
