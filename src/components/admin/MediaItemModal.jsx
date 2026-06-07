import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ImageUploaderWithToggle from "../ImageUploaderWithToggle";
import { Switch } from "../ui/switch";
import { X } from "lucide-react";

export default function MediaItemModal({ isOpen, onClose, mediaItem = null, onSuccess, me }) {
  const isEdit = !!mediaItem;
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folderId");

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLink = (url) => url?.startsWith("http") && !url.includes("uploadthing");
  const isUploadThingUrl = (url) => url?.includes("uploadthing");

  // store the "original" values (so we only delete new uploads if cancel)
  const originalImage = mediaItem?.image || "";
  const originalMedia = mediaItem?.fileUrl || mediaItem?.externalLink || "";

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    mediaUrl: "",
    mediaType: "AUDIO",
    status: "DRAFT", // default
  });

  // initialize for edit
  useEffect(() => {
    if (isEdit && mediaItem) {
      setForm({
        title: mediaItem.title || "",
        description: mediaItem.description || "",
        image: mediaItem.image || "",
        mediaUrl: mediaItem.fileUrl || mediaItem.externalLink || "",
        mediaType: mediaItem.mediaType || "AUDIO",
        status: mediaItem.status || "DRAFT",
      });
    } else {
      // Default behavior for new creations based on roles
      if (me?.role === "ADMIN" || me?.role === "SUPERADMIN") {
        setForm({
          title: "",
          description: "",
          image: "",
          mediaUrl: "",
          mediaType: "AUDIO",
          status: "PUBLISHED",
        });
      } else {
        setForm({
          title: "",
          description: "",
          image: "",
          mediaUrl: "",
          mediaType: "AUDIO",
          status: "DRAFT",
        });
      }
    }
  }, [mediaItem, isEdit, me?.role, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cleanupUploads = async () => {
    const deletes = [];

    if (form.image && isUploadThingUrl(form.image) && form.image !== originalImage) {
      deletes.push(form.image);
    }
    if (form.mediaUrl && isUploadThingUrl(form.mediaUrl) && form.mediaUrl !== originalMedia) {
      deletes.push(form.mediaUrl);
    }

    for (const url of deletes) {
      try {
        await fetch("/api/admin/uploadthing/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
      } catch (err) {
        console.error("Cleanup failed for:", url, err);
      }
    }
  };

  const handleClose = async () => {
    await cleanupUploads();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let body = { ...form, folderId };

      // 🔒 Enforce contributor restriction on client too (UI safeguard)
      if (me?.role === "CONTRIBUTOR") {
        body.status = "DRAFT";
      }

      const endpoint = isEdit
        ? `/api/admin/media/${mediaItem.id}`
        : `/api/admin/media`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onSuccess?.();
        onClose();
      } else {
        alert("Failed to save media item.");
        // cleanup to avoid leaks if save fails
        await cleanupUploads();
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isContributor = me?.role === "CONTRIBUTOR";
  const buttonLabel = isContributor
    ? "Save as Draft"
    : form.status === "PUBLISHED"
      ? isEdit ? "Update & Publish" : "Publish"
      : isEdit ? "Update Draft" : "Save as Draft";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white/90 border border-slate-200/80 rounded-[2.5rem] backdrop-blur-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transition-all transform duration-300 scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 shrink-0">
          <h2 className="text-2xl">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
              {isEdit ? "Edit Media Item" : "Add Media Item"}
            </span>
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 select-none custom-scrollbar">
          
          {isContributor && isEdit && mediaItem?.status === "PUBLISHED" && (
            <div className="p-4 text-xs font-medium bg-amber-50 border border-amber-200/80 text-amber-800 rounded-2xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
              Warning: Editing this published item will convert it back to a Pending Draft for admin review.
            </div>
          )}

          {/* Title Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Give this media a clear title..."
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/50 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm outline-none"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What is this media about?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/50 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm outline-none resize-none"
            />
          </div>

          {/* Media Type Grid Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Media Type</label>
            <select
              name="mediaType"
              value={form.mediaType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/50 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 text-slate-800 text-sm outline-none cursor-pointer"
            >
              <option value="AUDIO">Audio File (Song, Podcast, Interview)</option>
              <option value="VIDEO">Video Link / File</option>
              <option value="IMAGE">Image File (Photograph, Artwork)</option>
              <option value="PDF">PDF Document (Book, Manuscript)</option>
              <option value="LINK">External Link</option>
            </select>
          </div>

          {/* Thumbnail Image Uploader */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Thumbnail Image (Optional)</label>
            <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-[1.5rem] hover:bg-slate-50/80 transition-all">
              <ImageUploaderWithToggle
                name="image-upload-mode"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                setIsUploading={setIsUploadingImage}
                endpoint="folderImageUploader"
              />
            </div>
          </div>

          {/* Media File Upload / Link */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Media Content URL / Upload</label>
            <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-[1.5rem] hover:bg-slate-50/80 transition-all">
              <ImageUploaderWithToggle
                name="media-upload-mode"
                value={form.mediaUrl}
                onChange={(url) => setForm({ ...form, mediaUrl: url })}
                setIsUploading={setIsUploadingMedia}
                endpoint="mediaFileUploader"
                placeholder="Upload PDF, Audio, Image or paste link here..."
              />
            </div>
          </div>

          {/* Publish Toggle (Admins and Superadmins only) */}
          {(me?.role === "ADMIN" || me?.role === "SUPERADMIN") && (
            <div className="flex items-center justify-between p-4 border border-emerald-100 bg-emerald-50/20 rounded-2xl">
              <div>
                <p className="text-sm font-semibold text-slate-800">Publish Immediately?</p>
                <p className="text-xs text-slate-400 mt-0.5">Toggle off to save as a Draft folder instead.</p>
              </div>
              <Switch
                id="published"
                checked={form.status === "PUBLISHED"}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    status: checked ? "PUBLISHED" : "DRAFT",
                  }))
                }
                className="
                  data-[state=checked]:bg-emerald-500 
                  data-[state=unchecked]:bg-slate-200 
                  border border-transparent
                "
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploadingImage || isUploadingMedia || loading}
              className="px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm hover:shadow transition-all duration-300 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : buttonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
