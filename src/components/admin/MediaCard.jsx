"use client";

import { useRef } from "react";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

export function MediaCard({ mediaItem, isActive, isDragging, setActiveMenuId, onEdit, onDelete, ...props })  {
  const menuRef = useRef(null);

  useOutsideClick(menuRef, () => {
    if (isActive) {
      setActiveMenuId(null);
    }
  });

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
        {/* Make this area visibly draggable */}
        <div className="" draggable={false}>
            {/* <img
            src={mediaItem.imageUrl || "/placeholder.png"}
            alt={mediaItem.title}
            className="w-full h-full object-cover pointer-events-none"
            /> */}
        </div>
      {/* 3-dot menu */}
      <div className="absolute top-2 right-2 z-10" ref={menuRef}>
        <button
          onClick={() => setActiveMenuId(isActive ? null : mediaItem.id)}
          className="text-muted-foreground hover:text-foreground"
        >
          ⋮
        </button>

        {isActive && (
          <div
            className="absolute right-0 top-full mt-2 w-28 bg-popover text-popover-foreground rounded-md shadow-lg border z-50"
            style={{ zIndex: 9999 }} // Optional: ensure it's highest
          >
            <button
              onClick={() => {
                onEdit();
                setActiveMenuId(null);
              }}
              className="block w-full px-4 py-2 text-sm hover:bg-muted text-left"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => {
                onDelete();
                setActiveMenuId(null);
              }}
              className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-muted text-left"
            >
              🗑 Delete
            </button>
          </div>
        )}


      </div>

      {/* Thumbnail */}
      <div className="w-16 h-16 bg-muted rounded-md mb-2">
        {mediaItem.image ? (
          <img
            src={mediaItem.image}
            alt={mediaItem.title}
            className="w-full h-full object-cover rounded-md z-0"
          />
        ) : (
          <div className="flex items-center justify-center h-full">🖼️</div>
        )}
      </div>

      <span className="text-sm text-center z-0">{mediaItem.title}</span>
    </div>
  );
}
