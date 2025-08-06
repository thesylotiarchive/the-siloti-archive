"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import ShareModal from "./ShareModal";

export function MediaCard({ mediaItem, onShare }) {
  const {
    id,
    title,
    mediaType,
    fileUrl,
    externalLink,
    image,
    description,
  } = mediaItem;

  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState("top");
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

  useEffect(() => {
    if (hovered && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      setPosition(spaceBelow > 200 ? "bottom" : "top");
    }
  }, [hovered]);

  return (
    <div
      ref={cardRef}
      className="relative bg-card border border-border rounded-2xl shadow transition-transform hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ✅ Main clickable content */}
      <Link href={`/media/${id}`} className="block">
        <div className="relative w-full aspect-video bg-muted">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover rounded-t-xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {iconMap[mediaType] || "❓"}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-base font-semibold mb-1 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground capitalize">
              {mediaType.toLowerCase()}
            </div>
            {/* <button
              onClick={() => onShare(shareUrl)}
              className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1.5 rounded-lg transition"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button> */}
          </div>

          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <div>👁️ 0</div>
            <div>❤️ 0</div>
            <div>💬 0</div>
          </div>
        </div>
      </Link>

      {/* ✅ Share button with modal */}
      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent click bubbling to Link
            onShare(shareUrl);
          }}
          className="flex items-center gap-1 text-sm font-medium text-white bg-black/60 hover:bg-black/80 px-3 py-1.5 rounded-full shadow transition"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>

      {/* ✅ Tooltip preview */}
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
          {image && (
            <div className="relative w-full aspect-video mb-2 rounded-lg overflow-hidden">
              <Image src={image} alt={title} fill className="object-cover" />
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
