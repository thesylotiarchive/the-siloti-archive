"use client";

import Link from "next/link";
import Image from "next/image";
import { Share2, Eye, Heart, MessageCircle, FileText, Music, Film, Image as ImageIcon } from "lucide-react";
import { ArchiveThumbnail } from "@/components/public/ArchiveThumbnail";

export function MediaCard({ mediaItem, onShare, className = "" }) {
  const {
    id,
    title,
    mediaType,
    fileUrl,
    externalLink,
    image,
    views,
    contributor,
  } = mediaItem;

  const isExternal = !!externalLink;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/media/${id}`
      : `/media/${id}`;

  let thumbnailSrc = null;
  if (mediaType === "IMAGE") {
    thumbnailSrc = image || fileUrl || null;
  } else {
    thumbnailSrc = image;
  }

  // Get appropriate Lucide icon for fallback based on mediaType
  const renderFallbackIcon = () => {
    const iconClass = "w-10 h-10 text-brand-gold/80";
    switch (mediaType) {
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
      className={`relative overflow-hidden bg-slate-900/60 border border-white/10 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-[0_12px_24px_rgba(16,185,129,0.15)] hover:border-emerald-500/50 hover:-translate-y-1.5 group backdrop-blur-md ${className}`}
    >
      <Link
        href={`/media/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer"
      >
        {/* Media Thumbnail Container */}
        <div className="relative w-full aspect-[4/3] rounded-t-2xl overflow-hidden bg-slate-950/80 border-b border-white/5">
          <ArchiveThumbnail
            src={thumbnailSrc}
            title={title}
            mediaType={mediaType}
            className="w-full h-full"
            size="lg"
          />

          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-white/90 group-hover:text-emerald-400 line-clamp-2 leading-snug transition-colors duration-300 min-h-[2.5rem] tracking-wide font-sans mb-3">
            {title}
          </h3>

          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="text-[10px] font-bold tracking-wider uppercase border border-amber-500/25 text-amber-400 bg-amber-500/5 px-2.5 py-0.5 rounded-full shrink-0">
              {mediaType.toLowerCase()}
            </div>
            {contributor && (
              <span className="text-[10px] text-white/50 font-semibold uppercase tracking-wider truncate max-w-[120px]">
                by {contributor.name || contributor.username}
              </span>
            )}
          </div>

          {/* Engagement stats */}
          <div className="flex items-center gap-4 text-xs text-white/55 border-t border-white/5 pt-3">
            <div className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
              <Eye className="w-4 h-4 text-white/40 group-hover:text-emerald-400" />
              <span className="font-semibold">{views || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4 text-white/40" />
              <span className="font-semibold">0</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
              <MessageCircle className="w-4 h-4 text-white/40" />
              <span className="font-semibold">0</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Floating Share Button */}
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onShare(shareUrl);
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-black/45 hover:bg-brand-gold hover:text-black border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
        >
          <Share2 size={12} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
