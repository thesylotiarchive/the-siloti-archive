"use client";

import { Button } from "@/components/ui/button";
import { FileText, Music, Film, Image as ImageIcon } from "lucide-react";

export default function DraftMediaCard({
  media,
  onEdit,
  onDelete,
  onPublish,
  onView,
  selectable = false,
  isSelected = false,
  onToggleSelect,
  role,
}) {

  const renderFallbackIcon = () => {
    const iconClass = "w-8 h-8 text-emerald-600";
    switch (media.mediaType) {
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
      className={`relative flex flex-col items-center border border-slate-200/60 rounded-[2rem] p-6 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 group hover:shadow-md hover:border-emerald-500/30 ${
        isSelected ? "ring-2 ring-emerald-500 border-transparent bg-white/95 shadow-md" : ""
      }`}
    >
      {/* Checkbox for bulk select */}
      {selectable && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect?.(media.id)}
          className="absolute top-4 left-4 z-30 cursor-pointer accent-emerald-600 w-4 h-4 rounded border-slate-300 focus:ring-emerald-500"
        />
      )}

      {/* Status badge */}
      <div
        className={`absolute top-4 ${selectable ? "left-10" : "left-4"} px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full border ${
          media.status === "PUBLISHED"
            ? "bg-emerald-50 border-emerald-200/80 text-emerald-700"
            : media.status === "REJECTED"
            ? "bg-red-50 border-red-200/80 text-red-700"
            : "bg-amber-50 border-amber-200/80 text-amber-700"
        }`}
      >
        {media.status}
      </div>

      {/* Thumbnail */}
      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl mb-3 flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-inner">
        {media.image ? (
          <img
            src={media.image}
            alt={media.title}
            className="w-full h-full object-cover"
          />
        ) : (
          renderFallbackIcon()
        )}
      </div>

      {/* Media title */}
      <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 text-center transition-colors duration-300 line-clamp-1 w-full px-1 mb-4">
        {media.title}
      </span>

      {/* Action buttons */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-center w-full">
        <Button
          className="flex-grow min-w-[70px] text-xs font-semibold px-2 py-1.5 h-auto rounded-xl cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200"
          variant="secondary"
          size="sm"
          onClick={() => onView?.(media)}
        >
          View
        </Button>

        <Button
          className="flex-grow min-w-[70px] text-xs font-semibold px-2 py-1.5 h-auto rounded-xl cursor-pointer border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-200"
          variant="outline"
          size="sm"
          onClick={() => onEdit(media)}
        >
          Edit
        </Button>

        {(role === "ADMIN" || role === "SUPERADMIN") && (
          <>
            <Button
              className="flex-grow min-w-[70px] text-xs font-semibold px-2 py-1.5 h-auto rounded-xl cursor-pointer bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white shadow-sm transition-all duration-300 active:scale-[0.98]"
              variant="default"
              size="sm"
              onClick={() => onPublish?.(media.id)}
            >
              Publish
            </Button>

            <Button
              className="flex-grow min-w-[70px] text-xs font-semibold px-2 py-1.5 h-auto rounded-xl cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 border border-red-200/50"
              variant="destructive"
              size="sm"
              onClick={() => onDelete?.(media.id)}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
