"use client";

import ImageUploaderWithToggle from "@/components/ImageUploaderWithToggle";
import { useEffect, useState } from "react";

export function DraftMediaItemModal({ isOpen, onClose, mediaItem = null, onSuccess, me }) {
  const isEdit = !!mediaItem;

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    mediaUrl: "",
    mediaType: "AUDIO",
    status: "DRAFT",
  });

  // Initialize form for edit
  useEffect(() => {
    if (isEdit && mediaItem) {
      setForm({
        title: mediaItem.title || "",
        description: mediaItem.description || "",
        image: mediaItem.image || "",
        mediaUrl: mediaItem.fileUrl || mediaItem.externalLink || "",
        mediaType: mediaItem.mediaType || "AUDIO",
        status: "DRAFT", // always draft
      });
    }
  }, [mediaItem, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || isUploadingImage || isUploadingMedia) return;

    setLoading(true);

    try {
      const endpoint = isEdit
        ? `/api/admin/media/${mediaItem.id}`
        : `/api/admin/media`;

      const method = isEdit ? "PATCH" : "POST";

      const body = { ...form, status: "DRAFT" }; // always DRAFT for this modal

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save draft media item");

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Draft media save error:", err);
      alert("Failed to save draft media item.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        className="bg-white/85 border border-slate-200/80 p-6 rounded-[2rem] w-[90%] max-w-md space-y-5 shadow-lg backdrop-blur-lg"
      >
        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic">
          {isEdit ? "Edit Draft Media" : "Add Draft Media"}
        </h2>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter media title"
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
            placeholder="Enter description"
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 resize-none outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Media Type</label>
          <select
            name="mediaType"
            value={form.mediaType}
            onChange={handleChange}
            className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
          >
            <option value="AUDIO">Audio</option>
            <option value="VIDEO">Video</option>
            <option value="IMAGE">Image</option>
            <option value="PDF">Pdf</option>
            <option value="LINK">Link</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Thumbnail (Image)</label>
          <div className="p-1 border border-slate-200/60 rounded-xl bg-white/40">
            <ImageUploaderWithToggle
              value={form.image}
              onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
              setIsUploading={setIsUploadingImage}
              endpoint="mediaImageUploader"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Media Upload / Link</label>
          <div className="p-1 border border-slate-200/60 rounded-xl bg-white/40">
            <ImageUploaderWithToggle
              value={form.mediaUrl}
              onChange={(url) => setForm((prev) => ({ ...prev, mediaUrl: url }))}
              setIsUploading={setIsUploadingMedia}
              endpoint="mediaFileUploader"
              placeholder="PDF, audio, image, etc."
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
            disabled={isUploadingImage || isUploadingMedia || loading}
            className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Saving..." : isEdit ? "Update Draft" : "Save as Draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
