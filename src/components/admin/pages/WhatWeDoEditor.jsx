"use client";

import { useState, useEffect, useRef } from "react";
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (!page) return <div className="p-6">Page not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">Edit What We Do Page</h1>

      {/* Hero Section */}
      <section className="p-4 border rounded bg-gray-50 space-y-4">
        <h2 className="font-semibold text-lg">Hero Section</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Heading</label>
          <input
            className="border p-2 w-full rounded"
            value={page.sections.hero.heading}
            onChange={(e) => updateHero("heading", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subheading</label>
          <input
            className="border p-2 w-full rounded"
            value={page.sections.hero.subheading}
            onChange={(e) => updateHero("subheading", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="border p-2 w-full rounded resize-none"
            value={page.sections.hero.description}
            onChange={(e) => {
              updateHero("description", e.target.value);
              autoResize(e);
            }}
            rows={3}
          />
        </div>
      </section>

      {/* Services */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold">Services</h2>
        {page.sections.services.map((service, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg bg-white shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Service {i + 1}</h3>
              <Button
                variant="destructive"
                onClick={() => removeService(i)}
                className="px-2 py-1"
              >
                Remove
              </Button>
            </div>

            <div>
              <label className="block text-sm mb-1">Title</label>
              <input
                className="border p-2 w-full rounded"
                value={service.title}
                onChange={(e) => updateService(i, "title", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Icon</label>
              <input
                className="border p-2 w-full rounded"
                placeholder="e.g. 🌍"
                value={service.icon}
                onChange={(e) => updateService(i, "icon", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Summary</label>
              <textarea
                className="border p-2 w-full rounded resize-none"
                value={service.summary}
                onChange={(e) => {
                  updateService(i, "summary", e.target.value);
                  autoResize(e);
                }}
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bullets</label>
              {service.bullets.map((b, j) => (
                <div key={j} className="flex gap-2 mb-2">
                  <textarea
                    className="border p-2 flex-1 rounded resize-none"
                    value={b}
                    onChange={(e) =>
                      updateBullet(i, j, e.target.value)
                    }
                    onInput={autoResize}
                    rows={1}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => removeBullet(i, j)}
                    className="px-2 py-1"
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button
                variant="secondary"
                onClick={() => addBullet(i)}
                className="px-3 py-1"
              >
                + Add Bullet
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="secondary"
          onClick={addService}
          className="px-3 py-1"
        >
          + Add Service
        </Button>
      </section>

      {/* Save Button */}
      <div className="pt-6">
        <Button
          className="px-3 py-1"
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
