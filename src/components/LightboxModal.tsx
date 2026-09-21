import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PhotoAsset } from '../types';
import { PlaceholderArtwork } from './PlaceholderArtwork';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, BookOpen, Camera, MapPin } from 'lucide-react';

interface LightboxModalProps {
  asset: PhotoAsset | null;
  allAssets: PhotoAsset[];
  onClose: () => void;
  onNavigate: (asset: PhotoAsset) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  asset,
  allAssets,
  onClose,
  onNavigate,
}) => {
  const [showStoryPanel, setShowStoryPanel] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<1 | 1.5 | 2>(1);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

  // Zero-UI Idle Timer: reset on mouse movement
  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = window.setTimeout(() => {
      setIsIdle(true);
    }, 2500);
  }, []);

  useEffect(() => {
    if (!asset) return;

    resetIdleTimer();
    const handleMouseMove = () => resetIdleTimer();
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [asset, resetIdleTimer]);

  // Keyboard navigation
  useEffect(() => {
    if (!asset) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      resetIdleTimer();
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        const currentIndex = allAssets.findIndex((a) => a.id === asset.id);
        const nextIndex = (currentIndex + 1) % allAssets.length;
        onNavigate(allAssets[nextIndex]);
        setZoomLevel(1);
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = allAssets.findIndex((a) => a.id === asset.id);
        const prevIndex = (currentIndex - 1 + allAssets.length) % allAssets.length;
        onNavigate(allAssets[prevIndex]);
        setZoomLevel(1);
      } else if (e.key.toLowerCase() === 'z') {
        setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
      } else if (e.key === ' ' || e.key.toLowerCase() === 's') {
        setShowStoryPanel((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [asset, allAssets, onClose, onNavigate, resetIdleTimer]);

  if (!asset) return null;

  const currentIndex = allAssets.findIndex((a) => a.id === asset.id);
  const totalCount = allAssets.length;

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  return (
    <div
      id="lightbox-cinematic-overlay"
      className="fixed inset-0 z-[9995] flex items-center justify-center bg-[#17140f]/90 transition-all duration-500 select-none overflow-hidden"
      style={{
        backdropFilter: 'blur(24px) brightness(0.25)',
        WebkitBackdropFilter: 'blur(24px) brightness(0.25)',
      }}
      onClick={(e) => {
        // If clicking directly on backdrop, close
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Top Floating Control Bar - Zero-UI Idle Fade */}
      <header
        className={`fixed top-0 inset-x-0 z-30 p-6 md:p-8 flex items-center justify-between text-[#ece7db] transition-opacity duration-700 pointer-events-auto ${
          isIdle ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="font-mono-exif text-[11px] text-[#7a8058] tracking-[0.25em] uppercase">
            {asset.collection} — PLATE {asset.romanNumeral}
          </span>
          <span className="font-mono-exif text-[11px] text-[#837c6d] tracking-widest">
            [{currentIndex + 1} / {totalCount}]
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom Toggle */}
          <button
            onClick={toggleZoom}
            className="p-2.5 rounded-full border border-[#ece7db]/15 bg-[#26221a]/60 hover:bg-[#26221a] hover:border-[#7a8058] text-[#ece7db] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono-exif"
            title="Toggle Zoom (Z)"
          >
            {zoomLevel === 1 ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4 text-[#7a8058]" />}
            <span className="hidden sm:inline text-[10px]">{zoomLevel}x</span>
          </button>

          {/* Curator Story Panel Toggle */}
          <button
            onClick={() => setShowStoryPanel((prev) => !prev)}
            className={`p-2.5 rounded-full border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono-exif ${
              showStoryPanel
                ? 'border-[#7a8058] bg-[#5c6046]/30 text-[#ece7db]'
                : 'border-[#ece7db]/15 bg-[#26221a]/60 hover:bg-[#26221a] text-[#d9d2c1]'
            }`}
            title="Curator Story & Backstory (Space)"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline text-[10px] tracking-wider uppercase">CURATOR NOTES</span>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full border border-[#ece7db]/15 bg-[#26221a]/60 hover:bg-[#26221a] hover:border-[#9c5a3c] text-[#ece7db] transition-colors cursor-pointer"
            title="Close Lightbox (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Navigation Arrows - Zero-UI Idle Fade */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          const prevIndex = (currentIndex - 1 + allAssets.length) % allAssets.length;
          onNavigate(allAssets[prevIndex]);
          setZoomLevel(1);
        }}
        className={`fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-[#ece7db]/15 bg-[#26221a]/50 hover:bg-[#26221a] text-[#ece7db] transition-all duration-500 cursor-pointer ${
          isIdle ? 'opacity-0 pointer-events-none' : 'opacity-80 hover:opacity-100'
        }`}
        title="Previous Image (←)"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          const nextIndex = (currentIndex + 1) % allAssets.length;
          onNavigate(allAssets[nextIndex]);
          setZoomLevel(1);
        }}
        className={`fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-[#ece7db]/15 bg-[#26221a]/50 hover:bg-[#26221a] text-[#ece7db] transition-all duration-500 cursor-pointer ${
          isIdle ? 'opacity-0 pointer-events-none' : 'opacity-80 hover:opacity-100'
        }`}
        title="Next Image (→)"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image Stage */}
      <div className="relative max-w-[90vw] max-h-[82vh] flex items-center justify-center overflow-auto p-4 hide-scrollbar">
        <div
          className="transition-transform duration-300 ease-out cursor-zoom-in"
          style={{
            transform: `scale(${zoomLevel})`,
          }}
          onClick={toggleZoom}
        >
          <div className="max-w-[800px] w-[82vw] md:w-[70vw] shadow-[0_25px_80px_rgba(0,0,0,0.8)] border border-[#ece7db]/15">
            <PlaceholderArtwork
              asset={asset}
              showExifOverlay={false}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Bottom Floating EXIF Technical Strip - Zero-UI Idle Fade */}
      <footer
        className={`fixed bottom-0 inset-x-0 z-30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-[#837c6d] font-mono-exif text-[11px] tracking-wider transition-opacity duration-700 pointer-events-auto bg-gradient-to-t from-[#17140f]/90 to-transparent ${
          isIdle ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-3 text-center md:text-left mb-2 md:mb-0">
          <Camera className="w-3.5 h-3.5 text-[#7a8058]" />
          <span className="text-[#ece7db] font-medium tracking-wide">
            {asset.exif.camera}
          </span>
          <span className="text-[#ece7db]/40">·</span>
          <span>{asset.exif.lens}</span>
          <span className="text-[#ece7db]/40">·</span>
          <span className="text-[#7a8058] font-semibold">{asset.exif.focalLength}</span>
          <span className="text-[#7a8058]">{asset.exif.aperture}</span>
          <span>{asset.exif.shutterSpeed}</span>
          <span>{asset.exif.iso}</span>
        </div>

        <div className="flex items-center gap-4 text-[#837c6d]">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#9c5a3c]" />
            <span className="text-[#d9d2c1]">{asset.exif.location}</span>
          </span>
          <span>{asset.exif.year}</span>
        </div>
      </footer>

      {/* Slide-out Curator Story / Notes Panel */}
      {showStoryPanel && (
        <aside
          className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-[#1e1b15]/95 border-l border-[#ece7db]/15 p-8 md:p-10 z-40 shadow-2xl flex flex-col justify-between overflow-y-auto backdrop-blur-xl animate-in slide-in-from-right duration-400"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#ece7db]/10">
              <span className="font-mono-exif text-[10px] text-[#7a8058] tracking-[0.25em] uppercase">
                CURATOR NOTE · {asset.romanNumeral}
              </span>
              <button
                onClick={() => setShowStoryPanel(false)}
                className="p-1.5 rounded-full hover:bg-[#26221a] text-[#837c6d] hover:text-[#ece7db] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-8">
              <h3 className="font-display text-2xl text-[#ece7db] leading-snug">
                {asset.title}
              </h3>
              <p className="font-mono-exif text-[10px] text-[#837c6d] tracking-widest mt-2 uppercase">
                {asset.exif.location} · {asset.exif.year}
              </p>

              <div className="w-12 h-[1px] bg-[#7a8058] my-6" />

              <div className="text-sm md:text-base text-[#d9d2c1] font-body leading-relaxed space-y-4">
                <p>{asset.curatorStory}</p>
                {asset.curatorQuote && (
                  <blockquote className="border-l-2 border-[#9c5a3c] pl-4 py-1 italic font-display text-[#ece7db] text-sm">
                    {asset.curatorQuote}
                  </blockquote>
                )}
              </div>
            </div>

            {/* Technical Shoot Specs in Story Panel */}
            <div className="mt-10 p-4 rounded bg-[#17140f]/60 border border-[#ece7db]/10">
              <p className="font-mono-exif text-[9.5px] text-[#7a8058] tracking-[0.2em] uppercase mb-3">
                ARCHIVAL EXPOSURE SHEET
              </p>
              <div className="grid grid-cols-2 gap-y-2 text-[11px] font-mono-exif">
                <span className="text-[#837c6d]">BODY:</span>
                <span className="text-[#ece7db]">{asset.exif.camera}</span>
                <span className="text-[#837c6d]">OPTIC:</span>
                <span className="text-[#ece7db]">{asset.exif.lens}</span>
                <span className="text-[#837c6d]">SPEED / f:</span>
                <span className="text-[#ece7db]">
                  {asset.exif.shutterSpeed} @ {asset.exif.aperture}
                </span>
                <span className="text-[#837c6d]">SENSITIVITY:</span>
                <span className="text-[#ece7db]">{asset.exif.iso}</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#ece7db]/10 text-center">
            <span className="font-mono-exif text-[9.5px] text-[#837c6d] tracking-[0.2em] uppercase">
              AETHELGARD PERMANENT COLLECTION
            </span>
          </div>
        </aside>
      )}
    </div>
  );
};
