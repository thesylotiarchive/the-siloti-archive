"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Share2, Eye, Heart, MessageCircle } from "lucide-react";
import { createPortal } from "react-dom";

export function MediaCard({ mediaItem, onShare, className = "" }) {
  const {
    id,
    title,
    mediaType,
    fileUrl,
    externalLink,
    image,
    description,
    views,
  } = mediaItem;

  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState("bottom");
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  const cardRef = useRef(null);

  const isExternal = !!externalLink;
  const mediaUrl = isExternal ? externalLink : fileUrl;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/media/${id}`
      : `/media/${id}`;

  const iconMap = {
    AUDIO: "🎧",
    VIDEO: "🎥",
    PDF: "📄",
    DOC: "📝",
    LINK: "🔗",
    IMAGE: "🖼️",
    OTHER: "❓",
  };

  let thumbnailSrc = null;
  if (mediaItem.mediaType === "IMAGE") {
    thumbnailSrc = mediaItem.image || mediaItem.fileUrl || null;
  } else {
    thumbnailSrc = mediaItem.image;
  }

  const updatePosition = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const tooltipWidth = 320;

    const spaceBelow = window.innerHeight - rect.bottom;
    const newPosition = spaceBelow > 240 ? "bottom" : "top";
    setPosition(newPosition);

    const newLeft = Math.max(
      16,
      Math.min(
        rect.left + rect.width / 2 - tooltipWidth / 2,
        window.innerWidth - tooltipWidth - 16
      )
    );

    const newTop =
      newPosition === "bottom"
        ? rect.bottom + 12
        : rect.top - 12; // distance for top placement

    setCoords({ left: newLeft, top: newTop });
  };

  // 🖱 Hover logic + scroll/resize listeners
  useEffect(() => {
    if (hovered) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [hovered]);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-visible bg-card border border-border rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Main clickable content */}
      <Link href={`/media/${id}`} className="block">
        <div className="relative w-full aspect-video bg-muted rounded-t-2xl overflow-hidden">
          {thumbnailSrc ? (
            <Image
              src={thumbnailSrc}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-muted to-muted/80">
              {iconMap[mediaType] || "❓"}
            </div>
          )}
          
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <h3 className="text-base font-semibold mb-2 line-clamp-2 text-foreground leading-tight">
            {title}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-muted-foreground capitalize font-medium bg-secondary/50 px-3 py-1 rounded-full">
              {mediaType.toLowerCase()}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{views || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
              <span className="font-medium">0</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">0</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Share button */}
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare(shareUrl);
          }}
          className="flex items-center gap-2 text-sm font-medium text-white bg-black/70 hover:bg-black/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Share2 size={14} />
          <span>Share</span>
        </button>
      </div>

      {/* Improved tooltip*/}
      {hovered && (
        <div
          className={`absolute z-50 left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-300 rounded-xl shadow-xl p-4 ${
            position === "top" ? "-top-2 -translate-y-full" : "top-full mt-2"
          }`}
        >
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 ${
              position === "top"
                ? "top-full border-t-8 border-transparent border-t-white"
                : "-top-2 border-b-8 border-transparent border-b-white"
            } shadow-md`}
          />
          {thumbnailSrc && (
            <div className="relative w-full aspect-video mb-2 rounded-lg overflow-hidden">
              <Image src={thumbnailSrc} alt={title} fill className="object-cover" />
            </div>
          )}
          <div className="text-sm font-semibold mb-1">{title}</div>
          <div className="text-xs text-muted-foreground mb-1 capitalize">
            {mediaType.toLowerCase()}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-3">
              {description}
            </p>
          )}
        </div>
      )}
      
      
    </div>
  );
}