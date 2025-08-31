"use client";

import ImageUploaderWithToggle from "@/components/ImageUploaderWithToggle";
import { useEffect, useState } from "react";

/**
 * Props:
 * - isOpen: boolean
 * - onClose: function
 * - onSuccess: function (called after successful save)
 * - folder: the draft folder object
 */
export function DraftFolderModal({ isOpen, onClose, onSuccess, folder }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Populate form when folder changes
  useEffect(() => {
    if (folder) {
      setForm({
        name: folder.name || "",
        description: folder.description || "",
        image: folder.image || "",
      });
    }
  }, [folder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || isUploading) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/folders/${folder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Draft folder save failed:", res.status, errText);
        alert("Failed to save draft folder.");
        setLoading(false);
        return;
      }

      // Success: refresh parent UI
      onSuccess && onSuccess();

      // Close modal
      onClose && onClose();
    } catch (err) {
      console.error("Error saving draft folder:", err);
      alert("Failed to save draft folder.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4"
      >
        <h2 className="text-lg font-semibold">Edit Draft Folder</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Folder Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-input rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-input rounded-md px-3 py-2 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Folder Thumbnail</label>
          <ImageUploaderWithToggle
            value={form.image}
            setIsUploading={setIsUploading}
            onChange={(url) => setForm({ ...form, image: url })}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted-foreground"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            disabled={loading || isUploading}
          >
            {loading ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
