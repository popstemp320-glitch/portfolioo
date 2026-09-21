import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PhotoAsset } from '../types';
import { PlaceholderArtwork } from '../components/PlaceholderArtwork';
import { ArrowLeft, Box, Sparkles, Sliders, Grid3X3, Grid2X2, LayoutGrid, ChevronUp } from 'lucide-react';

interface EditorialsViewProps {
  photos: PhotoAsset[];
  onBack: () => void;
  onSelectPhoto: (photo: PhotoAsset) => void;
  onSetCursorMode?: (mode: 'default' | 'view' | 'drag-horizontal' | 'zoom' | 'link', text?: string) => void;
}

const BATCH_SIZE = 24;

// Subcomponent with individual 3D cursor tilt engine + specular lighting
const TiltCard: React.FC<{
  photo: PhotoAsset;
  onSelectPhoto: (photo: PhotoAsset) => void;
  onSetCursorMode?: (mode: 'default' | 'view' | 'drag-horizontal' | 'zoom' | 'link', text?: string) => void;
  emulsionTone: 'silver' | 'amber' | 'cyanotype';
}> = ({ photo, onSelectPhoto, onSetCursorMode, emulsionTone }) => {
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`,
      transition: 'transform 0.08s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    });
    onSetCursorMode?.('default');
  };

  const getToneFilter = () => {
    if (emulsionTone === 'silver') return 'grayscale(100%) contrast(1.15) brightness(0.95)';
    if (emulsionTone === 'amber') return 'sepia(35%) contrast(1.05) brightness(0.98)';
    if (emulsionTone === 'cyanotype') return 'hue-rotate(185deg) contrast(1.1) saturate(70%)';
    return 'none';
  };

  return (
    <div
      onClick={() => onSelectPhoto(photo)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onSetCursorMode?.('view', 'EXPAND')}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className="group cursor-pointer rounded-sm overflow-hidden bg-[#1a1712] border border-[#ece7db]/15 shadow-2xl transition-all duration-300 will-change-transform"
    >
      <div className="relative" style={{ filter: getToneFilter() }}>
        <PlaceholderArtwork
          asset={photo}
          showExifOverlay={true}
        />
      </div>

      <div className="p-4 bg-[#1e1b15]/90 border-t border-[#ece7db]/10 flex items-baseline justify-between font-mono-exif text-xs">
        <span className="text-[#ece7db] group-hover:text-[#7a8058] transition-colors truncate max-w-[70%]">
          PLATE {photo.romanNumeral} — {photo.title}
        </span>
        <span className="text-[#837c6d] text-[10px]">{photo.exif.location.split(',')[0]}</span>
      </div>
    </div>
  );
};

export const EditorialsView: React.FC<EditorialsViewProps> = ({
  photos,
  onBack,
  onSelectPhoto,
  onSetCursorMode,
}) => {
  const [columnsCount, setColumnsCount] = useState<2 | 3 | 4>(3);
  const [emulsionTone, setEmulsionTone] = useState<'silver' | 'amber' | 'cyanotype'>('silver');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [scrollVelocity, setScrollVelocity] = useState(0);

  const lastScrollY = useRef(0);
  const velocityTimer = useRef<number | null>(null);

  // 150 editorial photos
  const allEditorialPhotos = useMemo(() => {
    return photos.filter((p) => p.collection === 'editorials');
  }, [photos]);

  const displayedPhotos = useMemo(() => {
    return allEditorialPhotos.slice(0, visibleCount);
  }, [allEditorialPhotos, visibleCount]);

  // Velocity warping on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      setScrollVelocity(Math.min(Math.max(delta * 0.15, -6), 6));

      if (velocityTimer.current) window.clearTimeout(velocityTimer.current);
      velocityTimer.current = window.setTimeout(() => {
        setScrollVelocity(0);
      }, 120);

      // Infinite scroll check
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      if (currentY + winHeight > docHeight - 800) {
        setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, allEditorialPhotos.length));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (velocityTimer.current) window.clearTimeout(velocityTimer.current);
    };
  }, [allEditorialPhotos.length]);

  return (
    <div id="editorials-view" className="relative min-h-screen bg-[#17140f] text-[#ece7db] pt-28 md:pt-36 pb-36">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-12">
        <button
          onClick={onBack}
          onMouseEnter={() => onSetCursorMode?.('link')}
          onMouseLeave={() => onSetCursorMode?.('default')}
          className="inline-flex items-center gap-2 font-mono-exif text-xs text-[#837c6d] hover:text-[#ece7db] tracking-[0.2em] uppercase transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO INDEX</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#ece7db]/10 pb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono-exif text-[11px] text-[#7a8058] tracking-[0.3em] uppercase">
                COLLECTION 04 — CHIAROSCURO & INERTIAL 3D TILT
              </span>
              <span className="text-[#837c6d]">·</span>
              <span className="font-mono-exif text-[11px] text-[#837c6d]">
                {allEditorialPhotos.length} TOTAL PLATES
              </span>
            </div>
            <h1 className="font-display font-light text-4xl sm:text-6xl md:text-7xl text-[#ece7db] tracking-tight mt-1">
              Editorials & Form.
            </h1>
          </div>

          {/* Controls: Tone Shader & Column Density */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Tone filter toggle */}
            <div className="flex items-center gap-1.5 bg-[#1e1b15] p-1 rounded-full border border-[#ece7db]/10">
              <span className="font-mono-exif text-[10px] text-[#837c6d] px-2 uppercase">EMULSION:</span>
              <button
                onClick={() => setEmulsionTone('silver')}
                className={`px-2.5 py-1 rounded-full font-mono-exif text-[10px] tracking-wider uppercase transition-colors cursor-pointer ${
                  emulsionTone === 'silver' ? 'bg-[#ece7db] text-[#17140f] font-semibold' : 'text-[#837c6d] hover:text-[#ece7db]'
                }`}
              >
                TRI-X SILVER
              </button>
              <button
                onClick={() => setEmulsionTone('amber')}
                className={`px-2.5 py-1 rounded-full font-mono-exif text-[10px] tracking-wider uppercase transition-colors cursor-pointer ${
                  emulsionTone === 'amber' ? 'bg-[#7a8058] text-[#17140f] font-semibold' : 'text-[#837c6d] hover:text-[#ece7db]'
                }`}
              >
                AMBER
              </button>
              <button
                onClick={() => setEmulsionTone('cyanotype')}
                className={`px-2.5 py-1 rounded-full font-mono-exif text-[10px] tracking-wider uppercase transition-colors cursor-pointer ${
                  emulsionTone === 'cyanotype' ? 'bg-[#9c5a3c] text-[#ece7db] font-semibold' : 'text-[#837c6d] hover:text-[#ece7db]'
                }`}
              >
                CYANOTYPE
              </button>
            </div>

            {/* Density grid toggle */}
            <div className="flex items-center gap-1 bg-[#1e1b15] p-1 rounded-full border border-[#ece7db]/10">
              <button
                onClick={() => setColumnsCount(2)}
                title="2 Columns (Large Plates)"
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  columnsCount === 2 ? 'bg-[#ece7db] text-[#17140f]' : 'text-[#837c6d] hover:text-[#ece7db]'
                }`}
              >
                <Grid2X2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setColumnsCount(3)}
                title="3 Columns (Balanced Masonry)"
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  columnsCount === 3 ? 'bg-[#ece7db] text-[#17140f]' : 'text-[#837c6d] hover:text-[#ece7db]'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setColumnsCount(4)}
                title="4 Columns (Dense Sheet)"
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  columnsCount === 4 ? 'bg-[#ece7db] text-[#17140f]' : 'text-[#837c6d] hover:text-[#ece7db]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dense 3D Tilt Masonry Grid with Velocity Warping */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div
          className={`grid gap-8 lg:gap-10 transition-transform duration-150 ease-out ${
            columnsCount === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : columnsCount === 3
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}
          style={{
            transform: `skewY(${scrollVelocity * 0.1}deg)`,
          }}
        >
          {displayedPhotos.map((photo) => (
            <TiltCard
              key={photo.id}
              photo={photo}
              onSelectPhoto={onSelectPhoto}
              onSetCursorMode={onSetCursorMode}
              emulsionTone={emulsionTone}
            />
          ))}
        </div>

        {/* Load more trigger */}
        {visibleCount < allEditorialPhotos.length && (
          <div className="mt-20 py-12 flex flex-col items-center justify-center border-t border-[#ece7db]/10">
            <span className="font-mono-exif text-[10px] text-[#7a8058] tracking-[0.25em] uppercase mb-4">
              PLATES {visibleCount} OF {allEditorialPhotos.length} LOADED
            </span>
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, allEditorialPhotos.length))}
              className="px-6 py-2.5 rounded-full border border-[#ece7db]/20 hover:border-[#7a8058] bg-[#26221a]/60 text-xs font-mono-exif text-[#ece7db] transition-all cursor-pointer"
            >
              LOAD NEXT 24 PLATES ↓
            </button>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-20 pt-8 border-t border-[#ece7db]/10 flex items-center justify-between text-xs font-mono-exif text-[#837c6d]">
          <button
            onClick={onBack}
            onMouseEnter={() => onSetCursorMode?.('link')}
            onMouseLeave={() => onSetCursorMode?.('default')}
            className="hover:text-[#ece7db] transition-colors cursor-pointer"
          >
            ← BACK TO INDEX
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-[#ece7db] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>SCROLL TO TOP</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
