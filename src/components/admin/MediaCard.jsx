"use client";

import { useRef } from "react";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { MoreVertical, FileText, Music, Film, Image as ImageIcon } from "lucide-react";

export function MediaCard({
  mediaItem,
  isActive,
  isDragging,
  setActiveMenuId,
  onEdit,
  onDelete,
  role,
  onPublish,
  ...props
}) {
  const menuRef = useRef(null);

  useOutsideClick(menuRef, () => {
    if (isActive) {
      setActiveMenuId(null);
    }
  });

  let thumbnailSrc = null;
  if (mediaItem.mediaType === "IMAGE") {
    thumbnailSrc = mediaItem.image || mediaItem.fileUrl || null;
  } else {
    thumbnailSrc = mediaItem.image;
  }

  const renderFallbackIcon = () => {
    const iconClass = "w-8 h-8 text-emerald-600";
    switch (mediaItem.mediaType) {
      case "AUDIO":
        return <Music className={iconClass} />;
      case "VIDEO":
        return <Film className={iconClass} />;
      case "DOCUMENT":
        return <FileText className={iconClass} />;
      default:
        return <ImageIcon className={iconClass} />;
    }
  };

  return (
    <div
      {...props}
      draggable
      onDragStart={(e) => {
        if (props.onDragStart) props.onDragStart(e);
      }}
      className={`relative flex flex-col items-center border border-slate-200/60 rounded-[2rem] p-6 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 group hover:shadow-md hover:border-emerald-500/30 ${
        isDragging ? "opacity-40 scale-95 cursor-grabbing" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      {/* Status badge */}
      <div
        className={`absolute top-4 left-4 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full border
          ${mediaItem.status === "PUBLISHED" 
            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
            : mediaItem.status === "DRAFT" 
            ? "bg-amber-50 text-amber-700 border-amber-200/80"
            : "bg-red-50 text-red-700 border-red-200/80"}`}
      >
        {mediaItem.status}
      </div>

      {/* Floating action button */}
      <div className="absolute top-4 right-4 z-30" ref={menuRef}>
        <button
          onClick={() => setActiveMenuId(isActive ? null : mediaItem.id)}
          className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {isActive && (
          <div
            className="absolute right-0 top-full mt-2 w-32 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200/80 p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            style={{ zIndex: 9999 }}
          >
            {(role === "ADMIN" || role === "SUPERADMIN") && mediaItem.status !== "PUBLISHED" && (
              <button
                onClick={() => {
                  onPublish?.();
                  setActiveMenuId(null);
                }}
                className="flex items-center w-full px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                ✅ Publish
              </button>
            )}

            <button
              onClick={() => {
                onEdit();
                setActiveMenuId(null);
              }}
              className="flex items-center w-full px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              ✏️ Edit
            </button>

            {(role === "ADMIN" || role === "SUPERADMIN") && (
              <button
                onClick={() => {
                  onDelete();
                  setActiveMenuId(null);
                }}
                className="flex items-center w-full px-3 py-2 text-xs font-semibold text-rose-600 rounded-lg hover:bg-rose-50 transition-colors text-left cursor-pointer"
              >
                🗑 Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Thumbnail */}
      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl mb-3 flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-inner">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={mediaItem.title}
            className="w-full h-full object-cover"
          />
        ) : (
          renderFallbackIcon()
        )}
      </div>

      <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 text-center transition-colors duration-300 line-clamp-1 w-full px-1">
        {mediaItem.title}
      </span>
    </div>
  );
}
