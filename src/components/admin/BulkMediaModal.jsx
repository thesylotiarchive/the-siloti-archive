"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
// import { UploadDropzone } from "@uploadthing/react";
import ImageUploaderWithToggle from "../ImageUploaderWithToggle";
import { UploadDropzone } from "@/lib/uploadthing";

export default function BulkMediaModal({ isOpen, onClose, onSuccess }) {
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folderId");

  const [items, setItems] = useState([]); // [{id, fileUrl, title, description, mediaType, image, language, isNew:true}]
  const [isUploadingAny, setIsUploadingAny] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isUploadThingUrl = (url) =>
    typeof url === "string" && (url.includes("uploadthing") || url.includes("utfs.io"));

  useEffect(() => {
    if (!isOpen) {
      setItems([]);
    }
  }, [isOpen]);

  const deriveMediaType = (url) => {
    try {
      const u = new URL(url);
      const name = u.pathname.split("/").pop() || "";
      const ext = name.split(".").pop()?.toLowerCase() || "";
      if (["mp3", "wav", "m4a", "aac", "flac", "oga", "ogg"].includes(ext)) return "AUDIO";
      if (["mp4", "mov", "mkv", "webm", "avi", "m4v"].includes(ext)) return "VIDEO";
      if (["jpg", "jpeg", "png", "webp", "gif", "bmp", "tiff", "avif"].includes(ext)) return "IMAGE";
      if (ext === "pdf") return "PDF";
      return "LINK";
    } catch {
      return "LINK";
    }
  };

  const addUploadedFiles = (uploaded) => {
    const newItems = uploaded.map((f) => {
      const url = f?.url;
      const name = f?.name || (url ? url.split("/").pop() : "Untitled");
  
      // Prefer mime type, fallback to file extension
      let mediaType = "LINK";
      if (f.type?.startsWith("image/")) mediaType = "IMAGE";
      else if (f.type?.startsWith("audio/")) mediaType = "AUDIO";
      else if (f.type?.startsWith("video/")) mediaType = "VIDEO";
      else if (f.type === "application/pdf") mediaType = "PDF";
      else mediaType = deriveMediaType(url);
  
      return {
        id: crypto.randomUUID(),
        fileUrl: url,
        title: (name || "Untitled").replace(/\.[^.]+$/, ""),
        description: "",
        mediaType,
        image: "",
        language: "",
        isNew: true,
      };
    });
    setItems((prev) => [...newItems, ...prev]);
  };

  const handleRemoveItem = async (id) => {
    const item = items.find((x) => x.id === id);
    setItems((prev) => prev.filter((x) => x.id !== id));
    // best-effort cleanup
    const urlsToDelete = [];
    if (item?.fileUrl && isUploadThingUrl(item.fileUrl)) urlsToDelete.push(item.fileUrl);
    if (item?.image && isUploadThingUrl(item.image)) urlsToDelete.push(item.image);
    if (urlsToDelete.length) {
      await fetch("/api/admin/uploadthing/delete-many", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urlsToDelete }),
      }).catch(() => {});
    }
  };

  const cleanupAllUploads = async () => {
    const urls = [];
    for (const it of items) {
      if (it.fileUrl && isUploadThingUrl(it.fileUrl)) urls.push(it.fileUrl);
      if (it.image && isUploadThingUrl(it.image)) urls.push(it.image);
    }
    if (urls.length) {
      try {
        await fetch("/api/admin/uploadthing/delete-many", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls }),
        });
      } catch {}
    }
  };

  const handleClose = async () => {
    await cleanupAllUploads();
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) {
      onClose?.();
      return;
    }
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/media/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderId,
          items: items.map((it) => ({
            title: it.title?.trim() || "Untitled",
            description: it.description || "",
            image: it.image || "",
            mediaUrl: it.fileUrl,
            mediaType: it.mediaType || "AUDIO",
            language: it.language || null,
          })),
        }),
      });

      if (!res.ok) {
        // on failure, clean up uploads to avoid leaks
        await cleanupAllUploads();
        alert("Failed to save media items.");
        return;
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      await cleanupAllUploads();
      alert("Failed to save media items.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-4 md:p-6 rounded-xl w-full max-w-3xl space-y-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Media Items (Bulk)</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-sm text-muted-foreground hover:underline"
          >
            Close
          </button>
        </div>

        {/* Dropzone for multiple files */}
        <div className="rounded-lg border border-dashed">
        <UploadDropzone
            endpoint="mediaFileUploader"
            appearance={{
                container:
                  "p-4 border border-dashed border-gray-300 rounded-lg min-h-[200px] flex flex-col items-center justify-center space-y-2",
                uploadIcon: "w-10 h-10 text-gray-500",
                label: "text-sm text-gray-600",
                button: "px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700",
              }}
            onUploadBegin={() => setIsUploadingAny(true)}
            onClientUploadComplete={(res) => {
                console.log("✅ Upload complete (client):", res);
                if (res && res.length) addUploadedFiles(res);
                setIsUploadingAny(false);
            }}
            onUploadError={(err) => {
                console.error("❌ Upload error:", err);
                setIsUploadingAny(false);
                alert("Upload failed.");
            }}
        />
        </div>

        {!items.length ? (
          <p className="text-sm text-muted-foreground">
            Drop multiple files above to start building your bulk list.
          </p>
        ) : null}

        {/* Items editor */}
        {!!items.length && (
            <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
                {items.map((it) => (
                <div
                    key={it.id}
                    className="rounded-lg border p-3 md:p-4 bg-muted/30"
                >
                    <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium">
                        {it.fileUrl?.split("/").pop()}
                    </div>
                    <button
                        type="button"
                        onClick={() => handleRemoveItem(it.id)}
                        className="text-xs text-red-500 hover:underline"
                    >
                        Remove item
                    </button>
                    </div>

                    {/* Preview */}
                    {it.fileUrl && (
                    <div className="mb-3">
                        {it.mediaType === "IMAGE" && (
                        <img
                            src={it.fileUrl}
                            alt={it.title || "preview"}
                            className="max-h-40 rounded-md object-contain border"
                        />
                        )}
                        {it.mediaType === "VIDEO" && (
                        <video
                            src={it.fileUrl}
                            controls
                            className="max-h-40 rounded-md border"
                        />
                        )}
                        {it.mediaType === "AUDIO" && (
                        <audio
                            src={it.fileUrl}
                            controls
                            className="w-full"
                        />
                        )}
                        {it.mediaType === "PDF" && (
                        <iframe
                            src={it.fileUrl}
                            className="w-full h-40 rounded-md border"
                        />
                        )}
                        {it.mediaType === "LINK" && (
                        <a
                            href={it.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            Open Link
                        </a>
                        )}
                    </div>
                    )}

                    {/* Editable fields */}
                    <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <input
                        value={it.title}
                        onChange={(e) =>
                            setItems((prev) =>
                            prev.map((x) =>
                                x.id === it.id ? { ...x, title: e.target.value } : x
                            )
                            )
                        }
                        placeholder="Title"
                        className="w-full p-2 border rounded-md"
                        />
                        <textarea
                        value={it.description}
                        onChange={(e) =>
                            setItems((prev) =>
                            prev.map((x) =>
                                x.id === it.id
                                ? { ...x, description: e.target.value }
                                : x
                            )
                            )
                        }
                        placeholder="Description"
                        className="w-full p-2 border rounded-md"
                        />

                        <select
                        value={it.mediaType}
                        onChange={(e) =>
                            setItems((prev) =>
                            prev.map((x) =>
                                x.id === it.id
                                ? { ...x, mediaType: e.target.value }
                                : x
                            )
                            )
                        }
                        className="w-full p-2 border rounded-md"
                        >
                        <option value="AUDIO">Audio</option>
                        <option value="VIDEO">Video</option>
                        <option value="IMAGE">Image</option>
                        <option value="PDF">Pdf</option>
                        <option value="LINK">Link</option>
                        </select>
                    </div>

                    {/* Thumbnail per item */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                        Thumbnail (optional)
                        </label>
                        <ImageUploaderWithToggle
                        value={it.image}
                        onChange={(url) =>
                            setItems((prev) =>
                            prev.map((x) =>
                                x.id === it.id ? { ...x, image: url } : x
                            )
                            )
                        }
                        setIsUploading={(v) => setIsUploadingAny(v)}
                        endpoint="folderImageUploader"
                        groupKey={`thumb-${it.id}`} // avoid collisions
                        initialMode={"upload"}
                        />
                    </div>
                    </div>
                </div>
                ))}
            </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            {items.length} item{items.length === 1 ? "" : "s"} ready
            {isUploadingAny ? " • uploading…" : ""}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="text-sm text-muted-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploadingAny || isSaving || !items.length}
              className={`bg-primary text-primary-foreground px-4 py-2 rounded-md ${
                isUploadingAny || isSaving || !items.length ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSaving ? "Saving…" : "Create All"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
