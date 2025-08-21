'use client';

/**
 * PdfReader.jsx — SSR-safe, version-stable, robust PDF reader + flipbook
 * - Next.js (JSX), Tailwind, Framer Motion, lucide-react
 * - Loads pdfjs-dist via dynamic import on the client to avoid SSR (DOMMatrix) issues
 * - Worker version is enforced to match the installed package via local file in /public
 * - Scroll & Flipbook modes, thumbnails, zoom, fullscreen, caching + render queue
 *
 * Drop-in usage:
 *   import dynamic from 'next/dynamic';
 *   const PdfReader = dynamic(() => import('./PdfReader'), { ssr: false });
 *   <PdfReader fileUrl={url} initialMode="scroll" className="h-[calc(100vh-4rem)]" />
 *
 * Required setup:
 *   npm i pdfjs-dist framer-motion lucide-react react-pageflip
 *   # Copy the worker matching your installed pdfjs-dist version to /public
 *   cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.mjs
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Loader2, BookOpen, Scroll, ChevronLeft, ChevronRight, Images, Grid } from 'lucide-react';

// -------- Utility: LRU Cache for rendered page bitmaps (Blob URLs) --------
class LRU {
  constructor(limit = 80) {
    this.limit = limit;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return undefined;
    const v = this.map.get(key);
    this.map.delete(key); // bump recency
    this.map.set(key, v);
    return v;
  }
  set(key, val) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, val);
    if (this.map.size > this.limit) {
      const oldest = this.map.keys().next().value;
      const v = this.map.get(oldest);
      if (v?.type === 'objectURL' && v.url) URL.revokeObjectURL(v.url);
      this.map.delete(oldest);
    }
  }
  clear() {
    for (const [, v] of this.map) if (v?.type === 'objectURL' && v.url) URL.revokeObjectURL(v.url);
    this.map.clear();
  }
}

// -------- Utility: Small render queue to avoid jank --------
class RenderQueue {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.queue = [];
    this.active = 0;
  }
  push(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this._next();
    });
  }
  _next() {
    if (this.active >= this.concurrency) return;
    const item = this.queue.shift();
    if (!item) return;
    this.active++;
    Promise.resolve()
      .then(item.task)
      .then(item.resolve, item.reject)
      .finally(() => {
        this.active--;
        this._next();
      });
  }
  clear() { this.queue = []; }
}

// -------- Lazy flipbook import (client only) --------
let FlipBookLazy = null;
const ensureFlipbook = async () => {
  if (FlipBookLazy) return FlipBookLazy;
  const mod = await import('react-pageflip');
  FlipBookLazy = mod.default || mod.HTMLFlipBook || mod;
  return FlipBookLazy;
};

export default function PdfReader({ fileUrl, initialMode = 'scroll', className = '' }) {
  const containerRef = useRef(null);

  // pdf.js module + doc are kept in refs to avoid rerenders
  const pdfjsRef = useRef(null); // the module (from dynamic import)
  const pdfDocRef = useRef(null); // loaded PDFDocumentProxy

  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState(initialMode === 'flip' ? 'flip' : 'scroll');
  const [scale, setScale] = useState(1.2);
  const [currentPage, setCurrentPage] = useState(1);
  const [showThumbs, setShowThumbs] = useState(true);

  const cacheRef = useRef(new LRU(80));
  const queueRef = useRef(new RenderQueue(2));

  // -------- Load pdfjs-dist (client-only) and the document --------
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // Load pdfjs on client only
        const pdfjs = await import('pdfjs-dist/build/pdf');
        // Enforce worker version to match installed package (use local copy)
        if (pdfjs?.GlobalWorkerOptions) {
          pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
        }
        pdfjsRef.current = pdfjs;

        // Load the PDF document
        const task = pdfjs.getDocument({ url: fileUrl });
        const pdf = await task.promise;
        if (cancelled) return;
        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load PDF');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [fileUrl]);

  // -------- Fullscreen helpers --------
  const enterFull = useCallback(() => {
    const el = containerRef.current; if (!el) return; if (document.fullscreenElement) return; el.requestFullscreen?.();
  }, []);
  const exitFull = useCallback(() => { if (document.fullscreenElement) document.exitFullscreen?.(); }, []);
  const toggleFull = useCallback(() => { document.fullscreenElement ? exitFull() : enterFull(); }, [enterFull, exitFull]);

  // -------- Page render -> Blob URL (cached) --------
  const renderPageToURL = useCallback(async (pageNum, targetScale) => {
    const key = `${pageNum}@${targetScale.toFixed(2)}`;
    const cached = cacheRef.current.get(key);
    if (cached) return cached.url;

    const pdf = pdfDocRef.current; if (!pdf) return null;
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: targetScale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.9));
    const url = URL.createObjectURL(blob);
    cacheRef.current.set(key, { type: 'objectURL', url, w: canvas.width, h: canvas.height });
    return url;
  }, []);

  // -------- Preload neighbors for smoothness --------
  const warmNeighbors = useCallback((center, targetScale) => {
    const max = numPages;
    const toWarm = [center - 2, center - 1, center + 1, center + 2].filter(n => n >= 1 && n <= max);
    toWarm.forEach((n) => { queueRef.current.push(() => renderPageToURL(n, targetScale)); });
  }, [numPages, renderPageToURL]);

  // -------- Zoom helpers --------
  const clampZoom = (z) => Math.min(3.0, Math.max(0.5, z));
  const zoomIn = () => setScale((z) => clampZoom(z + 0.1));
  const zoomOut = () => setScale((z) => clampZoom(z - 0.1));
  const resetZoom = () => setScale(1.2);

  // -------- Keyboard shortcuts --------
  useEffect(() => {
    const onKey = (e) => {
      if (e.target?.tagName === 'INPUT' || e.target?.tagName === 'TEXTAREA') return;
      if (e.key === '+') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === 'f') toggleFull();
      if (e.key === 'm') setMode((m) => (m === 'scroll' ? 'flip' : 'scroll'));
      if (e.key === 'ArrowRight') setCurrentPage((p) => Math.min(p + 1, numPages));
      if (e.key === 'ArrowLeft') setCurrentPage((p) => Math.max(p - 1, 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [numPages, toggleFull]);

  // -------- Visible window (scroll mode) --------
  const visiblePages = useMemo(() => {
    const start = Math.max(1, currentPage - 3);
    const end = Math.min(numPages, currentPage + 3);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, numPages]);

  useEffect(() => { if (numPages) warmNeighbors(currentPage, scale); }, [currentPage, scale, numPages, warmNeighbors]);
  const goToPage = (n) => setCurrentPage(() => Math.min(Math.max(1, n), numPages));

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-2 text-sm text-neutral-500"><Loader2 className="size-4 animate-spin"/> Loading PDF…</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-red-600">{String(error)}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative w-full bg-neutral-50 dark:bg-neutral-950 ${className}`}>
      <Toolbar
        mode={mode}
        setMode={setMode}
        scale={scale}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
        isFullscreen={!!document.fullscreenElement}
        toggleFull={toggleFull}
        current={currentPage}
        total={numPages}
        onPrev={() => goToPage(currentPage - 1)}
        onNext={() => goToPage(currentPage + 1)}
        showThumbs={showThumbs}
        setShowThumbs={setShowThumbs}
      />

      <div className="flex h-full">
        {/* Thumbnails (lg+) */}
        <AnimatePresence initial={false}>
          {showThumbs && (
            <motion.aside
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -16, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="hidden lg:flex w-52 shrink-0 border-r border-neutral-200 dark:border-neutral-800 p-2 overflow-y-auto bg-white/70 dark:bg-neutral-900/70 backdrop-blur"
            >
              <ThumbnailStrip
                numPages={numPages}
                currentPage={currentPage}
                onSelect={goToPage}
                renderPageToURL={renderPageToURL}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main stage */}
        <div className="flex-1 overflow-hidden">
          {mode === 'scroll' ? (
            <ScrollView
              visiblePages={visiblePages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              numPages={numPages}
              scale={scale}
              renderPageToURL={renderPageToURL}
            />
          ) : (
            <FlipbookView
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              numPages={numPages}
              scale={scale}
              renderPageToURL={renderPageToURL}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Toolbar({ mode, setMode, scale, zoomIn, zoomOut, resetZoom, isFullscreen, toggleFull, current, total, onPrev, onNext, showThumbs, setShowThumbs }) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-3 py-2">
      <button className="px-2 py-1 rounded-xl border hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={() => setMode(mode === 'scroll' ? 'flip' : 'scroll')}>
        <div className="flex items-center gap-2 text-sm">{mode === 'scroll' ? <BookOpen className="size-4"/> : <Scroll className="size-4"/>} {mode === 'scroll' ? 'Flipbook' : 'Scroll'}</div>
      </button>

      <div className="mx-2 h-6 w-px bg-neutral-200 dark:bg-neutral-800"/>

      <button className="px-2 py-1 rounded-xl border hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={zoomOut}><div className="flex items-center gap-2 text-sm"><ZoomOut className="size-4"/> Zoom out</div></button>
      <span className="text-sm tabular-nums w-14 text-center">{Math.round(scale * 100)}%</span>
      <button className="px-2 py-1 rounded-xl border hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={zoomIn}><div className="flex items-center gap-2 text-sm"><ZoomIn className="size-4"/> Zoom in</div></button>
      <button className="px-2 py-1 rounded-xl border hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={resetZoom}><div className="flex items-center gap-2 text-sm"><Images className="size-4"/> Reset</div></button>

      <div className="mx-2 h-6 w-px bg-neutral-200 dark:bg-neutral-800"/>

      <button className="px-2 py-1 rounded-xl border hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={onPrev}><div className="flex items-center gap-2 text-sm"><ChevronLeft className="size-4"/> Prev</div></button>
      <span className="text-sm tabular-nums">{current} / {total}</span>
      <button className="px-2 py-1 rounded-xl border hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={onNext}><div className="flex items-center gap-2 text-sm">Next <ChevronRight className="size-4"/></div></button>

      <div className="mx-2 h-6 w-px bg-neutral-200 dark:bg-neutral-800"/>

      <button className="px-2 py-1 rounded-xl border hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={() => setShowThumbs((v) => !v)}>
        <div className="flex items-center gap-2 text-sm"><Grid className="size-4"/> {showThumbs ? 'Hide thumbnails' : 'Show thumbnails'}</div>
      </button>

      <div className="flex-1"/>

      <button className="px-2 py-1 rounded-xl border hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={toggleFull}>
        <div className="flex items-center gap-2 text-sm">{isFullscreen ? <Minimize2 className="size-4"/> : <Maximize2 className="size-4"/>} Fullscreen</div>
      </button>
    </div>
  );
}

function ScrollView({ visiblePages, currentPage, setCurrentPage, numPages, scale, renderPageToURL }) {
  const scrollerRef = useRef(null);

  // Scroll into view when page changes
  useEffect(() => {
    const container = scrollerRef.current; if (!container) return;
    const el = container.querySelector(`[data-page="${currentPage}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentPage]);

  // Track which page is centered
  useEffect(() => {
    const container = scrollerRef.current; if (!container) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const children = Array.from(container.querySelectorAll('[data-page]'));
        const center = container.getBoundingClientRect().top + container.clientHeight / 2;
        let best = { dist: Infinity, page: currentPage };
        for (const c of children) {
          const r = c.getBoundingClientRect();
          const mid = (r.top + r.bottom) / 2;
          const d = Math.abs(mid - center);
          const p = parseInt(c.getAttribute('data-page'));
          if (d < best.dist) best = { dist: d, page: p };
        }
        if (best.page !== currentPage) setCurrentPage(best.page);
      });
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [currentPage, setCurrentPage]);

  return (
    <div ref={scrollerRef} className="h-full overflow-y-auto px-3 pb-12">
      <div className="mx-auto max-w-[1100px]">
        {Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
          <PageSlot key={n} n={n} active={visiblePages.includes(n)} scale={scale} renderPageToURL={renderPageToURL} />
        ))}
      </div>
    </div>
  );
}

function PageSlot({ n, active, scale, renderPageToURL }) {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!active) return () => {};
    setLoading(true);
    (async () => {
      try { const u = await renderPageToURL(n, scale); if (!cancelled) setUrl(u); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [n, active, scale, renderPageToURL]);

  return (
    <div data-page={n} className="my-4 flex items-center justify-center">
      <div className="rounded-2xl overflow-hidden shadow-sm border bg-white">
        {loading && (
          <div className="flex items-center justify-center h-64 w-[46rem] max-w-full text-sm text-neutral-500"><Loader2 className="size-4 animate-spin mr-2"/> Rendering page {n}…</div>
        )}
        {url && <img src={url} alt={`Page ${n}`} className="block w-full h-auto select-none" draggable={false} />}
      </div>
    </div>
  );
}

function ThumbnailStrip({ numPages, currentPage, onSelect, renderPageToURL }) {
  return (
    <div className="grid grid-cols-1 gap-2 w-full">
      {Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
        <Thumb key={n} n={n} active={n === currentPage} onClick={() => onSelect(n)} renderPageToURL={renderPageToURL} />
      ))}
    </div>
  );
}

function Thumb({ n, active, onClick, renderPageToURL }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const u = await renderPageToURL(n, 0.25);
      if (!cancelled) setUrl(u);
    })();
    return () => { cancelled = true; };
  }, [n, renderPageToURL]);

  return (
    <button onClick={onClick} className={`relative w-full rounded-xl overflow-hidden border ${active ? 'ring-2 ring-blue-500 border-blue-500' : 'border-neutral-200 dark:border-neutral-800'} bg-white hover:shadow` }>
      {url ? (
        <img src={url} alt={`Thumb ${n}`} className="w-full h-auto block"/>
      ) : (
        <div className="aspect-[3/4] w-full flex items-center justify-center text-xs text-neutral-500"><Loader2 className="size-3 animate-spin mr-2"/> {n}</div>
      )}
      <span className="absolute bottom-1 right-2 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded-md">{n}</span>
    </button>
  );
}

function FlipbookView({ currentPage, setCurrentPage, numPages, scale, renderPageToURL }) {
  const [FB, setFB] = useState(null);
  const bookRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => { const Comp = await ensureFlipbook(); if (!cancelled) setFB(() => Comp); })();
    return () => { cancelled = true; };
  }, []);

  const [pageUrls, setPageUrls] = useState({});
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const center = currentPage;
      const order = [center, center + 1, center - 1, center + 2, center - 2].filter(n => n >= 1 && n <= numPages);
      for (const n of order) {
        if (cancelled) break;
        if (!pageUrls[n]) {
          const u = await renderPageToURL(n, scale);
          if (!cancelled) setPageUrls((s) => ({ ...s, [n]: u }));
        }
      }
    })();
    return () => { cancelled = true; };
  }, [currentPage, numPages, scale, renderPageToURL]);

  // Sync external page when user flips
  useEffect(() => {
    const inst = bookRef.current; if (!inst || !inst.pageFlip) return;
    const pf = inst.pageFlip();
    const onFlip = (e) => { const p = (e?.data || 0) + 1; setCurrentPage(p); };
    pf.on('flip', onFlip);
    return () => pf.off('flip', onFlip);
  }, [bookRef.current]);

  // When currentPage changes externally, move flipbook
  useEffect(() => {
    const inst = bookRef.current; if (!inst || !inst.pageFlip) return;
    const pf = inst.pageFlip();
    const target = Math.max(0, Math.min(numPages - 1, currentPage - 1));
    if (pf.getCurrentPageIndex() !== target) pf.flip(target);
  }, [currentPage, numPages]);

  if (!FB) return (<div className="h-full flex items-center justify-center"><Loader2 className="size-4 animate-spin mr-2"/> Loading flipbook…</div>);

  return (
    <div className="h-full overflow-auto">
      <FB
        width={Math.round(520 * scale)}
        height={Math.round(700 * scale)}
        size="stretch"
        minWidth={315}
        maxWidth={2200}
        minHeight={400}
        maxHeight={3000}
        showCover={false}
        mobileScrollSupport={true}
        className="mx-auto my-6 shadow rounded-xl overflow-hidden border bg-white"
        ref={bookRef}
      >
        {Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
          <div key={n} className="bg-white flex items-center justify-center">
            {pageUrls[n] ? (
              <img src={pageUrls[n]} alt={`Page ${n}`} className="block w-full h-auto select-none" draggable={false} />
            ) : (
              <div className="w-[520px] h-[700px] flex items-center justify-center text-sm text-neutral-500"><Loader2 className="size-4 animate-spin mr-2"/> Page {n}</div>
            )}
          </div>
        ))}
      </FB>
    </div>
  );
}
