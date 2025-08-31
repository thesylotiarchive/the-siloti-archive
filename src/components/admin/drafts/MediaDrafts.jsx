"use client";

import { useState, useEffect } from "react";
import DraftMediaCard from "./DraftMediaCard";
import { Button } from "@/components/ui/button";
import { DraftMediaItemModal } from "./DraftMediaItemModal";
import { useAuth } from "@/lib/context/AuthContext";
import { MediaViewModal } from "./MediaViewModal";

export default function MediaDrafts() {
  const [mediaList, setMediaList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMedia, setEditingMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { me, authLoading } = useAuth();

  const [viewingMedia, setViewingMedia] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);


  if (authLoading) {
    return <p>Loading user...</p>;
  }

  // Pagination params (optional)
  const page = 1;
  const limit = 20;

  // Fetch draft media
  const fetchDraftMedia = async () => {
    try {
      const res = await fetch(`/api/admin/drafts/media?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch draft media");
      const data = await res.json();
      setMediaList(data.media || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraftMedia();
  }, []);

  // Individual actions
const handlePublishMedia = async (id) => {
  try {
    const res = await fetch(`/api/admin/media/${id}/publish`, { method: "PATCH" });
    if (!res.ok) throw new Error("Failed to publish media");
    setMediaList((prev) => prev.filter((m) => m.id !== id));
    if (selectedIds.length > 0) setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    alert("Media published successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to publish media. Please try again.");
  }
};

const handleDeleteMedia = async (id) => {
  const confirmDelete = confirm("Are you sure you want to delete this media?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete media");
    setMediaList((prev) => prev.filter((m) => m.id !== id));
    if (selectedIds.length > 0) setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    alert("Media deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to delete media. Please try again.");
  }
};

// Bulk actions
const handleBulkPublish = async () => {
  try {
    const res = await fetch("/api/admin/media/publish-multiple", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds }),
    });
    if (!res.ok) throw new Error("Failed to bulk publish media");
    setMediaList((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
    setSelectedIds([]);
    alert("Selected media items published successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to bulk publish media. Please try again.");
  }
};

const handleBulkDelete = async () => {
  const confirmDelete = confirm("Are you sure you want to delete the selected media?");
  if (!confirmDelete) return;

  try {
    const res = await fetch("/api/admin/media/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds }),
    });
    if (!res.ok) throw new Error("Failed to bulk delete media");
    setMediaList((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
    setSelectedIds([]);
    alert("Selected media items deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to bulk delete media. Please try again.");
  }
};

  if (loading) return <div>Loading draft media...</div>;

  return (
    <div>
      {selectedIds.length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap items-center justify-end">
          <span>{selectedIds.length} selected</span>

          <Button variant="default" size="sm" onClick={handleBulkPublish}>
            Publish Selected
          </Button>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Delete Selected
          </Button>

          <Button variant="secondary" size="sm" onClick={() => setSelectedIds(mediaList.map(m => m.id))}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedIds([])}>
            Deselect All
          </Button>
        </div>
      )}

      {mediaList.length === 0 ? (
        <div className="text-gray-500">No draft media found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mediaList.map((media) => (
            <DraftMediaCard
              key={media.id}
              media={media}
              role="ADMIN"
              selectable
              isSelected={selectedIds.includes(media.id)}
              onToggleSelect={(id) =>
                setSelectedIds((prev) =>
                  prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
                )
              }
              onEdit={(m) => {
                setEditingMedia(m);
                setIsModalOpen(true);
              }}
              onView={(m) => {
                setViewingMedia(m);
                setIsViewModalOpen(true);
              }}
              onDelete={handleDeleteMedia}
              onPublish={handlePublishMedia}
            />
          ))}
        </div>
      )}

      < DraftMediaItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mediaItem={editingMedia}
        onSuccess={fetchDraftMedia}
        me={me}
      />
      <MediaViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        media={viewingMedia}
        me={me}
        onUpdate={fetchDraftMedia}
      />
    </div>
  );
}