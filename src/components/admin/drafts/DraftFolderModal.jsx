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
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white/85 border border-slate-200/80 p-6 rounded-[2rem] shadow-xl w-[90%] max-w-md space-y-5 backdrop-blur-lg"
      >
        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic">
          Edit Draft Folder
        </h2>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Folder Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 resize-none outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Folder Thumbnail</label>
          <div className="p-1 border border-slate-200/60 rounded-xl bg-white/40">
            <ImageUploaderWithToggle
              value={form.image}
              setIsUploading={setIsUploading}
              onChange={(url) => setForm({ ...form, image: url })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-500 hover:text-slate-950 transition-colors font-semibold cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            disabled={loading || isUploading}
          >
            {loading ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
