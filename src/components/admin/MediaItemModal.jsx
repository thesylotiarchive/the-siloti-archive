import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ImageUploaderWithToggle from "../ImageUploaderWithToggle";

export default function MediaItemModal({ isOpen, onClose, mediaItem = null, onSuccess }) {
  const isEdit = !!mediaItem;
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folderId");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const isLink = (url) => url?.startsWith("http") && !url.includes("uploadthing");

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    mediaUrl: "",
    mediaType: "AUDIO",
  });

  useEffect(() => {
    if (isEdit && mediaItem) {
      setForm({
        title: mediaItem.title || "",
        description: mediaItem.description || "",
        image: mediaItem.image || "",
        mediaUrl: mediaItem.fileUrl || mediaItem.externalLink || "",
        mediaType: mediaItem.mediaType || "AUDIO",
      });
    }
  }, [mediaItem, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      ...form,
      folderId,
    };

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
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg"
      >
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Media Item" : "Add Media Item"}
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
          {/* <option value="DOCUMENT">Document</option> */}
          <option value="LINK">Link</option>
        </select>

        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail (Image)</label>
          <ImageUploaderWithToggle
            name="image-upload-mode"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            setIsUploading={setIsUploadingImage}
            endpoint="folderImageUploader"
            initialMode={isLink(form.image) ? "link" : "upload"}
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
            initialMode={isLink(form.mediaUrl) ? "link" : "upload"}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted-foreground"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isUploadingImage || isUploadingMedia}
            className={`bg-primary text-primary-foreground px-4 py-2 rounded-md ${
              isUploadingImage || isUploadingMedia ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
