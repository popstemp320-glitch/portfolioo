import React, { useRef, useState, useEffect, useMemo } from 'react';
import { PhotoAsset } from '../types';
import { PlaceholderArtwork } from '../components/PlaceholderArtwork';
import { ArrowLeft, Film, Grid, Columns, Sparkles, SlidersHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';

interface EngagementsViewProps {
  photos: PhotoAsset[];
  onBack: () => void;
  onSelectPhoto: (photo: PhotoAsset) => void;
  onSetCursorMode?: (mode: 'default' | 'view' | 'drag-horizontal' | 'zoom' | 'link', text?: string) => void;
}

export const EngagementsView: React.FC<EngagementsViewProps> = ({
  photos,
  onBack,
  onSelectPhoto,
  onSetCursorMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'single-strip' | 'light-table'>('single-strip');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);

  // Velocity inertia for drag release
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // 130 engagement photos
  const engagementPhotos = useMemo(() => {
    return photos.filter((p) => p.collection === 'engagements');
  }, [photos]);

  // Handle horizontal mouse wheel scroll
  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode === 'single-strip' && containerRef.current) {
      containerRef.current.scrollLeft += e.deltaY * 1.35;
    }
  };

  // Drag physics with momentum
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || viewMode !== 'single-strip') return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftPos(containerRef.current.scrollLeft);
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || viewMode !== 'single-strip') return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    containerRef.current.scrollLeft = scrollLeftPos - walk;

    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 10) {
      velocityRef.current = (e.pageX - lastXRef.current) / dt;
      lastXRef.current = e.pageX;
      lastTimeRef.current = now;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || viewMode !== 'single-strip') return;
    setIsDragging(false);

    // Apply inertial coasting
    let v = velocityRef.current * 16;
    const stepInertia = () => {
      if (Math.abs(v) > 0.4 && containerRef.current) {
        containerRef.current.scrollLeft -= v;
        v *= 0.92;
        animFrameRef.current = requestAnimationFrame(stepInertia);
      }
    };
    animFrameRef.current = requestAnimationFrame(stepInertia);
  };

  // Track scroll position for scrubber and active frame counter
  const handleScroll = () => {
    if (containerRef.current && viewMode === 'single-strip') {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const total = scrollWidth - clientWidth;
      const progress = total > 0 ? (scrollLeft / total) * 100 : 0;
      setScrollProgress(progress);

      const frameWidth = 460;
      const index = Math.min(
        Math.floor((scrollLeft + clientWidth * 0.3) / frameWidth),
        engagementPhotos.length - 1
      );
      setCurrentActiveIndex(Math.max(0, index));
    }
  };

  // Scrubber click jump
  const handleTimelineScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const { scrollWidth, clientWidth } = containerRef.current;
    containerRef.current.scrollTo({
      left: (scrollWidth - clientWidth) * ratio,
      behavior: 'smooth',
    });
  };

  return (
    <div
      id="engagements-view"
      className="relative min-h-screen bg-[#17140f] text-[#ece7db] pt-28 md:pt-34 pb-16 flex flex-col justify-between overflow-x-hidden select-none"
      onMouseEnter={() => {
        if (viewMode === 'single-strip') {
          onSetCursorMode?.('drag-horizontal', 'SCROLL · DRAG');
        }
      }}
      onMouseLeave={() => onSetCursorMode?.('default')}
    >
      {/* Top Editorial Header */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 mb-6">
        <button
          onClick={onBack}
          onMouseEnter={() => onSetCursorMode?.('link')}
          onMouseLeave={() => onSetCursorMode?.('drag-horizontal')}
          className="inline-flex items-center gap-2 font-mono-exif text-xs text-[#837c6d] hover:text-[#ece7db] tracking-[0.2em] uppercase transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO INDEX</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-4 border-b border-[#ece7db]/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono-exif text-[11px] text-[#7a8058] tracking-[0.3em] uppercase">
                COLLECTION 02 — CONTINUOUS 35MM REEL & LIGHT TABLE
              </span>
              <span className="text-[#837c6d]">·</span>
              <span className="font-mono-exif text-[11px] text-[#837c6d]">
                {engagementPhotos.length} NEGATIVE FRAMES
              </span>
            </div>
            <h1 className="font-display font-light text-3xl sm:text-5xl md:text-6xl text-[#ece7db] tracking-tight mt-1">
              Engagements & Natural Raw Light.
            </h1>
          </div>

          {/* Mode Switcher: Continuous Strip vs Light Table Contact Sheet */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('single-strip')}
              onMouseEnter={() => onSetCursorMode?.('link')}
              onMouseLeave={() => onSetCursorMode?.('drag-horizontal')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono-exif tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'single-strip'
                  ? 'bg-[#ece7db] text-[#17140f] font-semibold'
                  : 'text-[#837c6d] hover:text-[#ece7db] bg-[#26221a]/60 border border-[#ece7db]/10'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>35MM FILM STRIP</span>
            </button>

            <button
              onClick={() => {
                setViewMode('light-table');
                onSetCursorMode?.('default');
              }}
              onMouseEnter={() => onSetCursorMode?.('link')}
              onMouseLeave={() => onSetCursorMode?.('default')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono-exif tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'light-table'
                  ? 'bg-[#ece7db] text-[#17140f] font-semibold'
                  : 'text-[#837c6d] hover:text-[#ece7db] bg-[#26221a]/60 border border-[#ece7db]/10'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>LIGHT TABLE MATRIX</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: Continuous 35mm Film Strip Track */}
      {viewMode === 'single-strip' && (
        <div className="relative w-full my-auto py-4">
          {/* Film Top Sprocket Bar */}
          <div className="w-full bg-[#1e1b15] py-2.5 border-t border-b border-[#ece7db]/10 flex items-center justify-between px-4 overflow-hidden select-none">
            <div className="flex gap-4 items-center shrink-0">
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i} className="film-sprocket" />
              ))}
            </div>
            <span className="font-mono-exif text-[9px] text-[#7a8058] tracking-[0.3em] uppercase px-4 whitespace-nowrap shrink-0">
              SAFETY FILM · KODAK PORTRA 400 · ROLL BATCH 8841-A · EMULSION COATED IN ROCHESTER
            </span>
            <div className="flex gap-4 items-center shrink-0">
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i + 100} className="film-sprocket" />
              ))}
            </div>
          </div>

          {/* Horizontal Scroll Track */}
          <div
            ref={containerRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onScroll={handleScroll}
            className="flex items-center gap-8 sm:gap-12 px-8 sm:px-16 md:px-24 py-8 md:py-12 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing bg-[#14120e]"
          >
            {engagementPhotos.map((photo, index) => {
              const frameNumber = String(index + 1).padStart(2, '0') + 'A';
              const isLandscape = photo.aspectRatio === '3:2';

              return (
                <div
                  key={photo.id}
                  className="shrink-0 flex flex-col group select-none transition-transform duration-300"
                  style={{ width: isLandscape ? '520px' : '400px' }}
                >
                  {/* Film Rebate Marker */}
                  <div className="flex items-center justify-between font-mono-exif text-[10px] text-[#837c6d] tracking-widest mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <span className="text-[#9c5a3c]">▸</span>
                      <span className="text-[#ece7db] font-semibold">EXP {frameNumber}</span>
                    </span>
                    <span className="text-[#7a8058] text-[9px]">35MM KODAK PORTRA</span>
                  </div>

                  {/* Photo Frame Container */}
                  <div
                    onClick={() => onSelectPhoto(photo)}
                    onMouseEnter={() => onSetCursorMode?.('view', 'EXPAND')}
                    onMouseLeave={() => onSetCursorMode?.('drag-horizontal')}
                    className="relative overflow-hidden rounded-xs border border-[#ece7db]/20 shadow-2xl bg-[#17140f] cursor-pointer"
                  >
                    <PlaceholderArtwork
                      asset={photo}
                      showExifOverlay={true}
                      className="w-full"
                    />
                  </div>

                  {/* Frame Metadata Caption */}
                  <div className="mt-3 flex items-baseline justify-between font-mono-exif text-xs px-1">
                    <span className="text-[#ece7db] font-medium group-hover:text-[#7a8058] transition-colors truncate max-w-[70%]">
                      {photo.title}
                    </span>
                    <span className="text-[#837c6d] text-[10px]">{photo.exif.location.split(',')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Film Bottom Sprocket Bar */}
          <div className="w-full bg-[#1e1b15] py-2.5 border-t border-b border-[#ece7db]/10 flex items-center justify-between px-4 overflow-hidden select-none">
            <div className="flex gap-4 items-center shrink-0">
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i + 200} className="film-sprocket" />
              ))}
            </div>
            <span className="font-mono-exif text-[9px] text-[#837c6d] tracking-[0.25em] uppercase px-4 whitespace-nowrap shrink-0">
              DX CODED: 400 ISO · LATITUDE +3/-2 STOPS · PROCESSED IN KODAK FLEXICOLOR C-41
            </span>
            <div className="flex gap-4 items-center shrink-0">
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i + 300} className="film-sprocket" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: Light Table Matrix Contact Sheet */}
      {viewMode === 'light-table' && (
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 my-8">
          <div className="bg-[#1c1913] p-6 sm:p-10 rounded-lg border border-[#ece7db]/15 shadow-2xl">
            <div className="flex items-center justify-between font-mono-exif text-xs text-[#837c6d] pb-6 mb-8 border-b border-[#ece7db]/10">
              <span className="text-[#7a8058] uppercase tracking-widest">
                DARKROOM CONTACT SHEET — 130 EXPOSURES
              </span>
              <span>LOUPE INSPECTION VIEW</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {engagementPhotos.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => onSelectPhoto(photo)}
                  onMouseEnter={() => onSetCursorMode?.('view', 'INSPECT')}
                  onMouseLeave={() => onSetCursorMode?.('default')}
                  className="cursor-pointer group bg-[#17140f] p-2 border border-[#ece7db]/10 hover:border-[#7a8058] rounded transition-all"
                >
                  <PlaceholderArtwork
                    asset={photo}
                    showExifOverlay={false}
                    aspectRatioClass="aspect-[3/2]"
                  />
                  <div className="mt-2 flex items-center justify-between font-mono-exif text-[9px] text-[#837c6d]">
                    <span>#{String(idx + 1).padStart(2, '0')}</span>
                    <span className="truncate max-w-[70%]">{photo.exif.location.split(',')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Film Timeline Scrubber & Navigation Track */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 mt-8">
        <div className="flex items-center justify-between font-mono-exif text-xs text-[#837c6d] mb-2">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7a8058] animate-ping" />
            <span>
              FRAME {String(currentActiveIndex + 1).padStart(3, '0')} / {engagementPhotos.length}
            </span>
            <span className="text-[#ece7db] truncate hidden sm:inline">
              — {engagementPhotos[currentActiveIndex]?.title}
            </span>
          </span>
          <span>{Math.round(scrollProgress)}% CONTACT SCRUB</span>
        </div>

        {/* Interactive Film Timeline Bar (Click to scrub across all 130 frames) */}
        <div
          onClick={handleTimelineScrub}
          className="w-full h-3 bg-[#1e1b15] rounded border border-[#ece7db]/10 relative overflow-hidden cursor-pointer group"
          title="Click to scrub to frame"
        >
          {/* Subtle frame ticks */}
          <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
            {Array.from({ length: 26 }).map((_, i) => (
              <div key={i} className="w-[1px] h-full bg-[#ece7db]/5" />
            ))}
          </div>
          <div
            className="h-full bg-gradient-to-r from-[#5c6046] to-[#7a8058] transition-all duration-75 ease-out rounded"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="mt-6 flex items-center justify-between text-xs font-mono-exif text-[#837c6d]">
          <button
            onClick={onBack}
            onMouseEnter={() => onSetCursorMode?.('link')}
            onMouseLeave={() => onSetCursorMode?.('drag-horizontal')}
            className="hover:text-[#ece7db] transition-colors cursor-pointer"
          >
            ← BACK TO INDEX
          </button>
          <span>COLLECTION 02 / 04</span>
        </div>
      </div>
    </div>
  );
};
