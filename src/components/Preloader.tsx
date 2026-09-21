import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isSlidingOut, setIsSlidingOut] = useState(false);

  useEffect(() => {
    // Smooth ticker increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSlidingOut(true);
            setTimeout(() => {
              onComplete();
            }, 800);
          }, 250);
          return 100;
        }
        // Organic pacing
        const increment = Math.floor(Math.random() * 8) + 3;
        return Math.min(prev + increment, 100);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsSlidingOut(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div
      id="preloader-overlay"
      className={`fixed inset-0 z-[99990] bg-[#17140f] flex flex-col justify-between p-8 md:p-16 transition-all duration-800 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isSlidingOut ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Top Bar: Archival Title */}
      <div className="flex items-center justify-between text-[#837c6d] font-mono-exif text-[11px] tracking-[0.25em] uppercase border-b border-[#ece7db]/10 pb-4">
        <span>AETHELGARD FINE-ART</span>
        <span>CATALOG ARCHIVE · MMXXVI</span>
      </div>

      {/* Center: Numeric Ticker & Typography */}
      <div className="flex flex-col items-center justify-center my-auto text-center">
        <div className="font-display font-light text-6xl sm:text-8xl md:text-9xl text-[#ece7db] tracking-tight tabular-nums flex items-baseline">
          <span>{String(progress).padStart(2, '0')}</span>
          <span className="text-2xl sm:text-3xl md:text-4xl text-[#7a8058] font-mono-exif ml-2">%</span>
        </div>

        <div className="w-48 sm:w-64 h-[1px] bg-[#ece7db]/10 mt-8 relative overflow-hidden">
          <div
            className="h-full bg-[#7a8058] transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="font-mono-exif text-[10px] text-[#837c6d] tracking-[0.3em] uppercase mt-6">
          INITIALIZING EMULSION & CURATION ENGINE
        </p>
      </div>

      {/* Bottom Bar: Skip & Archival Stamp */}
      <div className="flex items-center justify-between text-[#837c6d] font-mono-exif text-[10px] tracking-[0.2em] border-t border-[#ece7db]/10 pt-4">
        <span>COLLECTIONS: I — IV</span>
        <button
          onClick={handleSkip}
          className="hover:text-[#ece7db] transition-colors cursor-pointer underline underline-offset-4"
        >
          ENTER GALLERY →
        </button>
      </div>
    </div>
  );
};
