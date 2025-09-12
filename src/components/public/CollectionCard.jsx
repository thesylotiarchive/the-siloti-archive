'use client';

import Link from "next/link";
import Image from "next/image";
import { Boxes } from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export function CollectionCard({ collection, className = "" }) {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState("bottom"); // "bottom" | "top"
  const [baseRect, setBaseRect] = useState(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 320, height: 0 });
  const cardRef = useRef(null);
  const tooltipInnerRef = useRef(null);
  const rAFRef = useRef(null);

  const updateBaseRect = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const newPos = spaceBelow > 240 ? "bottom" : "top";
    setPosition((prev) => (prev === newPos ? prev : newPos));
    setBaseRect(rect);
  };

  const handleScrollOrResize = () => {
    if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    rAFRef.current = requestAnimationFrame(updateBaseRect);
  };

  useEffect(() => {
    if (hovered) {
      updateBaseRect();
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
    }
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [hovered]);

  useLayoutEffect(() => {
    if (!hovered || !tooltipInnerRef.current) return;
    const rect = tooltipInnerRef.current.getBoundingClientRect();
    setTooltipSize((prev) => {
      if (prev.width !== rect.width || prev.height !== rect.height) {
        return { width: rect.width, height: rect.height };
      }
      return prev;
    });
  }, [hovered, collection.name, collection.itemCount]);

  const computePortalStyle = () => {
    if (!baseRect) return { left: 8, top: -9999 };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const tooltipW = tooltipSize.width || 320;
    const tooltipH = tooltipSize.height || 0;
    const margin = 12;

    let left = Math.round(baseRect.left + baseRect.width / 2 - tooltipW / 2);
    left = Math.max(8, Math.min(left, vw - tooltipW - 8));

    let top;
    if (position === "bottom") {
      top = Math.round(baseRect.bottom + margin);
      if (top + tooltipH > vh - 8) {
        const flippedTop = Math.round(baseRect.top - tooltipH - margin);
        if (flippedTop >= 8) {
          setPosition("top");
          top = flippedTop;
        } else {
          top = Math.max(8, vh - tooltipH - 8);
        }
      }
    } else {
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
      className={`relative overflow-visible ${className}`}
      onMouseEnter={() => {
        setHovered(true);
        updateBaseRect();
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/collection/${collection.id}`}
        className="block border border-border rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group bg-card"
      >
        <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] p-8 flex flex-col items-center justify-center">
          <Image
            src="/collection_card_bg.png"
            alt="Card background"
            fill
            className="object-cover absolute inset-0 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px]" />
          <div className="relative flex flex-col items-center text-center">
            {collection.imageUrl ? (
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-white shadow-lg mx-auto mb-3 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={collection.imageUrl}
                  alt={collection.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/90 flex items-center justify-center text-3xl border-3 border-white shadow-lg mx-auto mb-3 transition-transform duration-300 group-hover:scale-110">
                📁
              </div>
            )}
            <h3 className="text-sm sm:text-sm font-bold text-black line-clamp-1 leading-tight px-2 drop-shadow-sm">
              {collection.name}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3 text-base text-white px-4 py-3 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700/50">
          <Boxes className="w-9 h-9 opacity-90 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-semibold">
            {collection.itemCount ?? 0} {collection.itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </Link>

      {hovered &&
        createPortal(
          <div
            className="fixed z-[99999] pointer-events-none"
            style={{
              left: portalStyle.left,
              top: portalStyle.top,
              width: tooltipSize.width || 320,
            }}
          >
            <div
              ref={tooltipInnerRef}
              className="pointer-events-auto relative bg-gray-500 text-white border border-gray-300 rounded-xl shadow-xl p-4"
              style={{ width: tooltipSize.width || 320 }}
            >
              <div
                className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                style={
                  position === "top"
                    ? {
                        borderLeft: "8px solid transparent",
                        borderRight: "8px solid transparent",
                        borderTop: "8px solid #6A7282",
                        bottom: -8,
                      }
                    : {
                        borderLeft: "8px solid transparent",
                        borderRight: "8px solid transparent",
                        borderBottom: "8px solid #6A7282",
                        top: -8,
                      }
                }
              />
              {collection.imageUrl ? (
                <div className="relative w-24 h-24 mx-auto mb-2 rounded-full overflow-hidden border-2 border-black shadow-md">
                  <Image
                    src={collection.imageUrl}
                    alt={collection.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center text-4xl border-2 border-black shadow-md">
                  📁
                </div>
              )}
              <div className="text-sm font-semibold text-center mb-1">
                {collection.name}
              </div>
              <div className="text-xs text-white text-center">
                {collection.itemCount ?? 0}{" "}
                {collection.itemCount === 1 ? "item" : "items"}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
