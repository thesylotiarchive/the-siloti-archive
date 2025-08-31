"use client";

import { useState, useEffect } from "react";
import DraftFolderCard from "./DraftFolderCard";
import { DraftFolderModal } from "./DraftFolderModal";
import { Button } from "@/components/ui/button";

export default function FoldersDrafts() {
  const [folders, setFolders] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFolder, setEditingFolder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    // open your FolderModal with folder
    console.log("Edit folder", folder);
    // call your modal logic here
  };

  if (loading) return <div>Loading draft folders...</div>;

  return (
    <div>
      {selectedIds.length > 0 && (
        <div className="mb-4 flex gap-2 justify-end flex-wrap items-center">
            {selectedIds.length > 0 && (
            <span>{selectedIds.length} selected</span>
            )}
        
            {/* Bulk actions */}
            {selectedIds.length > 0 && (
            <>
                
                <Button
                    className="cursor-pointer"
                    variant="default"
                    size="sm"
                    onClick={handlePublishSelected}
                >
                    Publish Selected
                </Button>

                <Button
                    className="cursor-pointer"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteSelected}
                >
                    Delete Selected
                </Button>

            </>
            )}
        
            {/* Select/Deselect All buttons */}
            {folders.length > 0 && (
            <>

                <Button
                    className="cursor-pointer"
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedIds(folders.map((f) => f.id))}
                >
                    Select All
                </Button>

                <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedIds([])}
                >
                    Deselect All
                </Button>

            </>
            )}
        </div>
      )}

      {folders.length === 0 ? (
        <div className="text-gray-500">No draft folders found.</div>
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
              role="ADMIN" // pass the role from your user context
            />
          ))}
        </div>
      )}
      <DraftFolderModal
        isOpen={isModalOpen}
        folder={editingFolder}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDrafts} // refresh the list after saving
     />
    </div>
  );
}