"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ImageUploaderWithToggle from "@/components/ImageUploaderWithToggle";
import { nanoid } from "nanoid";

export default function PeoplePageEditor({ page }) {
  const [form, setForm] = useState(page);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Auto-resizing textarea
  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  /** ----------------------------
   * Section Handlers
   ---------------------------- **/
  const addSection = () => {
    setForm({
      ...form,
      sections: {
        ...form.sections,
        sections: [
          ...form.sections.sections,
          {
            title: "",
            people: [],
          },
        ],
      },
    });
  };

  const updateSectionTitle = (index, value) => {
    const updatedSections = [...form.sections.sections];
    updatedSections[index].title = value;
    setForm({
      ...form,
      sections: {
        ...form.sections,
        sections: updatedSections,
      },
    });
  };

  const removeSection = (index) => {
    const updatedSections = [...form.sections.sections];
    updatedSections.splice(index, 1);
    setForm({
      ...form,
      sections: {
        ...form.sections,
        sections: updatedSections,
      },
    });
  };

  /** ----------------------------
   * People Handlers
   ---------------------------- **/
  const addPerson = (sectionIndex) => {
    const updatedSections = [...form.sections.sections];
    updatedSections[sectionIndex].people.push({
      id: nanoid(), // Unique ID for individual page
      name: "",
      role: "",
      image: "/avatars/avatar.png",
      description: "",
    });
    setForm({
      ...form,
      sections: {
        ...form.sections,
        sections: updatedSections,
      },
    });
  };

  const removePerson = (sectionIndex, personIndex) => {
    const updatedSections = [...form.sections.sections];
    updatedSections[sectionIndex].people.splice(personIndex, 1);
    setForm({
      ...form,
      sections: {
        ...form.sections,
        sections: updatedSections,
      },
    });
  };

  const updatePersonField = (sectionIndex, personIndex, key, value) => {
    const updatedSections = [...form.sections.sections];
    updatedSections[sectionIndex].people[personIndex][key] = value;
    setForm({
      ...form,
      sections: {
        ...form.sections,
        sections: updatedSections,
      },
    });
  };

  /** ----------------------------
   * Save Page
   ---------------------------- **/
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

      {/* Page Settings */}
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

      {/* Sections */}
      <section className="space-y-8">
        <h2 className="text-lg font-semibold">Sections</h2>

        {form.sections.sections.map((section, sIndex) => (
          <div key={sIndex} className="p-4 border rounded-lg bg-white shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Section {sIndex + 1}</h3>
              <Button
                variant="destructive"
                onClick={() => removeSection(sIndex)}
                className="px-2 py-1"
              >
                Remove Section
              </Button>
            </div>

            {/* Section Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Section Title</label>
              <input
                type="text"
                className="border p-2 w-full rounded"
                value={section.title}
                onChange={(e) => updateSectionTitle(sIndex, e.target.value)}
              />
            </div>

            {/* People List */}
            <div className="space-y-4">
              {section.people.map((person, pIndex) => (
                <div
                  key={person.id}
                  className="p-4 border rounded-lg bg-gray-50 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{person.name || `Person ${pIndex + 1}`}</h4>
                    <Button
                      variant="destructive"
                      onClick={() => removePerson(sIndex, pIndex)}
                      className="px-2 py-1"
                    >
                      Remove Person
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        className="border p-2 w-full rounded"
                        value={person.name}
                        onChange={(e) =>
                          updatePersonField(sIndex, pIndex, "name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Role</label>
                      <input
                        type="text"
                        className="border p-2 w-full rounded"
                        value={person.role}
                        onChange={(e) =>
                          updatePersonField(sIndex, pIndex, "role", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Image</label>
                    <ImageUploaderWithToggle
                      value={person.image}
                      onChange={(url) => updatePersonField(sIndex, pIndex, "image", url)}
                      setIsUploading={setIsUploading}
                      groupKey={`person-${person.id}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      className="border p-2 w-full rounded resize-none"
                      value={person.description}
                      onChange={(e) =>
                        updatePersonField(sIndex, pIndex, "description", e.target.value)
                      }
                      rows={2}
                      onInput={autoResize}
                    />
                  </div>
                </div>
              ))}

              <Button
                variant="secondary"
                onClick={() => addPerson(sIndex)}
                className="px-3 py-1"
              >
                + Add Person
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addSection}
          className="px-3 py-1"
        >
          + Add Section
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
