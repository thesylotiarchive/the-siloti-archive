"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ShareButtonSection({ mediaTitle, mediaId }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const shareUrl = `${window.location.origin}/media/${mediaId}`;
    const shareTitle = `Preserving Siloti Culture: "${mediaTitle}"`;
    const shareText = `Check out "${mediaTitle}" on the Sylheti Archive:`;

    // Check if native sharing is supported (mainly mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to copy-to-clipboard if share sheet is dismissed or errors
        console.warn("Native share dismissed, falling back to copy link", err);
      }
    }

    // Desktop/Fallback: Copy link directly to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-750 hover:text-slate-900 bg-slate-150 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/55 dark:hover:text-white border border-slate-200 dark:border-white/5 cursor-pointer transition-all duration-300 transform active:scale-95 shadow-xs"
      title={copied ? "Link copied!" : "Share or copy curation link"}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-500" />
      ) : (
        <Share2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
      )}
      <span>{copied ? "Copied" : "Share"}</span>
    </button>
  );
}
