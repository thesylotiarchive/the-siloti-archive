"use client";

import { useState } from "react";
import Image from "next/image";

const GRADIENTS = [
  ["#1D9E75", "#085041"], 
  ["#185FA5", "#042C53"],
  ["#534AB7", "#26215C"], 
  ["#D85A30", "#4A1B0C"],
  ["#D4537E", "#4B1528"], 
  ["#BA7517", "#412402"],
];

function hashTitle(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const TYPE_ICON = {
  PDF: "📄", 
  IMAGE: "🖼️", 
  AUDIO: "🎵", 
  VIDEO: "🎬",
  COLLECTION: "📁",
};

export function ArchiveThumbnail({ src, title, mediaType, className = "", size = "md" }) {
  const [imgError, setImgError] = useState(false);

  // If there's a src and it has loaded successfully
  if (src && !imgError) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-w-768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback linear gradient
  const typeKey = (mediaType || "COLLECTION").toUpperCase();
  const titleStr = title || "Untitled";
  const idx = hashTitle(titleStr) % GRADIENTS.length;
  const [c1, c2] = GRADIENTS[idx];
  const angle = (hashTitle(titleStr + "a") % 60) + 120;

  // Determine sizes based on size prop
  let emojiClass = "text-3xl";
  let showLabel = true;
  let labelClass = "text-[9px] sm:text-[10px]";

  if (size === "sm") {
    emojiClass = "text-xl";
    showLabel = false;
  } else if (size === "lg") {
    emojiClass = "text-4xl sm:text-5xl";
    labelClass = "text-xs";
  }

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center gap-1.5 shrink-0 select-none ${className}`}
      style={{ background: `linear-gradient(${angle}deg, ${c1}, ${c2})` }}
    >
      <span className={`${emojiClass} filter drop-shadow-md`}>
        {TYPE_ICON[typeKey] ?? "📁"}
      </span>
      {showLabel && (
        <span className={`${labelClass} font-bold tracking-widest uppercase text-white/70`}>
          {typeKey.toLowerCase() === "collection" ? "Folder" : typeKey}
        </span>
      )}
    </div>
  );
}
