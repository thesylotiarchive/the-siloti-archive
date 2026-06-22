"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List,
  Table as TableIcon,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  FolderOpen,
  Music,
  Film,
  FileText,
  Image as ImageIcon,
  Boxes,
  Eye,
  Heart,
  MessageCircle,
  Share2
} from "lucide-react";
import { CollectionCard } from "@/components/public/CollectionCard";
import { MediaCard } from "@/components/public/MediaCard";
import { ArchiveThumbnail } from "@/components/public/ArchiveThumbnail";

// Helpers
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return "N/A";
  }
};

const getFallbackIcon = (type, mediaType) => {
  const iconClass = "w-10 h-10 text-brand-gold/80";
  if (type === "collection") {
    return <FolderOpen className={iconClass} />;
  }
  switch (mediaType) {
    case "AUDIO":
      return <Music className={iconClass} />;
    case "VIDEO":
      return <Film className={iconClass} />;
    case "DOCUMENT":
      return <FileText className={iconClass} />;
    default:
      return <ImageIcon className={iconClass} />;
  }
};

const getTypeBadge = (type, mediaType) => {
  if (type === "collection") {
    return (
      <span className="text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30 text-emerald-400 bg-emerald-500/5 px-2.5 py-0.5 rounded-full">
        Collection
      </span>
    );
  }
  const typeStr = mediaType || "item";
  return (
    <span className="text-[10px] font-bold tracking-wider uppercase border border-amber-500/25 text-amber-400 bg-amber-500/5 px-2.5 py-0.5 rounded-full">
      {typeStr.toLowerCase()}
    </span>
  );
};

export default function ArchiveViewManager({ items = [], onShare, isLoading }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("createdAt-desc");

  // Sync with localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedView = localStorage.getItem("archiveViewMode");
    if (savedView && ["grid", "list", "table"].includes(savedView)) {
      setViewMode(savedView);
    }
  }, []);

  // Update view mode and localStorage
  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("archiveViewMode", mode);
  };

  // Client-side sorting logic
  const sortedItems = useMemo(() => {
    const itemsCopy = [...items];
    return itemsCopy.sort((a, b) => {
      const aTitle = a.title || a.name || "";
      const bTitle = b.title || b.name || "";
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const aViews = a.views || 0;
      const bViews = b.views || 0;

      switch (sortBy) {
        case "createdAt-desc":
          return bDate - aDate;
        case "createdAt-asc":
          return aDate - bDate;
        case "title-asc":
          return aTitle.localeCompare(bTitle, undefined, { sensitivity: "base" });
        case "title-desc":
          return bTitle.localeCompare(aTitle, undefined, { sensitivity: "base" });
        case "views-desc":
          return bViews - aViews;
        case "views-asc":
          return aViews - bViews;
        default:
          return 0;
      }
    });
  }, [items, sortBy]);

  // Headers sorting for TableView
  const handleHeaderSort = (field) => {
    if (field === "title") {
      setSortBy((prev) => (prev === "title-asc" ? "title-desc" : "title-asc"));
    } else if (field === "creator") {
      // Custom mapping sort could be title/author, let's toggle title
      setSortBy((prev) => (prev === "title-asc" ? "title-desc" : "title-asc"));
    } else if (field === "published") {
      setSortBy((prev) => (prev === "createdAt-desc" ? "createdAt-asc" : "createdAt-desc"));
    } else if (field === "views") {
      setSortBy((prev) => (prev === "views-desc" ? "views-asc" : "views-desc"));
    }
  };

  // Helper to show column sorting icons
  const getSortIcon = (field) => {
    const iconClass = "w-4 h-4 ml-1 inline-block text-neutral-400 dark:text-neutral-500";
    if (field === "title") {
      if (sortBy === "title-asc") return <ChevronUp className={iconClass} />;
      if (sortBy === "title-desc") return <ChevronDown className={iconClass} />;
    } else if (field === "published") {
      if (sortBy === "createdAt-asc") return <ChevronUp className={iconClass} />;
      if (sortBy === "createdAt-desc") return <ChevronDown className={iconClass} />;
    } else if (field === "views") {
      if (sortBy === "views-asc") return <ChevronUp className={iconClass} />;
      if (sortBy === "views-desc") return <ChevronDown className={iconClass} />;
    }
    return <ChevronsUpDown className={iconClass} />;
  };

  const activeViewClass = "bg-emerald-400 text-slate-950 font-bold border-emerald-400 shadow-lg scale-105 shadow-emerald-400/10";
  const inactiveViewClass = "text-slate-500 dark:text-white/45 hover:bg-slate-100 dark:hover:bg-white/5 border-transparent hover:text-slate-800 dark:hover:text-white transition-all";

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* VIEW TOGGLE BAR */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
        {/* Left Side: Sort Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto font-sans">
          <label htmlFor="archive-sort-select" className="text-sm font-semibold tracking-wide text-slate-500 dark:text-white/45 shrink-0">
            Sort by:
          </label>
          <select
            id="archive-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cursor-pointer bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-emerald-400 text-slate-700 dark:text-white/80 shadow-sm transition-all duration-200"
          >
            <option value="createdAt-desc" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-white">Newest Added</option>
            <option value="createdAt-asc" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-white">Oldest Added</option>
            <option value="title-asc" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-white">Title (A-Z)</option>
            <option value="title-desc" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-white">Title (Z-A)</option>
            <option value="views-desc" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-white">Most Viewed</option>
            <option value="views-asc" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-white">Least Viewed</option>
          </select>
        </div>

        {/* Right Side: View Layout Buttons */}
        <div className="flex items-center bg-slate-100 dark:bg-white/5 p-1.5 rounded-xl border border-slate-200 dark:border-white/5 w-fit self-end sm:self-auto shadow-inner">
          <button
            onClick={() => handleViewChange("grid")}
            className={`cursor-pointer flex items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
              viewMode === "grid" ? activeViewClass : inactiveViewClass
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => handleViewChange("list")}
            className={`cursor-pointer flex items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
              viewMode === "list" ? activeViewClass : inactiveViewClass
            }`}
            title="List View"
          >
            <List className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => handleViewChange("table")}
            className={`cursor-pointer flex items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
              viewMode === "table" ? activeViewClass : inactiveViewClass
            }`}
            title="Table View"
          >
            <TableIcon className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* RENDERED VIEW */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          {sortedItems.length === 0 ? (
            <div className="text-center py-20 text-slate-500 dark:text-neutral-400">
              No items match the selected archive filters.
            </div>
          ) : viewMode === "grid" ? (
            /* VIEW 1: GridView */
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full">
              {sortedItems.map((item) =>
                item.type === "collection" ? (
                  <CollectionCard key={`c-${item.id}`} collection={item} />
                ) : (
                  <MediaCard
                    key={`m-${item.id}`}
                    mediaItem={item}
                    onShare={onShare}
                  />
                )
              )}
            </div>
          ) : viewMode === "list" ? (
            /* VIEW 2: ListView */
            <div className="flex flex-col w-full bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 rounded-[2rem] p-4 sm:p-6 shadow-xl backdrop-blur-md transition-colors duration-300">
              {sortedItems.map((item, idx) => {
                const isCollection = item.type === "collection";
                const itemLink = isCollection ? `/collection/${item.id}` : `/media/${item.id}`;
                const thumbnailSrc = isCollection ? item.imageUrl : (item.mediaType === "IMAGE" ? (item.image || item.fileUrl) : item.image);

                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-5 border-b border-slate-200/60 dark:border-white/5 last:border-b-0 items-start group"
                  >
                    {/* Thumbnail on left */}
                    <Link
                      href={itemLink}
                      target={isCollection ? "_self" : "_blank"}
                      rel={isCollection ? "" : "noopener noreferrer"}
                      className="cursor-pointer w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden relative border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 flex items-center justify-center shadow-inner hover:border-emerald-400/50 transition-all duration-300"
                    >
                      <ArchiveThumbnail
                        src={thumbnailSrc}
                        title={item.title || item.name}
                        mediaType={isCollection ? "COLLECTION" : item.mediaType}
                        className="w-full h-full"
                        size="md"
                      />
                    </Link>

                    {/* Right side content */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        {/* Title link */}
                        <Link
                          href={itemLink}
                          target={isCollection ? "_self" : "_blank"}
                          rel={isCollection ? "" : "noopener noreferrer"}
                          className="cursor-pointer text-base sm:text-lg font-bold text-slate-800 dark:text-white/95 hover:text-emerald-400 transition-colors duration-200 line-clamp-1 leading-snug tracking-wide"
                        >
                          {item.title || item.name}
                        </Link>
                        {/* Type Badge */}
                        <div className="shrink-0">
                          {getTypeBadge(item.type, item.mediaType)}
                        </div>
                      </div>

                      {/* Author */}
                      {item.contributor && (
                        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          by {item.contributor.name || item.contributor.username}
                        </div>
                      )}

                      {/* Published date + view count */}
                      <div className="text-xs text-slate-500 dark:text-white/45 font-medium flex items-center gap-1.5">
                        <span>Published {formatDate(item.createdAt)}</span>
                        {!isCollection && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-slate-400 dark:text-white/45" />
                              {item.views || 0} views
                            </span>
                          </>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-650 dark:text-white/60 line-clamp-2 sm:line-clamp-3 leading-relaxed mt-1 font-light">
                        {item.description || "No description provided."}
                      </p>

                      {/* Topic/Tag Pills & Collection Links */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {/* Collection Link */}
                        {!isCollection && item.folder && (
                          <Link
                            href={`/collection/${item.folder.id}`}
                            className="cursor-pointer text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:underline flex items-center gap-1"
                          >
                            <Boxes className="w-3.5 h-3.5" />
                            in {item.folder.name}
                          </Link>
                        )}

                        {/* Tag Pills */}
                        {!isCollection && item.tags && item.tags.map((tag) => (
                          <Link
                            key={tag.id}
                            href={`/search?tags=${encodeURIComponent(tag.name)}`}
                            className="cursor-pointer text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-400/20 hover:bg-emerald-400 hover:text-slate-950 transition-all duration-200"
                          >
                            #{tag.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* VIEW 3: TableView */
            <div className="overflow-x-auto w-full border border-slate-200 dark:border-white/10 rounded-[2rem] bg-white/80 dark:bg-slate-900/40 shadow-xl backdrop-blur-md transition-colors duration-300">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60">
                    <th className="px-4 py-4 text-[11px] font-bold text-slate-500 dark:text-white/55 uppercase tracking-wider w-16">
                      Thum
                    </th>
                    <th
                      onClick={() => handleHeaderSort("title")}
                      className="cursor-pointer px-4 py-4 text-[11px] font-bold text-slate-500 dark:text-white/55 uppercase tracking-wider hover:text-emerald-400 select-none transition-colors duration-200"
                    >
                      Title {getSortIcon("title")}
                    </th>
                    <th
                      onClick={() => handleHeaderSort("creator")}
                      className="cursor-pointer px-4 py-4 text-[11px] font-bold text-slate-500 dark:text-white/55 uppercase tracking-wider hover:text-emerald-400 select-none transition-colors duration-200"
                    >
                      Creator
                    </th>
                    <th
                      onClick={() => handleHeaderSort("published")}
                      className="cursor-pointer px-4 py-4 text-[11px] font-bold text-slate-500 dark:text-white/55 uppercase tracking-wider hover:text-emerald-400 select-none transition-colors duration-200"
                    >
                      Published {getSortIcon("published")}
                    </th>
                    <th className="px-4 py-4 text-[11px] font-bold text-slate-500 dark:text-white/55 uppercase tracking-wider">
                      Type
                    </th>
                    <th
                      onClick={() => handleHeaderSort("views")}
                      className="cursor-pointer px-4 py-4 text-[11px] font-bold text-slate-500 dark:text-white/55 uppercase tracking-wider text-right pr-6 hover:text-emerald-400 select-none transition-colors duration-200"
                    >
                      Views {getSortIcon("views")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item) => {
                    const isCollection = item.type === "collection";
                    const itemLink = isCollection ? `/collection/${item.id}` : `/media/${item.id}`;
                    const thumbnailSrc = isCollection ? item.imageUrl : (item.mediaType === "IMAGE" ? (item.image || item.fileUrl) : item.image);

                    return (
                      <tr
                        key={`${item.type}-${item.id}`}
                        className="border-b border-slate-200/60 dark:border-white/5 last:border-b-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200 group"
                      >
                        {/* Thumbnail */}
                        <td className="px-4 py-3">
                          <Link
                            href={itemLink}
                            target={isCollection ? "_self" : "_blank"}
                            rel={isCollection ? "" : "noopener noreferrer"}
                            className="cursor-pointer block w-10 h-10 rounded-lg overflow-hidden relative border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 flex items-center justify-center shadow-inner hover:border-emerald-400/65 transition-all duration-200"
                          >
                            <ArchiveThumbnail
                              src={thumbnailSrc}
                              title={item.title || item.name}
                              mediaType={isCollection ? "COLLECTION" : item.mediaType}
                              className="w-full h-full"
                              size="sm"
                            />
                          </Link>
                        </td>

                        {/* Title */}
                        <td className="px-4 py-3">
                          <Link
                            href={itemLink}
                            target={isCollection ? "_self" : "_blank"}
                            rel={isCollection ? "" : "noopener noreferrer"}
                            className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-white/90 hover:text-emerald-400 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-1 max-w-[250px]"
                          >
                            {item.title || item.name}
                          </Link>
                        </td>

                        {/* Creator */}
                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-white/65 font-medium">
                          {item.contributor ? (item.contributor.name || item.contributor.username) : "Siloti Archive"}
                        </td>

                        {/* Published */}
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-white/45">
                          {formatDate(item.createdAt)}
                        </td>

                        {/* Type Badge */}
                        <td className="px-4 py-3">
                          {getTypeBadge(item.type, item.mediaType)}
                        </td>

                        {/* Weekly Views */}
                        <td className="px-4 py-3 text-right pr-6 text-sm font-semibold text-slate-800 dark:text-white/90">
                          {isCollection ? (
                            <span className="text-slate-500 dark:text-white/40 font-normal text-xs uppercase tracking-wide">
                              {item.itemCount || 0} items
                            </span>
                          ) : (
                            <span>{item.views || 0}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
