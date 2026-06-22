'use client';

import Link from "next/link";
import Image from "next/image";
import { Boxes, FolderOpen } from "lucide-react";

export function CollectionCard({ collection, className = "" }) {
  return (
    <div className={`relative overflow-visible ${className}`}>
      <Link
        href={`/collection/${collection.id}`}
        className="block border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-[0_12px_24px_rgba(16,185,129,0.15)] hover:border-emerald-500/50 hover:-translate-y-1.5 group bg-white/80 dark:bg-slate-900/60 backdrop-blur-md cursor-pointer"
      >
        <div className="relative w-full aspect-[4/3] p-6 flex flex-col items-center justify-center">
          <Image
            src="/collection_card_bg.png"
            alt="Card background"
            fill
            className="object-cover absolute inset-0 transition-transform duration-350 group-hover:scale-105"
            priority
          />
          {/* Glassy, luxurious overlay */}
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px]" />
          
          <div className="relative flex flex-col items-center text-center w-full">
            {collection.imageUrl ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-emerald-400/60 p-0.5 bg-slate-900 shadow-md mx-auto mb-3.5 transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image
                    src={collection.imageUrl}
                    alt={collection.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/15 shadow-md mx-auto mb-3.5 transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400 group-hover:bg-white/10">
                <FolderOpen className="w-9 h-9 text-emerald-400" />
              </div>
            )}

            <div className="h-[3.6rem] flex flex-col items-center justify-center px-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white/95 group-hover:text-emerald-400 leading-tight text-center line-clamp-2 transition-colors duration-300 tracking-wide font-sans">
                {collection.name}
              </h3>
              {collection.contributor && (
                <span className="text-[10px] text-slate-500 dark:text-white/50 font-semibold uppercase tracking-wider truncate mt-1 max-w-[150px]">
                  by {collection.contributor.name || collection.contributor.username}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer info wrapper */}
        <div className="flex items-center gap-2.5 text-xs text-emerald-400 px-4 py-3 bg-slate-50/90 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-white/5">
          <Boxes className="w-4.5 h-4.5 opacity-90 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 text-emerald-400" />
          <span className="font-semibold tracking-wider uppercase">
            {collection.itemCount ?? 0} {collection.itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </Link>
    </div>
  );
}
