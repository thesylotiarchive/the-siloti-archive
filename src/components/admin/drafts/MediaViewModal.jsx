"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MediaViewModal({ isOpen, onClose, media, me, onUpdate }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !media) return null;

  const handlePublish = async () => {
    if (!media?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media/${media.id}/publish`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to publish media");
      onUpdate?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to publish media item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!media?.id) return;
    const confirmDelete = confirm("Are you sure you want to delete this media?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media/${media.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete media");
      onUpdate?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to delete media item.");
    } finally {
      setLoading(false);
    }
  };

  const renderMediaContent = () => {
    switch (media.mediaType) {
      case "AUDIO":
        return <audio controls className="w-full"><source src={media.fileUrl || media.externalLink} /></audio>;
      case "VIDEO":
        return <video controls className="w-full max-h-[400px]"><source src={media.fileUrl || media.externalLink} /></video>;
      case "IMAGE":
        return <img src={media.image || media.fileUrl} alt={media.title} className="w-full object-contain rounded-md" />;
      case "PDF":
        return (
          <iframe
            src={media.fileUrl || media.externalLink}
            className="w-full h-[500px] border rounded-md"
          />
        );
      case "LINK":
        return (
          <a href={media.externalLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Open Link
          </a>
        );
      default:
        return (
          <a href={media.fileUrl || media.externalLink} download className="text-blue-600 underline">
            Download File
          </a>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-card p-6 rounded-xl shadow-lg w-full max-w-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{media.title}</h2>
          {/* Media type badge */}
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
            {media.mediaType}
          </span>
        </div>

        {media.description && <p className="text-sm text-muted-foreground">{media.description}</p>}

        <div className="my-4">{renderMediaContent()}</div>

        <div className="flex justify-end gap-2">
          <button
            className="text-sm text-muted-foreground"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>

          {(me.role === "ADMIN" || me.role === "SUPERADMIN") && (
            <>
              {media.status !== "PUBLISHED" && (
                <Button
                  onClick={handlePublish}
                  variant="default"
                  size="sm"
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish"}
                </Button>
              )}

              <Button
                onClick={handleDelete}
                variant="destructive"
                size="sm"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
