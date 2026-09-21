import React, { useState, useEffect, useRef } from 'react';
import { BackgroundMediaItem, DEFAULT_BACKGROUND_MEDIA } from '../data/backgroundMedia';
import { Volume2, VolumeX } from 'lucide-react';

interface LandingBackgroundMediaProps {
  activeCategory: string;
  customMedia?: Record<string, BackgroundMediaItem>;
}

export const LandingBackgroundMedia: React.FC<LandingBackgroundMediaProps> = ({
  activeCategory,
  customMedia,
}) => {
  const mediaMap = { ...DEFAULT_BACKGROUND_MEDIA, ...customMedia };
  const currentItem: BackgroundMediaItem =
    mediaMap[activeCategory] || mediaMap.default;

  // Maintain current and previous items for smooth cross-fading without flashes
  const [displayedItem, setDisplayedItem] = useState<BackgroundMediaItem>(currentItem);
  const [prevItem, setPrevItem] = useState<BackgroundMediaItem | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (currentItem.id !== displayedItem.id) {
      setPrevItem(displayedItem);
      setDisplayedItem(currentItem);
      setIsTransitioning(true);
      setIsVideoLoaded(false);
      setVideoError(false);

      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setPrevItem(null);
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [currentItem, displayedItem]);

  // Attempt video playback safely
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy prevented playback, fall back gracefully to image
          setVideoError(true);
        });
      }
    }
  }, [displayedItem]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* Background layer 1: Previous item during crossfade */}
      {prevItem && (
        <div className="absolute inset-0 w-full h-full opacity-100 transition-opacity duration-700 ease-out">
          {prevItem.videoUrl ? (
            <video
              src={prevItem.videoUrl}
              poster={prevItem.imageUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.08] saturate-[1.1] scale-100"
            />
          ) : (
            <img
              src={prevItem.imageUrl}
              alt={prevItem.title}
              className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.08] saturate-[1.1] scale-100"
            />
          )}
        </div>
      )}

      {/* Background layer 2: Active displayed item with crossfade */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
          isTransitioning ? 'opacity-0 animate-fade-in' : 'opacity-100'
        }`}
      >
        {displayedItem.videoUrl && !videoError ? (
          <>
            <video
              ref={videoRef}
              key={displayedItem.id}
              src={displayedItem.videoUrl}
              poster={displayedItem.imageUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onLoadedData={() => setIsVideoLoaded(true)}
              onError={() => setVideoError(true)}
              className={`w-full h-full object-cover filter brightness-[0.86] contrast-[1.08] saturate-[1.12] transition-transform duration-[14000ms] ease-out ${
                isVideoLoaded ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Fallback image shown while video is loading */}
            {!isVideoLoaded && (
              <img
                src={displayedItem.imageUrl}
                alt={displayedItem.title}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.86] contrast-[1.08] saturate-[1.12]"
              />
            )}
          </>
        ) : (
          <img
            key={displayedItem.id}
            src={displayedItem.imageUrl}
            alt={displayedItem.title}
            className="w-full h-full object-cover filter brightness-[0.86] contrast-[1.08] saturate-[1.12] transition-transform duration-[16000ms] scale-105"
          />
        )}
      </div>

      {/* Atmospheric Vignette & Contrast Balancer */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#17140f]/90 via-[#17140f]/20 to-[#17140f]/60" />
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,rgba(23,20,15,0.6)_100%]" />

      {/* Monochromatic warm film tone wash */}
      <div className="absolute inset-0 bg-[#3a2818]/15 mix-blend-color" />

      {/* Optional ambient video audio unmute toggle (discreet in bottom right) */}
      {displayedItem.videoUrl && !videoError && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="pointer-events-auto absolute bottom-8 right-8 z-30 p-2.5 rounded-full bg-[#17140f]/60 hover:bg-[#17140f]/90 text-[#ece7db]/70 hover:text-[#e04838] border border-[#ece7db]/15 hover:border-[#e04838]/60 hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(224,72,56,0.3)] backdrop-blur-md transition-all duration-300 cursor-pointer hidden md:flex items-center gap-2 group"
          title={isMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
          aria-label="Toggle ambient sound"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 group-hover:text-[#e04838] transition-colors" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#e04838]" />
          )}
          <span className="font-mono-exif text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pr-1 text-[#e04838]">
            {isMuted ? 'Sound Off' : 'Ambient Track'}
          </span>
        </button>
      )}

      {/* Floating Watermark / Location stamp if active */}
      <div className="absolute bottom-20 left-6 sm:left-12 z-20 pointer-events-none opacity-40 hover:opacity-80 transition-opacity hidden sm:block">
        <span className="font-mono-exif text-[9px] tracking-[0.25em] text-[#ece7db] uppercase">
          Plate Location: {displayedItem.location}
        </span>
      </div>
    </div>
  );
};
