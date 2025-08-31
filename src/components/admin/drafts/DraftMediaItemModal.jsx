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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-6 rounded-xl w-[90%] max-w-md space-y-4 shadow-lg"
      >
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Draft Media" : "Add Draft Media"}
        </h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full p-2 border rounded-md"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded-md"
        />

        <select
          name="mediaType"
          value={form.mediaType}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="AUDIO">Audio</option>
          <option value="VIDEO">Video</option>
          <option value="IMAGE">Image</option>
          <option value="PDF">Pdf</option>
          <option value="LINK">Link</option>
        </select>

        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail (Image)</label>
          <ImageUploaderWithToggle
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
            setIsUploading={setIsUploadingImage}
            endpoint="mediaImageUploader"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Media Upload / Link</label>
          <ImageUploaderWithToggle
            value={form.mediaUrl}
            onChange={(url) => setForm((prev) => ({ ...prev, mediaUrl: url }))}
            setIsUploading={setIsUploadingMedia}
            endpoint="mediaFileUploader"
            placeholder="PDF, audio, image, etc."
          />
        </div>

        <div className="flex justify-end gap-2">
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
            disabled={isUploadingImage || isUploadingMedia || loading}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update Draft" : "Save as Draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
