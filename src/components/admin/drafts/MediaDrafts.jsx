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

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="w-8 h-8 border-4 border-emerald-500/80 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-slate-400 font-medium animate-pulse">Loading draft media...</p>
    </div>
  );

  return (
    <div>
      {selectedIds.length > 0 && (
        <div className="mb-6 flex gap-3 p-4 bg-white/70 border border-slate-200/60 rounded-2xl items-center justify-between shadow-sm backdrop-blur-md">
          <span className="text-xs font-bold text-slate-700 bg-emerald-50 px-3 py-1.5 border border-emerald-100 rounded-lg">{selectedIds.length} items selected</span>

          <div className="flex gap-2 flex-wrap items-center">
            <Button 
              className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
              variant="default" 
              size="sm" 
              onClick={handleBulkPublish}
            >
              Publish Selected
            </Button>
            <Button 
              className="text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 border border-red-200/50 rounded-xl cursor-pointer"
              variant="destructive" 
              size="sm" 
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>

            <Button 
              className="text-xs font-semibold px-3.5 py-1.5 h-auto rounded-xl cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200"
              variant="secondary" 
              size="sm" 
              onClick={() => setSelectedIds(mediaList.map(m => m.id))}
            >
              Select All
            </Button>
            <Button 
              className="text-xs font-semibold px-3.5 py-1.5 h-auto rounded-xl cursor-pointer border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-200"
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedIds([])}
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {mediaList.length === 0 ? (
        <div className="text-center py-16 bg-white/50 border border-slate-200/40 rounded-[2rem] backdrop-blur-sm shadow-sm w-full col-span-full">
          <p className="text-slate-400 font-medium">No draft media items found in curation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mediaList.map((media) => (
            <DraftMediaCard
              key={media.id}
              media={media}
              role={me?.role || "CURATOR"}
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