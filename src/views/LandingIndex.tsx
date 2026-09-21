import React, { useState } from 'react';
import { CollectionCategory, PhotoAsset } from '../types';
import { LandingBackgroundMedia } from '../components/LandingBackgroundMedia';

interface LandingIndexProps {
  photoAssets?: PhotoAsset[];
  onSelectCollection: (category: CollectionCategory) => void;
  onSelectPhoto?: (photo: PhotoAsset) => void;
  onOpenInquire?: () => void;
  onOpenAbout?: () => void;
  onOpenPricing?: () => void;
  onSetCursorMode?: (mode: 'default' | 'view' | 'drag-horizontal' | 'zoom' | 'link', text?: string) => void;
}

export const LandingIndex: React.FC<LandingIndexProps> = ({
  onSelectCollection,
  onOpenAbout,
  onSetCursorMode,
}) => {
  // Active category for the full-bleed background video / gif swap
  // 'default' = Sunset city skyline couple embrace (matches screenshot)
  const [activeHoverCategory, setActiveHoverCategory] = useState<string>('default');

  return (
    <div id="landing-index-container" className="relative w-full bg-[#17140f] text-[#ece7db]">
      {/* 
        ========================================================================
        FULL-SCREEN CINEMATIC HERO VIEWPORT (Matches User Screenshot & Spec)
        Full-bleed background video/gif that dynamically crossfades on hover
        ========================================================================
      */}
      <section className="relative w-full h-screen min-h-[680px] max-h-screen flex flex-col justify-between overflow-hidden px-6 sm:px-10 md:px-14 pt-28 pb-8 sm:pb-10">
        {/* Full-bleed Background Media Engine (video/gif with smooth crossfade & fallback) */}
        <LandingBackgroundMedia activeCategory={activeHoverCategory} />

        {/* Top spacer matching the header height */}
        <div className="w-full shrink-0" />

        {/* 
          CENTER HERO: Bespoke Staggered Typography Layout (From Screenshot)
          Hovering any subsection swaps the background media covering the entire page!
        */}
        <div className="relative z-20 my-auto flex flex-col items-center justify-center select-none w-full max-w-6xl mx-auto py-2">
          <div className="w-full flex flex-col gap-3 sm:gap-4 md:gap-5">
            
            {/* ROW 1: 01 WEDDINGS (Upper-Center, slightly left) */}
            <div className="flex items-baseline justify-center sm:justify-start sm:pl-[12%] md:pl-[18%]">
              <button
                onClick={() => onSelectCollection('weddings')}
                onMouseEnter={() => {
                  setActiveHoverCategory('weddings');
                  onSetCursorMode?.('link', '01 WEDDINGS');
                }}
                onMouseLeave={() => {
                  setActiveHoverCategory('default');
                  onSetCursorMode?.('default');
                }}
                className="group text-left cursor-pointer flex items-baseline gap-3 sm:gap-5 focus:outline-none transition-transform duration-300"
              >
                <span className="font-mono-exif text-xs sm:text-sm md:text-base text-[#ece7db]/60 tracking-widest group-hover:text-[#e04838] transition-all duration-300 group-hover:-translate-y-1 inline-block">
                  01
                </span>
                <span className="hero-nav-item font-display font-light text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] tracking-tight uppercase leading-none text-[#ece7db] drop-shadow-md">
                  WEDDINGS
                </span>
              </button>
            </div>

            {/* ROW 2: ALL VISUAL STORIES [MORE COMING] (Indented Left) */}
            <div className="flex items-center justify-center sm:justify-start sm:pl-[6%] md:pl-[10%]">
              <button
                onClick={() => onSelectCollection('weddings')}
                onMouseEnter={() => {
                  setActiveHoverCategory('visual_stories');
                  onSetCursorMode?.('link', 'STORIES');
                }}
                onMouseLeave={() => {
                  setActiveHoverCategory('default');
                  onSetCursorMode?.('default');
                }}
                className="group cursor-pointer flex items-center gap-3 sm:gap-4 focus:outline-none"
              >
                <span className="hero-nav-item font-display font-light text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.08em] uppercase text-[#ece7db]/90">
                  ALL VISUAL STORIES
                </span>
                <span className="hero-nav-tag font-mono-exif text-[9px] sm:text-[10px] tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full border border-[#ece7db]/25 text-[#ece7db]/70">
                  MORE COMING
                </span>
              </button>
            </div>

            {/* ROW 3: 02 ENGAGEMENTS / SESSIONS & STORIES (Center-Right with Terracotta Accent & Underline) */}
            <div className="flex items-baseline justify-center sm:justify-end sm:pr-[8%] md:pr-[14%]">
              <button
                onClick={() => onSelectCollection('engagements')}
                onMouseEnter={() => {
                  setActiveHoverCategory('engagements');
                  onSetCursorMode?.('link', '02 ENGAGEMENTS');
                }}
                onMouseLeave={() => {
                  setActiveHoverCategory('default');
                  onSetCursorMode?.('default');
                }}
                className="group text-left cursor-pointer flex flex-wrap items-baseline gap-2.5 sm:gap-4 focus:outline-none"
              >
                {/* Terracotta/Amber numeral 02 transitioning on hover */}
                <span className="font-mono-exif text-xs sm:text-sm md:text-base text-[#d97757] font-semibold tracking-widest group-hover:text-[#ff6e5e] transition-all duration-300 group-hover:-translate-y-1 inline-block">
                  02
                </span>
                <div className="relative border-b-2 border-[#ece7db]/60 group-hover:border-[#e04838] pb-0.5 transition-colors duration-300">
                  <span className="hero-nav-item font-display font-light text-4xl sm:text-6xl md:text-7xl lg:text-[5.8rem] tracking-tight uppercase leading-none text-[#ece7db] drop-shadow-md">
                    ENGAGEMENTS
                  </span>
                </div>
                <span className="hero-nav-subtext font-mono-exif text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#837c6d] ml-1 hidden sm:inline">
                  / SESSIONS & STORIES
                </span>
              </button>
            </div>

            {/* ROW 4: 03 COMMERCIAL (Left-Center) */}
            <div className="flex items-baseline justify-center sm:justify-start sm:pl-[14%] md:pl-[20%]">
              <button
                onClick={() => onSelectCollection('commercials')}
                onMouseEnter={() => {
                  setActiveHoverCategory('commercials');
                  onSetCursorMode?.('link', '03 COMMERCIAL');
                }}
                onMouseLeave={() => {
                  setActiveHoverCategory('default');
                  onSetCursorMode?.('default');
                }}
                className="group text-left cursor-pointer flex items-baseline gap-3 sm:gap-5 focus:outline-none"
              >
                <span className="font-mono-exif text-xs sm:text-sm md:text-base text-[#ece7db]/60 tracking-widest group-hover:text-[#e04838] transition-all duration-300 group-hover:-translate-y-1 inline-block">
                  03
                </span>
                <span className="hero-nav-item font-display font-light text-4xl sm:text-6xl md:text-7xl lg:text-[5.8rem] tracking-tight uppercase leading-none text-[#ece7db] drop-shadow-md">
                  COMMERCIAL
                </span>
              </button>
            </div>

            {/* ROW 5: 04 EDITORIALS (Center-Right) */}
            <div className="flex items-baseline justify-center sm:justify-center sm:translate-x-6 md:translate-x-12">
              <button
                onClick={() => onSelectCollection('editorials')}
                onMouseEnter={() => {
                  setActiveHoverCategory('editorials');
                  onSetCursorMode?.('link', '04 EDITORIALS');
                }}
                onMouseLeave={() => {
                  setActiveHoverCategory('default');
                  onSetCursorMode?.('default');
                }}
                className="group text-left cursor-pointer flex items-baseline gap-3 sm:gap-5 focus:outline-none"
              >
                <span className="font-mono-exif text-xs sm:text-sm md:text-base text-[#ece7db]/60 tracking-widest group-hover:text-[#e04838] transition-all duration-300 group-hover:-translate-y-1 inline-block">
                  04
                </span>
                <span className="hero-nav-item font-display font-light text-4xl sm:text-6xl md:text-7xl lg:text-[5.8rem] tracking-tight uppercase leading-none text-[#ece7db] drop-shadow-md">
                  EDITORIALS
                </span>
              </button>
            </div>

            {/* ROW 6: EDITORIAL EXCHANGE (Centered Below) */}
            <div className="flex items-center justify-center pt-1">
              <button
                onClick={() => onSelectCollection('editorials')}
                onMouseEnter={() => {
                  setActiveHoverCategory('editorial_exchange');
                  onSetCursorMode?.('link', 'DARKROOM');
                }}
                onMouseLeave={() => {
                  setActiveHoverCategory('default');
                  onSetCursorMode?.('default');
                }}
                className="group cursor-pointer focus:outline-none"
              >
                <span className="hero-nav-item font-display font-light text-lg sm:text-2xl md:text-3xl tracking-[0.2em] uppercase text-[#ece7db]/80">
                  EDITORIAL EXCHANGE
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* 
          BOTTOM BAR (Matches User Screenshot)
          Left: WASHINGTON DC · NEW YORK · AVAILABLE NATIONWIDE
          Right: INSTAGRAM · TERMS · PRIVACY
        */}
        <div className="relative z-20 w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#ece7db]/15 text-[#ece7db]/80 font-mono-exif text-[10px] sm:text-[11px] tracking-[0.22em] uppercase select-none">
          {/* Left: Location & Scope */}
          <div className="group flex items-center gap-2 text-center sm:text-left transition-all duration-300 hover:-translate-y-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e04838] shrink-0 animate-pulse shadow-[0_0_8px_rgba(224,72,56,0.8)]" />
            <span className="group-hover:text-[#ece7db] transition-colors">MUMBAI, INDIA · AVAILABLE NATIONWIDE</span>
          </div>

          {/* Right: Instagram, Terms, Privacy */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block hover:text-[#e04838] transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_2px_8px_rgba(224,72,56,0.4)]"
            >
              INSTAGRAM
            </a>
            <button
              onClick={onOpenAbout}
              className="inline-block hover:text-[#e04838] transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_2px_8px_rgba(224,72,56,0.4)] cursor-pointer"
            >
              TERMS
            </button>
            <button
              onClick={onOpenAbout}
              className="inline-block hover:text-[#e04838] transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_2px_8px_rgba(224,72,56,0.4)] cursor-pointer"
            >
              PRIVACY
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
