import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ImageUploaderWithToggle from "../ImageUploaderWithToggle";
import { Switch } from "../ui/switch";

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
    } else if (!isEdit && (me.role === "ADMIN" || me.role === "SUPERADMIN")) {
      setForm((prev) => ({ ...prev, status: "PUBLISHED" })); // default publish
    }
  }, [mediaItem, isEdit, me.role]);

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
  };

  if (!isOpen) return null;

  const isContributor = me.role === "CONTRIBUTOR";
  const buttonLabel = isContributor
    ? "Save as Draft"
    : form.status === "PUBLISHED"
      ? isEdit ? "Update & Publish" : "Publish"
      : isEdit ? "Update Draft" : "Save as Draft";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-6 rounded-xl w-[90%] max-w-md space-y-4 shadow-lg"
      >
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Media Item" : "Add Media Item"}
        </h2>

        {isContributor && isEdit && mediaItem?.status === "PUBLISHED" && (
          <div className="p-2 text-sm bg-yellow-100 text-yellow-800 rounded-md">
            Warning: Editing this will convert it to a Draft.
          </div>
        )}

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

        {/* Publish toggle only for admins/superadmins */}
        

        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail (Image)</label>
          <ImageUploaderWithToggle
            name="image-upload-mode"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            setIsUploading={setIsUploadingImage}
            endpoint="folderImageUploader"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Media Upload / Link</label>
          <ImageUploaderWithToggle
            name="media-upload-mode"
            value={form.mediaUrl}
            onChange={(url) => setForm({ ...form, mediaUrl: url })}
            setIsUploading={setIsUploadingMedia}
            endpoint="mediaFileUploader"
            placeholder="PDF, audio, image, etc."
          />
        </div>

        {(me.role === "ADMIN" || me.role === "SUPERADMIN") && (
          <div className="flex items-center gap-2">
            <label htmlFor="published" className="text-sm">
              Publish?
            </label>
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
                data-[state=checked]:bg-green-500 
                data-[state=unchecked]:bg-gray-400 
                border border-gray-300
              "
            />
          </div>
        )}

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
            {loading ? "Saving..." : buttonLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
