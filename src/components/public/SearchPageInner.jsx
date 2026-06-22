"use client";

import CardWrapper from "@/components/public/CardWrapper";
import { CollectionCard } from "@/components/public/CollectionCard";
import FilterSidebar from "@/components/public/FilterBar";
import { MediaCard } from "@/components/public/MediaCard";
import ShareModal from "@/components/public/ShareModal";
import ArchiveViewManager from "@/components/public/ArchiveViewManager";
import { useSearch } from "@/lib/hooks/useSearch";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";

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

export default function SearchPageInner({ initialQuery }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shareUrl, setShareUrl] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile sidebar toggle

  // ✅ Initial query
  const urlQuery = searchParams.get("q") || initialQuery || "";
  const [inputValue, setInputValue] = useState(urlQuery);

  // ✅ Filters state
  const [filters, setFilters] = useState({
    mediaType: [],
    language: [],
    tags: [],
  });

  // ✅ Final search params passed into hook
  const searchParamsMemo = useMemo(
    () => ({
      query: urlQuery,
      filters,
    }),
    [urlQuery, filters]
  );

  const { results, loading, error, loadMore, hasMore } =
    useSearch(searchParamsMemo);

  const loaderRef = useRef(null);

  // ✅ Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, loading, loadMore]);

  // ✅ When user types + submits, update URL
  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
  };

  const handleShare = (url) => setShareUrl(url);
  const closeShareModal = () => setShareUrl(null);

  // ✅ Sync input field if URL changes
  useEffect(() => {
    setInputValue(urlQuery);
  }, [urlQuery]);

  return (
    <div className="w-full py-6">
      <div className="max-w-7xl mx-auto">
        {/* 🔍 Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col lg:flex-row items-center justify-center gap-2.5 mb-8 max-w-xl mx-auto w-full px-4"
        >
          <div className="relative flex-grow w-full">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search the archive..."
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-300 text-sm font-sans font-light"
            />
          </div>

          {/* Buttons row */}
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
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="flex gap-8 mt-8">
        {/* Sidebar (desktop) */}
        <div className="hidden lg:block">
          <FilterSidebar activeFilters={filters} onChange={setFilters} />
        </div>

        {/* Results */}
        <div className="flex-1">
          {urlQuery && (
            <p className="text-center text-muted-foreground mb-8">
              Showing results for{" "}
              <span className="text-primary">"{urlQuery}"</span>
            </p>
          )}

          {/* Initial loading skeletons */}
          {loading && results.length === 0 && (
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full animate-fadeIn">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && results.length === 0 && urlQuery && (
            <p className="text-center text-muted-foreground">
              No results found.
            </p>
          )}

          {/* Results views (Grid, List, Table) */}
          {results.length > 0 && (
            <ArchiveViewManager
              items={results}
              onShare={handleShare}
              isLoading={loading}
            />
          )}

          {/* Infinite scroll skeletons */}
          {loading &&
            results.length > 0 && (
              <div className="grid gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full mt-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={`s-${i}`} />
                ))}
              </div>
            )}

          {/* Observer target */}
          {hasMore && !loading && <div ref={loaderRef} className="h-10" />}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="relative ml-auto w-72 max-w-full h-full bg-background border-l border-slate-200 dark:border-white/10 shadow-2xl p-6 overflow-y-auto text-foreground transition-colors duration-300">
            <button
              onClick={() => setFiltersOpen(false)}
              className="mb-4 flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 hover:dark:text-white transition-colors cursor-pointer text-sm font-semibold"
            >
              ✕ Close
            </button>
            <div className="mt-4">
              <FilterSidebar activeFilters={filters} onChange={setFilters} />
            </div>
          </div>
        </div>
      )}

      {shareUrl && <ShareModal url={shareUrl} onClose={closeShareModal} />}
    </div>
  );
}
