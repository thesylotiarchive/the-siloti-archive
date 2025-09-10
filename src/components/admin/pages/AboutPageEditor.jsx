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
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Edit About Page</h1>
  
      {/* Hero Section */}
      <section className="p-4 border rounded bg-gray-50 space-y-4">
        <h2 className="font-semibold">Hero Section</h2>
  
        <div>
          <label className="block text-sm font-medium mb-1">Heading</label>
          <input
            className="border p-2 w-full"
            value={form.sections.hero.heading}
            onChange={(e) => updateField("hero", "heading", e.target.value)}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Subheading</label>
          <input
            className="border p-2 w-full"
            value={form.sections.hero.subheading}
            onChange={(e) => updateField("hero", "subheading", e.target.value)}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="border h-32 p-2 w-full"
            value={form.sections.hero.description}
            onChange={(e) => updateField("hero", "description", e.target.value)}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Button Text</label>
          <input
            className="border p-2 w-full"
            value={form.sections.hero.buttonText}
            onChange={(e) => updateField("hero", "buttonText", e.target.value)}
          />
        </div>
      </section>
  
      {/* Mission Section */}
      <section className="p-4 border rounded bg-gray-50 space-y-4">
        <h2 className="font-semibold">Mission Section</h2>
  
        <div>
          <label className="block text-sm font-medium mb-1">Heading</label>
          <input
            className="border p-2 w-full"
            value={form.sections.mission.heading}
            onChange={(e) => updateField("mission", "heading", e.target.value)}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Tagline</label>
          <input
            className="border p-2 w-full"
            value={form.sections.mission.tagline}
            onChange={(e) => updateField("mission", "tagline", e.target.value)}
          />
        </div>
  
        {/* Paragraphs */}
        <div>
          <h3 className="font-medium">Paragraphs</h3>
          {form.sections.mission.paragraphs.map((p, i) => (
            <div key={i} className="flex items-start gap-2 mb-2">
              <textarea
                className="border h-32 p-2 flex-1"
                value={p}
                onChange={(e) =>
                  updateArrayItem("mission", "paragraphs", i, e.target.value)
                }
              />
              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => removeArrayItem("mission", "paragraphs", i)}
              >
                ✕
              </button>
            </div>
          ))}
          <Button
            className="px-3 py-1"
            onClick={() => addArrayItem("mission", "paragraphs", "")}
            variant="default"
          >
               + Add Paragraph
          </Button>
          {/* <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() => addArrayItem("mission", "paragraphs", "")}
          >
            + Add Paragraph
          </button> */}
        </div>
  
        {/* Stats */}
        <div>
          <h3 className="font-medium">Stats</h3>
          {form.sections.mission.stats.map((stat, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <div className="flex-1">
                <label className="block text-sm mb-1">Number</label>
                <input
                  className="border p-2 w-full"
                  placeholder="Number"
                  value={stat.number}
                  onChange={(e) => {
                    const updated = { ...stat, number: e.target.value };
                    updateArrayItem("mission", "stats", i, updated);
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">Label</label>
                <input
                  className="border p-2 w-full"
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => {
                    const updated = { ...stat, label: e.target.value };
                    updateArrayItem("mission", "stats", i, updated);
                  }}
                />
              </div>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => removeArrayItem("mission", "stats", i)}
              >
                ✕
              </button>
            </div>
          ))}
          <Button
            className="px-3 py-1"
            onClick={() =>
                addArrayItem("mission", "stats", { number: "", label: "" })
              }
            variant="default"
          >
                + Add Stat
          </Button>
          {/* <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() =>
              addArrayItem("mission", "stats", { number: "", label: "" })
            }
          >
            + Add Stat
          </button> */}
        </div>
      </section>
  
      {/* Why Section */}
      <section className="p-4 border rounded bg-gray-50 space-y-4">
        <h2 className="font-semibold">Why Section</h2>
        <div>
          <h3 className="font-medium">Paragraphs</h3>
          {form.sections.why.paragraphs.map((p, i) => (
            <div key={i} className="flex items-start gap-4 mb-4">
              <textarea
                className="border h-36 p-2 flex-1"
                value={p}
                onChange={(e) =>
                  updateArrayItem("why", "paragraphs", i, e.target.value)
                }
              />
              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => removeArrayItem("why", "paragraphs", i)}
              >
                ✕
              </button>
            </div>
          ))}
          <Button
            className="px-3 py-1"
            onClick={() => addArrayItem("why", "paragraphs", "")}
            variant="default"
          >
                + Add Paragraph
          </Button>
          {/* <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() => addArrayItem("why", "paragraphs", "")}
          >
            + Add Paragraph
          </button> */}
        </div>
      </section>

      <Button
        className="px-3 py-1"
        onClick={handleSave}
        variant="default"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>
  
      {/* <button
        className="px-6 py-2 bg-blue-600 text-white rounded"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button> */}
    </div>
  );
}
