"use client";

import { useRef } from "react";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { MoreVertical } from "lucide-react";

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

  // ✅ Determine thumbnail source
  let thumbnailSrc = null;
  if (mediaItem.mediaType === "IMAGE") {
    thumbnailSrc = mediaItem.image || mediaItem.fileUrl || null;
  }else {
    thumbnailSrc = mediaItem.image
  }

  return (
    <div
      {...props}
      draggable
      onDragStart={(e) => {
        if (props.onDragStart) props.onDragStart(e);
      }}
      className={`relative flex flex-col items-center border rounded-lg p-4 bg-card hover:bg-muted transition ${
        isDragging ? "opacity-50 scale-95 cursor-grab active:cursor-grabbing" : ""
      }`}
    >

      {/* Status badge */}
      <div
        className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold rounded-full
          ${mediaItem.status === "PUBLISHED" ? "bg-green-100 text-green-700"
           : mediaItem.status === "DRAFT" ? "bg-yellow-100 text-yellow-700"
           : "bg-red-100 text-red-700"}`}
      >
        {mediaItem.status}
      </div>

      {/* Floating action button */}
      <div className="absolute top-2 right-2 z-10" ref={menuRef}>
        <button
          onClick={() => setActiveMenuId(isActive ? null : mediaItem.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {isActive && (
          <div
            className="absolute right-0 top-full mt-2 w-28 bg-popover text-popover-foreground rounded-md shadow-lg border z-50"
            style={{ zIndex: 9999 }}
          >
            {(role === "ADMIN" || role === "SUPERADMIN") && mediaItem.status !== "PUBLISHED" && (
              <button
                onClick={() => {
                  onPublish?.();
                  setActiveMenuId(null);
                }}
                className="block w-full px-4 py-2 text-sm hover:bg-muted text-left"
              >
                ✅ Publish
              </button>
            )}


            <button
              onClick={() => {
                onEdit();
                setActiveMenuId(null);
              }}
              className="block w-full px-4 py-2 text-sm hover:bg-muted text-left"
            >
              ✏️ Edit
            </button>


            {(role === "ADMIN" || role === "SUPERADMIN") && (
              <button
                onClick={() => {
                  onDelete();
                  setActiveMenuId(null);
                }}
                className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-muted text-left"
              >
                🗑 Delete
              </button>
            )}


          </div>
        )}
      </div>

      {/* Thumbnail */}
      <div className="w-16 h-16 bg-muted rounded-md mb-2 overflow-hidden flex items-center justify-center">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={mediaItem.title}
            className="w-full h-full object-cover rounded-md z-0"
          />
        ) : (
          <div className="text-xl">🖼️</div>
        )}
      </div>

      <span className="text-sm text-center z-0">{mediaItem.title}</span>
    </div>
  );
}
