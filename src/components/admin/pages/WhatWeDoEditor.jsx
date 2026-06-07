"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function WhatWeDoEditor() {
  const router = useRouter();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Auto-resizing textarea
  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch("/api/admin/pages/what-we-do");
        if (!res.ok) throw new Error("Failed to fetch page");
        const data = await res.json();
        setPage(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, []);

  const updateHero = (field, value) => {
    setPage((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        hero: { ...prev.sections.hero, [field]: value },
      },
    }));
  };

  const updateService = (index, field, value) => {
    const updatedServices = [...page.sections.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setPage((prev) => ({
      ...prev,
      sections: { ...prev.sections, services: updatedServices },
    }));
  };

  const addService = () => {
    const newService = {
      title: "",
      icon: "",
      summary: "",
      bullets: [""],
    };
    setPage((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        services: [...prev.sections.services, newService],
      },
    }));
  };

  const removeService = (index) => {
    const updatedServices = [...page.sections.services];
    updatedServices.splice(index, 1);
    setPage((prev) => ({
      ...prev,
      sections: { ...prev.sections, services: updatedServices },
    }));
  };

  const updateBullet = (serviceIndex, bulletIndex, value) => {
    const updatedServices = [...page.sections.services];
    const updatedBullets = [...updatedServices[serviceIndex].bullets];
    updatedBullets[bulletIndex] = value;
    updatedServices[serviceIndex].bullets = updatedBullets;
    setPage((prev) => ({
      ...prev,
      sections: { ...prev.sections, services: updatedServices },
    }));
  };

  const addBullet = (serviceIndex) => {
    const updatedServices = [...page.sections.services];
    updatedServices[serviceIndex].bullets.push("");
    setPage((prev) => ({
      ...prev,
      sections: { ...prev.sections, services: updatedServices },
    }));
  };

  const removeBullet = (serviceIndex, bulletIndex) => {
    const updatedServices = [...page.sections.services];
    updatedServices[serviceIndex].bullets.splice(bulletIndex, 1);
    setPage((prev) => ({
      ...prev,
      sections: { ...prev.sections, services: updatedServices },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/pages/what-we-do", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          sections: page.sections,
        }),
      });
      alert("✅ Page saved successfully!");
      router.refresh();
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-8 h-8 border-4 border-emerald-500/80 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading content...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-16 bg-white/50 border border-slate-200/40 rounded-[2rem] shadow-sm max-w-xl mx-auto mt-10">
        <p className="text-red-500 font-medium">Page not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-slate-200/50 pb-5">
        <div>
          <h1 className="text-3xl font-light tracking-tight">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
              Edit What We Do
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Configure service offerings, descriptive bullets, icons, and hero highlights.
          </p>
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
            value={page.sections.hero.heading}
            onChange={(e) => updateHero("heading", e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subheading</label>
          <input
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
            value={page.sections.hero.subheading}
            onChange={(e) => updateHero("subheading", e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
          <textarea
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 resize-none outline-none min-h-[90px]"
            value={page.sections.hero.description}
            onChange={(e) => {
              updateHero("description", e.target.value);
              autoResize(e);
            }}
            rows={3}
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="space-y-6">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider pl-1">Services List</h2>
        
        {page.sections.services.map((service, i) => (
          <div
            key={i}
            className="p-6 border border-slate-200/60 rounded-[2rem] bg-white/70 backdrop-blur-md space-y-6 shadow-sm"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 font-serif italic">Service #{i + 1}</h3>
              <Button
                variant="destructive"
                onClick={() => removeService(i)}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/50 cursor-pointer transition-all duration-200"
              >
                Remove Service
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Title</label>
                <input
                  className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
                  value={service.title}
                  onChange={(e) => updateService(i, "title", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Icon (Emoji or SVG)</label>
                <input
                  className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none text-center"
                  placeholder="e.g. 🌍"
                  value={service.icon}
                  onChange={(e) => updateService(i, "icon", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Summary</label>
              <textarea
                className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 resize-none outline-none min-h-[70px]"
                value={service.summary}
                onChange={(e) => {
                  updateService(i, "summary", e.target.value);
                  autoResize(e);
                }}
                rows={2}
              />
            </div>

            {/* Bullets Sub-section */}
            <div className="space-y-3 pt-2 border-t border-slate-100/80">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider pl-1">Key Features / Bullets</label>
              
              {service.bullets.map((b, j) => (
                <div key={j} className="flex gap-3 items-center">
                  <textarea
                    className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 resize-none outline-none min-h-[36px]"
                    value={b}
                    onChange={(e) => updateBullet(i, j, e.target.value)}
                    onInput={autoResize}
                    rows={1}
                  />
                  <button
                    onClick={() => removeBullet(i, j)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/50 cursor-pointer shrink-0 transition-all duration-200"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              <Button
                variant="secondary"
                onClick={() => addBullet(i)}
                className="text-xs font-semibold px-4.5 py-2 h-auto rounded-xl cursor-pointer border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm"
              >
                + Add Bullet
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addService}
          className="text-xs font-semibold px-5 py-2.5 h-auto rounded-xl cursor-pointer border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm"
        >
          + Add Service
        </Button>
      </section>

      {/* Save Panel */}
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
