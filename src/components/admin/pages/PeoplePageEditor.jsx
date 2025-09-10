"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ImageUploaderWithToggle from "@/components/ImageUploaderWithToggle";

export default function PeoplePageEditor({ page }) {
  const [form, setForm] = useState(page);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const updateField = (index, key, value) => {
    const updated = [...form.sections.people];
    updated[index][key] = value;
    setForm({
      ...form,
      sections: {
        ...form.sections,
        people: updated,
      },
    });
  };

  const addPerson = () => {
    setForm({
      ...form,
      sections: {
        ...form.sections,
        people: [
          ...form.sections.people,
          {
            name: "",
            role: "",
            image: "/avatars/avatar.png",
            description: "",
          },
        ],
      },
    });
  };

  const removePerson = (index) => {
    const updated = form.sections.people.filter((_, i) => i !== index);
    setForm({
      ...form,
      sections: { ...form.sections, people: updated },
    });
  };

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
      if (!res.ok) throw new Error("Failed to save");
      alert("✅ Changes saved successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">Edit People Page</h1>

      {/* Page Title */}
      <section className="p-4 border rounded bg-gray-50 space-y-4">
        <h2 className="font-semibold text-lg">Page Settings</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Page Title</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Intro</label>
          <textarea
            className="border p-2 w-full rounded resize-none"
            value={form.sections.intro}
            onChange={(e) =>
              setForm({
                ...form,
                sections: { ...form.sections, intro: e.target.value },
              })
            }
            rows={2}
            onInput={autoResize}
          />
        </div>
      </section>

      {/* People List */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold">People</h2>
        {form.sections.people.map((person, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg bg-white shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Person {i + 1}</h3>
              <Button
                variant="destructive"
                onClick={() => removePerson(i)}
                className="px-2 py-1"
              >
                Remove
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={person.name}
                  onChange={(e) => updateField(i, "name", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={person.role}
                  onChange={(e) => updateField(i, "role", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <ImageUploaderWithToggle
                value={person.image}
                onChange={(url) => updateField(i, "image", url)}
                setIsUploading={setIsUploading}
                groupKey={`person-${i}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="border p-2 w-full rounded resize-none"
                value={person.description}
                onChange={(e) => updateField(i, "description", e.target.value)}
                rows={2}
                onInput={autoResize}
              />
            </div>
          </div>
        ))}

        <Button
          variant="secondary"
          onClick={addPerson}
          className="px-3 py-1"
        >
          + Add Person
        </Button>
      </section>

      {/* Save Button */}
      <div className="pt-6">
        <Button
          className="px-3 py-1"
          onClick={handleSave}
          variant="default"
          disabled={saving || isUploading}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
