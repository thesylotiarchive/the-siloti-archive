"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
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
  const [position, setPosition] = useState("bottom"); // "bottom" | "top"
  const [baseRect, setBaseRect] = useState(null); // card rect (viewport coords)
  const [tooltipSize, setTooltipSize] = useState({ width: 320, height: 0 });
  const cardRef = useRef(null);
  const tooltipInnerRef = useRef(null);
  const rAFRef = useRef(null);

  const isExternal = !!externalLink;
  const mediaUrl = isExternal ? externalLink : fileUrl;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/media/${id}`
      : `/media/${id}`;

  // thumbnail logic left intact...
  let thumbnailSrc = null;
  if (mediaItem.mediaType === "IMAGE") {
    thumbnailSrc = mediaItem.image || mediaItem.fileUrl || null;
  } else {
    thumbnailSrc = mediaItem.image;
  }

  // Recompute card rect when hovered (and on scroll/resize while hovered)
  const updateBaseRect = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // decide initial position based on available space
    const spaceBelow = window.innerHeight - rect.bottom;
    const newPos = spaceBelow > 240 ? "bottom" : "top";
    setPosition((prev) => (prev === newPos ? prev : newPos));
    setBaseRect(rect);
  };

  // Throttled scroll/resize handler
  const handleScrollOrResize = () => {
    if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    rAFRef.current = requestAnimationFrame(updateBaseRect);
  };

  useEffect(() => {
    if (hovered) {
      // initial measurement
      updateBaseRect();
      // listen capture so nested scroll containers bubble up here
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
    }
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);

  // Measure tooltip size after it renders into the DOM
  useLayoutEffect(() => {
    if (!hovered || !tooltipInnerRef.current) return;
    const rect = tooltipInnerRef.current.getBoundingClientRect();
    // only update if changed (avoids render loops)
    setTooltipSize((prev) => {
      if (prev.width !== rect.width || prev.height !== rect.height) {
        return { width: rect.width, height: rect.height };
      }
      return prev;
    });
  }, [hovered, title, description, thumbnailSrc, baseRect]);

  // compute final left/top for the portal using measured values
  const computePortalStyle = () => {
    if (!baseRect) return { left: 8, top: -9999 }; // off-screen until measured

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const tooltipW = tooltipSize.width || 320;
    const tooltipH = tooltipSize.height || 0;
    const margin = 12;

    // center tooltip horizontally on card
    let left = Math.round(baseRect.left + baseRect.width / 2 - tooltipW / 2);
    left = Math.max(8, Math.min(left, vw - tooltipW - 8));

    // compute vertical placement based on current position
    let top;
    if (position === "bottom") {
      top = Math.round(baseRect.bottom + margin);
      // if it would overflow bottom, try flipping
      if (top + tooltipH > vh - 8) {
        const flippedTop = Math.round(baseRect.top - tooltipH - margin);
        if (flippedTop >= 8) {
          setPosition("top"); // safe to flip
          top = flippedTop;
        } else {
          // clamp inside viewport
          top = Math.max(8, vh - tooltipH - 8);
        }
      }
    } else {
      // position === "top"
      top = Math.round(baseRect.top - tooltipH - margin);
      if (top < 8) {
        const flippedTop = Math.round(baseRect.bottom + margin);
        if (flippedTop + tooltipH <= vh - 8) {
          setPosition("bottom");
          top = flippedTop;
        } else {
          top = 8;
        }
      }
    }

    return { left, top };
  };

  const portalStyle = computePortalStyle();

  return (
    <div
      ref={cardRef}
      className={`relative overflow-visible bg-card border border-border rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${className}`}
      onMouseEnter={() => {
        setHovered(true);
        // ensure immediate rect capture
        updateBaseRect();
      }}
      onMouseLeave={() => setHovered(false)}
    >
      {/* --- rest of your card markup unchanged --- */}
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
              {/* icon */}
            </div>
          )}

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

      {/* =========== PORTALLED TOOLTIP =========== */}
      {hovered &&
        createPortal(
          <div
            // outer wrapper: fixed to viewport
            className="fixed z-[99999] pointer-events-none bg-gray-100"
            style={{
              left: portalStyle.left,
              top: portalStyle.top,
              width: tooltipSize.width || 320,
            }}
          >
            {/* inner box we measure */}
            <div
              ref={tooltipInnerRef}
              className="pointer-events-auto relative bg-white border border-gray-300 rounded-xl shadow-xl p-4"
              style={{ width: tooltipSize.width || 320 }}
            >
              {/* arrow (centered) */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                style={
                  position === "top"
                    ? {
                        borderLeft: "8px solid transparent",
                        borderRight: "8px solid transparent",
                        borderTop: "8px solid white",
                        bottom: -8,
                      }
                    : {
                        borderLeft: "8px solid transparent",
                        borderRight: "8px solid transparent",
                        borderBottom: "8px solid white",
                        top: -8,
                      }
                }
              />
              {/* tooltip content */}
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
          </div>,
          document.body
        )}
    </div>
  );
}
