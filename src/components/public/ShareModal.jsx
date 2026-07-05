"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Info } from "lucide-react";
import { 
  FaFacebookF, 
  FaWhatsapp, 
  FaXTwitter, 
  FaInstagram 
} from "react-icons/fa6";
import { toast } from "react-hot-toast";

export default function ShareModal({ isOpen, onClose, mediaTitle, mediaId }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/media/${mediaId}`);
    }
  }, [mediaId]);

  if (!isOpen) return null;

  const shareTitle = `Preserving Siloti Culture: "${mediaTitle}"`;
  const shareText = `Check out "${mediaTitle}" on the Sylheti Archive:`;
  const fullShareMessage = `${shareText} ${shareUrl}`;

  const handleCopyLink = async () => {
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

  const handleNativeShare = async (platform) => {
    // Native sharing sheet for mobile devices
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return true;
      } catch (err) {
        // Fallback to direct web intent links if share was dismissed or failed
        console.warn("Native share dismissed/failed, falling back to direct link", err);
      }
    }
    return false;
  };

  const handleInstagramShare = async () => {
    const sharedNatively = await handleNativeShare();
    if (!sharedNatively) {
      // Direct Clipboard copy guidance for Instagram on desktop
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast((t) => (
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-bold text-slate-800 dark:text-white">Link Copied!</span>
            <span className="text-slate-500">Instagram doesn't support direct web sharing. You can now paste the link in your Instagram Bio or Stories!</span>
          </div>
        ), { duration: 6000 });
      } catch (err) {
        console.error("Failed to copy for Instagram", err);
      }
    }
  };

  const socialChannels = [
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/10",
      action: async () => {
        const shared = await handleNativeShare();
        if (!shared) {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareMessage)}`, "_blank");
        }
      }
    },
    {
      name: "Facebook",
      icon: FaFacebookF,
      color: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10",
      action: async () => {
        const shared = await handleNativeShare();
        if (!shared) {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
        }
      }
    },
    {
      name: "Twitter / X",
      icon: FaXTwitter,
      color: "bg-black hover:bg-slate-900 text-white shadow-md shadow-black/10 border border-slate-800",
      action: async () => {
        const shared = await handleNativeShare();
        if (!shared) {
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, "_blank");
        }
      }
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      color: "bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 hover:opacity-90 text-white shadow-md",
      action: handleInstagramShare
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 max-w-sm w-full rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-250 dark:bg-white/5 dark:hover:bg-white/10 rounded-full text-slate-700 dark:text-white/70 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mt-2">
          <h4 className="text-lg font-bold text-slate-800 dark:text-white font-serif italic">
            Share this Curation
          </h4>
          <p className="text-xs text-slate-500 dark:text-white/50 leading-relaxed font-light">
            Help preserve Sylheti history by sharing this artifact with your friends and community.
          </p>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-2 gap-4">
          {socialChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <button
                key={channel.name}
                onClick={channel.action}
                className={`flex items-center gap-3 p-3.5 rounded-2xl text-xs font-semibold transition-all duration-300 transform active:scale-95 cursor-pointer ${channel.color}`}
              >
                <Icon className="w-4 h-4" />
                <span>{channel.name}</span>
              </button>
            );
          })}
        </div>

        {/* Direct Link Copier */}
        <div className="space-y-2 border-t border-slate-200 dark:border-white/5 pt-4">
          <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-bold pl-1">
            Copy Page URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-500 dark:text-white/60 focus:outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-md shadow-emerald-400/10"
              title="Copy link to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Note */}
        <div className="text-[10px] text-slate-400 dark:text-white/30 flex items-start gap-1.5 leading-normal">
          <Info className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span>On mobile phones, clicking any button opens the system sharing drawer, supporting WhatsApp, Stories, and Direct Messaging instantly.</span>
        </div>
      </div>
    </div>
  );
}
