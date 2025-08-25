"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
const MediaItemModal = dynamic(() => import("@/components/admin/MediaItemModal"), { ssr: false }); // lazy load
import { useRef } from "react";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { FolderModal } from "@/components/admin/FolderModal";
import { MoreVertical } from "lucide-react";
import { MediaCard } from "@/components/admin/MediaCard";
import { FolderCard } from "@/components/admin/FolderCard";
import BulkMediaModal from "./BulkMediaModal";


export default function CollectionManagerClient() {
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folderId") || null;

  const [currentFolder, setCurrentFolder] = useState(null);
  const [subfolders, setSubfolders] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedMediaItem, setSelectedMediaItem] = useState(null);

  const [movingMediaId, setMovingMediaId] = useState(null);
  const [draggingMediaId, setDraggingMediaId] = useState(null);



  const fetchFolderData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/folders/${folderId || "root"}`);
      const data = await res.json();
  
      setCurrentFolder(data.folder);
      setSubfolders(data.subfolders || []); // safety
      setMediaItems(data.mediaItems || []); // safety

      console.log("folderId: ", folderId)
    } catch (err) {
      console.error("Failed to load folder data", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchFolderData();
  }, [folderId]);

  const buildBreadcrumbs = () => {
    const crumbs = [];
    let current = currentFolder;

    while (current) {
      crumbs.unshift(current);
      current = current.parent;
    }

    return crumbs;
  };

  const handleDeleteFolder = async (folderId) => {
    if (!confirm("Are you sure you want to delete this folder and all its contents?")) return;
  
    try {
      const res = await fetch(`/api/admin/folders/${folderId}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        fetchFolderData();
      } else {
        console.error("Failed to delete folder");
      }
    } catch (err) {
      console.error("Error deleting folder", err);
    }
  };

  const handleDeleteMedia = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this media item?");
    if (!confirmed) return;
  
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        fetchFolderData(); // Re-fetch media/folder items after deletion
      } else {
        alert("Failed to delete media item.");
      }
    } catch (err) {
      console.error("Delete error", err);
      alert("An error occurred while deleting the media item.");
    }
  };


  const handleDragStart = (e, mediaId) => {
    setDraggingMediaId(mediaId);
    e.dataTransfer.setData("mediaId", mediaId);
  };
  
  const handleDrop = async (e, targetFolderId) => {
    e.preventDefault();
    const mediaId = e.dataTransfer.getData("text/plain");
  
    if (!mediaId || !targetFolderId) return;
  
    setMovingMediaId(mediaId); // show loader
  
    try {
      const res = await fetch(`/api/admin/media/${mediaId}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newFolderId: targetFolderId }),
      });
  
      if (!res.ok) throw new Error("Failed to move media");
  
      // Optionally refetch media list here
    } catch (err) {
      console.error("Move failed:", err);
      alert("Failed to move the media item. Try again.");
    } finally {
      setMovingMediaId(null); // hide loader
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  

  return (
    <div>

      {movingMediaId && (
        <div className="fixed inset-0 bg-black/30 z-10 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {/* Breadcrumbs */}
      <div className="text-sm mb-4 text-muted-foreground">
        <Link href="/admin/dashboard/collection-manager" className="hover:underline">Home</Link>
        {buildBreadcrumbs().map((crumb) => (
          <span key={crumb.id}>
            {" / "}
            <Link href={`/admin/dashboard/collection-manager?folderId=${crumb.id}`} className="hover:underline">
              {crumb.name}
            </Link>
          </span>
        ))}
      </div>



      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        {/* Title */}
        <h1 className="text-xl font-bold">Collection Manager</h1>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:gap-2 gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFolderModalOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md w-full sm:w-auto text-center"
          >
            + Add Folder
          </button>

          {folderId && (
            <>
              <button
                onClick={() => setMediaModalOpen(true)}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md w-full sm:w-auto text-center"
              >
                + Add Media
              </button>

              <button
                onClick={() => setBulkModalOpen(true)}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md w-full sm:w-auto text-center"
              >
                + Bulk Action
              </button>

            </>
            
          )}
        </div>
      </div>


     {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
            <div
                key={i}
                className="flex flex-col items-center border rounded-lg p-4 animate-pulse bg-muted/30"
            >
                <div className="w-16 h-16 bg-muted rounded-md mb-2" />
                <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
            ))}
        </div>
        ) : (subfolders.length === 0 && mediaItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-muted-foreground py-16 col-span-full">
            <div className="text-5xl mb-2">📁</div>
            <p className="text-sm">This folder is empty.</p>
            <p className="text-xs mt-1">You can add a subfolder or media item to get started.</p>
        </div>
        ) : (
        <div className="relative z-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {subfolders.map((folder) => (
            <FolderCard
                key={folder.id}
                folder={folder}
                onDrop={(e) => handleDrop(e, folder.id)}
                onDragOver={handleDragOver}
                onEdit={(folder) => {
                setSelectedFolder(folder);
                setFolderModalOpen(true);
                }}
                onDelete={handleDeleteFolder}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
            />
            ))}

            {mediaItems.map((item) => (
            <MediaCard
                key={item.id}
                mediaItem={item}
                isActive={activeMenuId === item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                setActiveMenuId={setActiveMenuId}
                onEdit={() => {
                setSelectedMediaItem(item);
                setMediaModalOpen(true);
                }}
                onDelete={() => handleDeleteMedia(item.id)}
                isDragging={draggingMediaId === item.id}
            />
            ))}
        </div>
     ))}


        {mediaModalOpen && (
            <MediaItemModal
                isOpen={mediaModalOpen}
                mediaItem={selectedMediaItem}
                onClose={() => setMediaModalOpen(false)}
                onSuccess={() => {
                setMediaModalOpen(false);
                // Re-fetch updated folder/media data

                fetchFolderData();
                }}
            />
        )}

        <BulkMediaModal
          isOpen={bulkModalOpen}
          onClose={() => setBulkModalOpen(false)}
          onSuccess={() => {
            setBulkModalOpen(false);
            // Re-fetch updated folder/media data

            fetchFolderData();
            }}
        />

        <FolderModal
            isOpen={folderModalOpen}
            onClose={() => {
                setFolderModalOpen(false);
                setSelectedFolder(null);
            }}
            onSuccess={() => {
                setFolderModalOpen(false);
                setSelectedFolder(null);
                // Reload folder contents
                fetchFolderData();
            }}
            folders={[]} // optional
            folder={selectedFolder}
            parentId={folderId}
        />
    </div>
  );
}

