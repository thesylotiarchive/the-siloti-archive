"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import ShareModal from "./ShareModal";

export default function ShareButtonSection({ mediaTitle, mediaId }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-750 hover:text-slate-900 bg-slate-150 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/55 dark:hover:text-white border border-slate-200 dark:border-white/5 cursor-pointer transition-all duration-300 transform active:scale-95 shadow-xs"
        title="Share this curation page URL"
      >
        <Share2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
        <span>Share</span>
      </button>

      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mediaTitle={mediaTitle}
        mediaId={mediaId}
      />
    </>
  );
}
