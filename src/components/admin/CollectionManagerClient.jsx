"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Link from "next/link";
import dynamic from "next/dynamic";
const MediaItemModal = dynamic(() => import("@/components/admin/MediaItemModal"), { ssr: false }); // lazy load
import { useRef } from "react";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
// import { FolderModal } from "@/components/admin/FolderModal";
import { MoreVertical } from "lucide-react";
import { MediaCard } from "@/components/admin/MediaCard";
import { FolderCard } from "@/components/admin/FolderCard";
import BulkMediaModal from "./BulkMediaModal";
import { useAuth } from "@/lib/context/AuthContext";
import { FolderModal } from "./FolderModal";


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

  const { me, authLoading } = useAuth();



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

  const handlePublishFolder = async (id) => {
      try {
        const res = await fetch(`/api/admin/folders/${id}/publish`, { method: "PATCH" });
        if (!res.ok) throw new Error("Publish failed");
        await fetchFolderData();
        Swal.fire({
          title: "Published!",
          text: "Folder has been published successfully.",
          icon: "success",
          confirmButtonColor: "#10b981",
          background: "rgba(255, 255, 255, 0.85)",
          color: "#0f172a",
          customClass: { popup: "rounded-[2rem] border border-slate-200/80 shadow-2xl backdrop-blur-md font-sans" }
        });
      } catch (e) {
        console.error(e);
        Swal.fire({
          title: "Failed",
          text: "Failed to publish folder.",
          icon: "error",
          confirmButtonColor: "#ef4444",
          background: "rgba(255, 255, 255, 0.85)",
          color: "#0f172a",
          customClass: { popup: "rounded-[2rem] border border-slate-200/80 shadow-2xl backdrop-blur-md font-sans" }
        });
      }
  };

  const handlePublishMedia = async (id) => {
    try {
      const res = await fetch(`/api/admin/media/${id}/publish`, { method: "PATCH" });
      if (!res.ok) throw new Error("Publish failed");
      await fetchFolderData();
      Swal.fire({
        title: "Published!",
        text: "Media item has been published successfully.",
        icon: "success",
        confirmButtonColor: "#10b981",
        background: "rgba(255, 255, 255, 0.85)",
        color: "#0f172a",
        customClass: { popup: "rounded-[2rem] border border-slate-200/80 shadow-2xl backdrop-blur-md font-sans" }
      });
    } catch (e) {
      console.error(e);
      Swal.fire({
        title: "Failed",
        text: "Failed to publish media item.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "rgba(255, 255, 255, 0.85)",
        color: "#0f172a",
        customClass: { popup: "rounded-[2rem] border border-slate-200/80 shadow-2xl backdrop-blur-md font-sans" }
      });
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
    Swal.fire({
      title: "Delete Folder?",
      text: "Are you sure you want to delete this folder and all its contents?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, delete it!",
      background: "rgba(255, 255, 255, 0.85)",
      color: "#0f172a",
      customClass: { popup: "rounded-[2rem] border border-slate-200/80 shadow-2xl backdrop-blur-md font-sans" }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/admin/folders/${folderId}`, {
            method: "DELETE",
          });
      
          if (res.ok) {
            fetchFolderData();
            Swal.fire({
              title: "Deleted!",
              text: "Folder has been deleted.",
              icon: "success",
              confirmButtonColor: "#10b981",
              background: "rgba(255, 255, 255, 0.85)",
              color: "#0f172a",
              customClass: { popup: "rounded-[2rem] border border-slate-200/80 shadow-2xl backdrop-blur-md font-sans" }
            });
          } else {
            console.error("Failed to delete folder");
            Swal.fire({
              title: "Error",
              text: "Failed to delete folder.",
              icon: "error",
              confirmButtonColor: "#ef4444",
              background: "rgba(255, 255, 255, 0.85)",
              color: "#0f172a",
              customClass: { popup: "rounded-[2rem] border border-slate-200/80 shadow-2xl backdrop-blur-md font-sans" }
            });
          }
        } catch (err) {
          console.error("Error deleting folder", err);
        }
      }
    });
  };

  const handleDeleteMedia = async (id) => {
    Swal.fire({
      title: "Delete Media?",
      text: "Are you sure you want to delete this media item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, delete it!",
      background: "rgba(255, 255, 255, 0.85)",
      color: "#0f172a",
      customClass: { popup: "rounded-[2rem] border border-slate-200/80 shadow-2xl backdrop-blur-md font-sans" }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/admin/media/${id}`, {
            method: "DELETE",
          });
      
          if (res.ok) {
            fetchFolderData(); // Re-fetch media/folder items after deletion
            Swal.fire({
              title: "Deleted!",
              text: "Media item has been deleted.",
              icon: "success",
              confirmButtonColor: "#10b981",
              background: "rgba(255, 255, 255, 0.85)",
              color: "#0f172a",
              customClass: { popup: "rounded-[2rem] border border-slate-200/80 shadow-2xl backdrop-blur-md font-sans" }
            });
          } else {
            Swal.fire({
              title: "Error",
              text: "Failed to delete media item.",
              icon: "error",
              confirmButtonColor: "#ef4444",
              background: "rgba(255, 255, 255, 0.85)",
              color: "#0f172a",
              customClass: { popup: "rounded-[2rem] border border-slate-200/80 shadow-2xl backdrop-blur-md font-sans" }
            });
          }
        } catch (err) {
          console.error("Delete error", err);
          Swal.fire({
            title: "Error",
            text: "An error occurred while deleting the media item.",
            icon: "error",
            confirmButtonColor: "#ef4444",
            background: "rgba(255, 255, 255, 0.85)",
            color: "#0f172a",
            customClass: { popup: "rounded-[2rem] border border-slate-200/80 shadow-2xl backdrop-blur-md font-sans" }
          });
        }
      }
    });
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
      Swal.fire({
        title: "Error",
        text: "Failed to move the media item. Try again.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "rgba(255, 255, 255, 0.85)",
        color: "#0f172a",
        customClass: { popup: "rounded-[2rem] border border-slate-200/80 shadow-2xl backdrop-blur-md font-sans" }
      });
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
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {/* Breadcrumbs */}
      <div className="text-xs mb-6 text-slate-500 font-medium tracking-wide flex items-center gap-1.5 p-3.5 bg-white/60 border border-slate-200/60 rounded-2xl w-fit backdrop-blur-md shadow-sm">
        <Link href="/admin/dashboard/collection-manager" className="hover:text-emerald-700 hover:underline">Home</Link>
        {buildBreadcrumbs().map((crumb) => (
          <span key={crumb.id} className="flex items-center gap-1.5">
            <span className="text-slate-300">/</span>
            <Link href={`/admin/dashboard/collection-manager?folderId=${crumb.id}`} className="hover:text-emerald-700 hover:underline">
              {crumb.name}
            </Link>
          </span>
        ))}
      </div>



      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-slate-200/50 pb-5">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-light tracking-tight">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
              Collection Manager
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">Manage files and nested directories inside the archive collection tree.</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap sm:gap-2.5 gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFolderModalOpen(true)}
            className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer flex-grow sm:flex-grow-0 text-center"
          >
            + Add Folder
          </button>

          {folderId && (
            <>
              <button
                onClick={() => setMediaModalOpen(true)}
                className="px-5 py-2 text-sm font-semibold border border-slate-200 text-slate-700 bg-white/80 hover:bg-slate-50 rounded-xl shadow-sm transition-all duration-200 cursor-pointer flex-grow sm:flex-grow-0 text-center"
              >
                + Add Media
              </button>

              <button
                onClick={() => setBulkModalOpen(true)}
                className="px-5 py-2 text-sm font-semibold border border-slate-200 text-slate-700 bg-white/80 hover:bg-slate-50 rounded-xl shadow-sm transition-all duration-200 cursor-pointer flex-grow sm:flex-grow-0 text-center"
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
                className="flex flex-col items-center border border-slate-200/60 rounded-[2rem] p-6 animate-pulse bg-white/40"
            >
                <div className="w-16 h-16 bg-slate-100 rounded-2xl mb-3" />
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
            </div>
            ))}
        </div>
        ) : (subfolders.length === 0 && mediaItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-slate-400 py-16 col-span-full bg-white/50 border border-slate-200/40 rounded-[2rem] shadow-sm w-full">
            <div className="text-5xl mb-3">📁</div>
            <p className="text-sm font-semibold text-slate-800">This folder is empty.</p>
            <p className="text-xs text-slate-500 mt-1">You can add a subfolder or media item to get started.</p>
        </div>
        ) : (
        <div className="relative z-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {subfolders.map((folder) => (
            <FolderCard
                key={folder.id}
                folder={folder}
                role={me?.role}
                onPublish={handlePublishFolder}
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
                role={me?.role}
                onPublish={() => handlePublishMedia(item.id)}
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
                me={me}
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
          me={me}
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
            me={me}
        />
    </div>
  );
}

