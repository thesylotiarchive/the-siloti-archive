"use client";

import { useEffect } from "react";
import {
  Facebook,
  Twitter,
  ClipboardCopy,
  Check,
  MessageCircle,
  X,
} from "lucide-react";
import { useState } from "react";

export default function ShareModal({ url, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const escListener = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", escListener);
    return () => document.removeEventListener("keydown", escListener);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-[90%] md:w-full max-w-sm rounded-xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Share this media</h2>

        {/* Copy link */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md mb-4">
          <span className="truncate text-sm flex-1">{url}</span>
          <button
            onClick={handleCopy}
            className="text-sm font-medium hover:opacity-75 transition"
          >
            {copied ? (
              <div className="flex items-center gap-1 text-green-600">
                <Check size={16} /> Copied!
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <ClipboardCopy size={16} /> Copy
              </div>
            )}
          </button>
        </div>

        {/* Social */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:text-green-600"
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:text-blue-500"
          >
            <Twitter size={20} />
            Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:text-blue-700"
          >
            <Facebook size={20} />
            Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
