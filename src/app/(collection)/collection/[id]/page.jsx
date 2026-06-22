"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MediaCard } from "@/components/public/MediaCard";
import { CollectionCard } from "@/components/public/CollectionCard";
import ShareModal from "@/components/public/ShareModal";
import FilterSidebar from "@/components/public/FilterBar";
import ArchiveViewManager from "@/components/public/ArchiveViewManager";
import { useSearch } from "@/lib/hooks/useSearch";
import { X } from "lucide-react";

// ✅ Premium dark glassmorphic skeleton card
function SkeletonCard() {
  return (
    <div className="animate-pulse border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl overflow-hidden shadow-sm aspect-[4/3] flex flex-col justify-between transition-colors duration-300">
      <div className="relative w-full aspect-[4/3] bg-slate-200/50 dark:bg-slate-950/80 p-6 flex flex-col items-center justify-center">
        {/* Thumbnail fallback skeleton */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-300 dark:bg-white/5 border border-slate-400/20 dark:border-white/10" />
        <div className="w-2/3 h-4 bg-slate-300 dark:bg-white/10 rounded-md mt-4" />
        <div className="w-1/2 h-3 bg-slate-200 dark:bg-white/5 rounded-md mt-2" />
      </div>
      <div className="h-10 bg-slate-100/80 dark:bg-slate-950/60 border-t border-slate-200 dark:border-white/5 px-4 py-3 flex items-center gap-2">
        <div className="w-4 h-4 bg-slate-300 dark:bg-white/5 rounded" />
        <div className="w-12 h-3 bg-slate-300 dark:bg-white/10 rounded" />
      </div>
    </div>
  );
}

export default function CollectionViewPage() {
  const { id } = useParams();

  const [collection, setCollection] = useState(null);
  const [subcollections, setSubcollections] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [shareUrl, setShareUrl] = useState(null);

  const [filtersOpen, setFiltersOpen] = useState(false);

  // 🔍 search + filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [filters, setFilters] = useState({
    mediaType: [],
    language: [],
    tags: [],
  });

  // ✅ Search params
  const searchParams = useMemo(
    () => ({
      query: submittedQuery,
      filters: { ...filters, collectionId: id },
    }),
    [submittedQuery, filters, id]
  );

  // ✅ Unified collection items memo (combining subfolders and media items)
  const combinedItems = useMemo(() => {
    const mappedSubs = subcollections.map((col) => ({ ...col, type: "collection" }));
    const mappedMedia = mediaItems.map((item) => ({ ...item, type: "media" }));
    return [...mappedSubs, ...mappedMedia];
  }, [subcollections, mediaItems]);

  // ✅ Hook for search + filter results
  const {
    results,
    loading: searchLoading,
    error: searchError,
    loadMore,
    hasMore,
  } = useSearch(searchParams);

  const loaderRef = useRef(null);

  // ✅ Infinite scroll observer
  useEffect(() => {
    if (!hasMore || searchLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, searchLoading, loadMore]);

  // ✅ Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery.trim());
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSubmittedQuery("");
  };

  const handleShare = (url) => setShareUrl(url);
  const closeShareModal = () => setShareUrl(null);

  // ✅ Fetch default collection data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [collectionRes, mediaRes, subsRes] = await Promise.all([
        fetch(`/api/public/collections/${id}`),
        fetch(`/api/public/media?collectionId=${id}`),
        fetch(`/api/public/collections?parentId=${id}`),
      ]);

      const [collectionData, mediaData, subsData] = await Promise.all([
        collectionRes.json(),
        mediaRes.json(),
        subsRes.json(),
      ]);

      setCollection(collectionData);
      setMediaItems(mediaData);
      setSubcollections(subsData);
    } catch (err) {
      console.error("Failed to load collection view", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // ✅ Breadcrumb builder
  const renderBreadcrumb = () => {
    const crumbs = [];
    let current = collection?.parent;
    while (current) {
      crumbs.unshift(current);
      current = current.parent;
    }
    return crumbs;
  };

  const breadcrumbsList = renderBreadcrumb();

  // ✅ Whether we’re in search/filter mode
  const inSearchMode = submittedQuery || filters.mediaType.length || filters.language.length || filters.tags.length;

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12 flex flex-col gap-6 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-white/5 rounded-md" />
        
        {/* Title Block Skeleton */}
        <div className="flex items-center gap-5 mb-8 bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/5 shrink-0" />
          <div className="space-y-2 flex-grow">
            <div className="h-6 w-1/4 bg-white/10 rounded-md" />
            <div className="h-4 w-2/3 bg-white/5 rounded-md" />
          </div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="max-w-xl mx-auto w-full h-12 bg-white/5 border border-white/5 rounded-xl mb-12" />

        {/* Results Skeleton */}
        <div className="flex gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block w-64 shrink-0 h-80 bg-white/[0.02] border border-white/5 rounded-2xl" />
          
          <div className="flex-grow">
            {/* Sort/Toggle Bar Skeleton */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
              <div className="h-8 w-40 bg-white/5 rounded-lg" />
              <div className="h-8 w-28 bg-white/5 rounded-lg" />
            </div>

            {/* Grid Loader */}
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }
  if (!collection) return <p className="text-muted-foreground p-8">Collection not found.</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 dark:text-white/50 mb-4 font-sans font-light">
        <Link href="/collection" className="hover:text-emerald-400 cursor-pointer transition-colors duration-150">Home</Link>
        {breadcrumbsList.map((crumb) => (
          <span key={crumb.id}>
            {" / "}
            <Link href={`/collection/${crumb.id}`} className="hover:text-emerald-400 cursor-pointer transition-colors duration-150">
              {crumb.name}
            </Link>
          </span>
        ))}
        <span className="text-emerald-400 font-normal">{" / "}{collection.name}</span>
      </div>

      {/* Title & Thumbnail */}
      <div className="flex items-center gap-5 mb-8 bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl p-5 backdrop-blur-md transition-colors duration-300">
        {collection.imageUrl && (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-slate-900 shrink-0 transition-colors duration-300">
            <Image
              src={collection.imageUrl}
              alt={collection.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-wide leading-tight">{collection.name}</h1>
          {collection.description && (
            <p className="text-sm sm:text-base text-slate-600 dark:text-white/60 font-light mt-1.5 leading-relaxed">{collection.description}</p>
          )}
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col lg:flex-row items-center justify-center gap-2.5 mb-12 max-w-xl mx-auto w-full px-4"
      >
        {/* Input */}
        <div className="relative flex-grow w-full">
          <input
            type="text"
            placeholder="Search in this collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-300 text-sm font-sans font-light"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-200 dark:bg-white/10 text-slate-850 dark:text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-slate-355 dark:hover:bg-white/20 hover:scale-105 transition-all cursor-pointer text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 w-full lg:w-auto justify-end lg:justify-start mt-2 lg:mt-0">
          <button
            type="submit"
            className="flex-1 lg:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-500/10 whitespace-nowrap text-sm"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex-1 lg:hidden px-6 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-md whitespace-nowrap text-sm"
          >
            Filters
          </button>
        </div>
      </form>


      {/* Mobile filter button */}
      {/* <div className="mb-6 lg:hidden flex justify-start">
        <button
          onClick={() => setFiltersOpen(true)}
          className="px-4 py-2 bg-primary text-white lg:hidden rounded-lg hover:bg-primary/90"
        >
          Filters
        </button>
      </div> */}

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <div className="hidden lg:block">
          <FilterSidebar activeFilters={filters} onChange={setFilters} />
        </div>

        {/* Results */}
        <div className="flex-1">
          {inSearchMode ? (
            <>
              {searchError && <p className="text-red-500">{searchError}</p>}

              {submittedQuery && (
                <p className="text-left text-muted-foreground mb-8">
                  Showing results for{" "}
                  <span className="text-primary">"{submittedQuery}"</span>
                </p>
              )}

              {/* Initial loading */}
              {searchLoading && results.length === 0 && (
                <div className="grid gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full animate-fadeIn">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!searchLoading && results.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No results found in this collection.
                </p>
              )}

              {/* Results views (Grid, List, Table) */}
              {results.length > 0 && (
                <ArchiveViewManager
                  items={results}
                  onShare={handleShare}
                  isLoading={searchLoading}
                />
              )}

              {/* Scroll skeletons */}
              {searchLoading && results.length > 0 && (
                <div className="grid gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full mt-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={`s-${i}`} />
                  ))}
                </div>
              )}

              {/* Observer target */}
              {hasMore && !searchLoading && (
                <div ref={loaderRef} className="h-10" />
              )}
            </>
          ) : (
            /* 🔙 Default unified collection view mode */
            <ArchiveViewManager
              items={combinedItems}
              onShare={handleShare}
              isLoading={loading}
            />
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          {/* Panel */}
          <div className="relative ml-auto w-72 max-w-full bg-background border-l border-slate-200 dark:border-white/10 h-full shadow-2xl p-6 overflow-y-auto text-foreground transition-colors duration-300">
            <button
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-650 dark:text-white/70 hover:text-slate-900 hover:dark:text-white transition-colors cursor-pointer"
              onClick={() => setFiltersOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mt-8">
              <FilterSidebar activeFilters={filters} onChange={setFilters} />
            </div>
          </div>
        </div>
      )}

      {shareUrl && <ShareModal url={shareUrl} onClose={closeShareModal} />}
    </main>
  );
}
