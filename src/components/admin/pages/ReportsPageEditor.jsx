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
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">Edit Reports Page</h1>

      {/* Page Settings */}
      <section className="p-4 border rounded bg-gray-50 space-y-4">
        <h2 className="font-semibold text-lg">Page Settings</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Page Title</label>
          <input
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
        <h2 className="font-semibold text-lg">Report Sections</h2>

        {form.sections.sections.map((section, sIndex) => (
          <div key={sIndex} className="p-4 border rounded bg-white space-y-6">
            <div className="flex justify-between">
              <h3 className="font-medium">Section {sIndex + 1}</h3>
              <Button
                variant="destructive"
                onClick={() => removeSection(sIndex)}
              >
                Remove
              </Button>
            </div>

            <input
              className="border p-2 w-full rounded"
              placeholder="Section title"
              value={section.title}
              onChange={(e) =>
                updateSectionField(sIndex, "title", e.target.value)
              }
            />

            <textarea
              className="border p-2 w-full rounded resize-none"
              placeholder="Section description"
              value={section.description}
              onChange={(e) =>
                updateSectionField(sIndex, "description", e.target.value)
              }
              onInput={autoResize}
            />

            {/* Reports */}
            <div className="space-y-4">
              {section.reports.map((report, rIndex) => (
                <div
                  key={report.id}
                  className="p-4 border rounded bg-gray-50 space-y-3"
                >
                  <div className="flex justify-between">
                    <strong>{report.title || "New Report"}</strong>
                    <Button
                      variant="destructive"
                      onClick={() => removeReport(sIndex, rIndex)}
                    >
                      Remove
                    </Button>
                  </div>

                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Report title"
                    value={report.title}
                    onChange={(e) =>
                      updateReportField(sIndex, rIndex, "title", e.target.value)
                    }
                  />

                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Year"
                    value={report.year}
                    onChange={(e) =>
                      updateReportField(sIndex, rIndex, "year", e.target.value)
                    }
                  />

                  {/* PDF / File Upload */}
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

                  {/* Thumbnail
                  <ImageUploaderWithToggle
                    name={`report-thumb-${report.id}`}
                    value={report.thumbnail}
                    onChange={(url) =>
                      updateReportField(sIndex, rIndex, "thumbnail", url)
                    }
                    setIsUploading={setIsUploading}
                    endpoint="mediaFileUploader"
                    placeholder="Upload cover image"
                    groupKey={`report-${report.id}`}
                  /> */}

                  <input
                    className="border p-2 w-full rounded"
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
              ))}

              <Button variant="secondary" onClick={() => addReport(sIndex)}>
                + Add Report
              </Button>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addSection}>
          + Add Section
        </Button>
      </section>

      <Button onClick={handleSave} disabled={saving || isUploading}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
