"use client";

import { useState, useEffect } from "react";
import DraftFolderCard from "./DraftFolderCard";
import { DraftFolderModal } from "./DraftFolderModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/AuthContext";

export default function FoldersDrafts() {
  const [folders, setFolders] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFolder, setEditingFolder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { me, authLoading } = useAuth();

  // Fetch draft folders
  const fetchDrafts = async () => {
    try {
      const res = await fetch("/api/admin/drafts/folders");
      if (!res.ok) throw new Error("Failed to fetch draft folders");
      const data = await res.json();
      setFolders(data.folders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  // Bulk publish
  const handlePublishSelected = async () => {
    try {
      const res = await fetch("/api/admin/folders/publish-multiple", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!res.ok) throw new Error("Failed to publish selected folders");
      setFolders((prev) => prev.filter((f) => !selectedIds.includes(f.id)));
      setSelectedIds([]);
      alert("Selected folders published successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to publish selected folders. Please try again.");
    }
  };
  
  // Bulk delete
  const handleDeleteSelected = async () => {
    const confirmDelete = confirm("Are you sure you want to delete the selected folders?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch("/api/admin/folders/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!res.ok) throw new Error("Failed to delete selected folders");
      setFolders((prev) => prev.filter((f) => !selectedIds.includes(f.id)));
      setSelectedIds([]);
      alert("Selected folders deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete selected folders. Please try again.");
    }
  };
  
  // Individual folder actions
  const handlePublishFolder = async (id) => {
    try {
      const res = await fetch(`/api/admin/folders/${id}/publish`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to publish folder");
      setFolders((prev) => prev.filter((f) => f.id !== id));
      if (selectedIds.length > 0) {
        setSelectedIds((prev) => prev.filter((sid) => sid !== id));
      }
      alert("Folder published successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to publish folder. Please try again.");
    }
  };
  
  const handleDeleteFolder = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this folder?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`/api/admin/folders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete folder");
      setFolders((prev) => prev.filter((f) => f.id !== id));
      if (selectedIds.length > 0) {
        setSelectedIds((prev) => prev.filter((sid) => sid !== id));
      }
      alert("Folder deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete folder. Please try again.");
    }
  };

  const handleEditFolder = (folder) => {
    console.log("Edit folder", folder);
  };

  if (authLoading || loading) return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="w-8 h-8 border-4 border-emerald-500/80 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-slate-400 font-medium animate-pulse">Loading draft folders...</p>
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
              onClick={handlePublishSelected}
            >
              Publish Selected
            </Button>

            <Button
              className="text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 border border-red-200/50 rounded-xl cursor-pointer"
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </Button>

            <Button
              className="text-xs font-semibold px-3.5 py-1.5 h-auto rounded-xl cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200"
              variant="secondary"
              size="sm"
              onClick={() => setSelectedIds(folders.map((f) => f.id))}
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

      {folders.length === 0 ? (
        <div className="text-center py-16 bg-white/50 border border-slate-200/40 rounded-[2rem] backdrop-blur-sm shadow-sm w-full">
          <p className="text-slate-400 font-medium">No draft folders found in curation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <DraftFolderCard
              key={folder.id}
              folder={folder}
              selectable
              isSelected={selectedIds.includes(folder.id)}
              onToggleSelect={(id) =>
                setSelectedIds((prev) =>
                  prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
                )
              }
              onEdit={() => {
                setEditingFolder(folder);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteFolder}
              onPublish={handlePublishFolder}
              role={me?.role || "CURATOR"}
            />
          ))}
        </div>
      )}
      <DraftFolderModal
        isOpen={isModalOpen}
        folder={editingFolder}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDrafts}
     />
    </div>
  );
}