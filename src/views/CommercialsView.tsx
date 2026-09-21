import React, { useState, useMemo } from 'react';
import { PhotoAsset } from '../types';
import { PlaceholderArtwork } from '../components/PlaceholderArtwork';
import { ArrowLeft, Layers, BookOpen, Sparkles, Filter, ChevronRight } from 'lucide-react';

interface CommercialsViewProps {
  photos: PhotoAsset[];
  onBack: () => void;
  onSelectPhoto: (photo: PhotoAsset) => void;
  onSetCursorMode?: (mode: 'default' | 'view' | 'drag-horizontal' | 'zoom' | 'link', text?: string) => void;
}

interface CampaignChapter {
  id: string;
  number: string;
  name: string;
  atelier: string;
  description: string;
}

const CAMPAIGNS: CampaignChapter[] = [
  {
    id: 'horlogerie',
    number: 'CAMPAIGN I',
    name: 'Haute Horlogerie & Precious Alloys',
    atelier: 'Geneva & Le Locle, Switzerland',
    description: 'Guilloché dials, blued steel hands, and tourbillon movements staged under sculpted northern diffusion.',
  },
  {
    id: 'ceramics',
    number: 'CAMPAIGN II',
    name: 'Brutalist Stoneware & Anagama Glazes',
    atelier: 'Kyoto & Shigaraki, Japan',
    description: 'Volcanic mountain clay, wood-fired ash textures, and organic negative space.',
  },
  {
    id: 'leather',
    number: 'CAMPAIGN III',
    name: 'Full-Grain Leathercraft & Hand Stitching',
    atelier: 'Biarritz & Florence',
    description: 'Vegetable-tanned saddle hides, beeswax burnishing, and artisanal bench tools.',
  },
  {
    id: 'distillate',
    number: 'CAMPAIGN IV',
    name: 'Botanical Distillates & Flint Glass',
    atelier: 'Grasse & Côte d’Azur',
    description: 'Heavyweight perfume flacons, cypress tinctures, and raking sunlight refractions.',
  },
  {
    id: 'furniture',
    number: 'CAMPAIGN V',
    name: 'Sand-Cast Aluminum & Raw Architecture',
    atelier: 'Milan & Berlin',
    description: 'Industrial prototypes, sand casting molds, and patinated bronze fixtures.',
  },
];

export const CommercialsView: React.FC<CommercialsViewProps> = ({
  photos,
  onBack,
  onSelectPhoto,
  onSetCursorMode,
}) => {
  const [activeCampaignIdx, setActiveCampaignIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'stack-deck' | 'magazine-spread'>('stack-deck');

  // Filter 120 commercial photos
  const allCommercialPhotos = useMemo(() => {
    return photos.filter((p) => p.collection === 'commercials');
  }, [photos]);

  // Distribute commercial photos into the 5 campaigns (approx 24 photos per campaign)
  const campaignPhotos = useMemo(() => {
    const chunkSize = Math.ceil(allCommercialPhotos.length / CAMPAIGNS.length);
    const start = activeCampaignIdx * chunkSize;
    return allCommercialPhotos.slice(start, start + chunkSize);
  }, [allCommercialPhotos, activeCampaignIdx]);

  const activeCampaign = CAMPAIGNS[activeCampaignIdx];

  return (
    <div id="commercials-view" className="relative min-h-screen bg-[#17140f] text-[#ece7db] pt-28 md:pt-36 pb-36">
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
                COLLECTION 03 — HIGH-FASHION CASCADE DECK
              </span>
              <span className="text-[#837c6d]">·</span>
              <span className="font-mono-exif text-[11px] text-[#837c6d]">
                {allCommercialPhotos.length} ATELIER COMMISSIONS
              </span>
            </div>
            <h1 className="font-display font-light text-4xl sm:text-6xl md:text-7xl text-[#ece7db] tracking-tight mt-1">
              Atelier & Commercial Craft.
            </h1>
          </div>

          {/* Mode Switcher: Stack Deck vs Magazine Spread */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('stack-deck')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono-exif tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'stack-deck'
                  ? 'bg-[#ece7db] text-[#17140f] font-semibold'
                  : 'text-[#837c6d] hover:text-[#ece7db] bg-[#26221a]/60 border border-[#ece7db]/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>STACK DECK</span>
            </button>

            <button
              onClick={() => setViewMode('magazine-spread')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono-exif tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'magazine-spread'
                  ? 'bg-[#ece7db] text-[#17140f] font-semibold'
                  : 'text-[#837c6d] hover:text-[#ece7db] bg-[#26221a]/60 border border-[#ece7db]/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>MAGAZINE SPREAD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Campaign Chapters Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-16">
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-3 border-b border-[#ece7db]/10">
          {CAMPAIGNS.map((camp, idx) => (
            <button
              key={camp.id}
              onClick={() => {
                setActiveCampaignIdx(idx);
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              className={`shrink-0 px-4 py-2 rounded-full font-mono-exif text-xs tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeCampaignIdx === idx
                  ? 'bg-[#7a8058] text-[#17140f] font-semibold shadow-lg'
                  : 'text-[#837c6d] hover:text-[#ece7db] bg-[#1e1b15] border border-[#ece7db]/10'
              }`}
            >
              <span>{camp.number}:</span>
              <span className="truncate max-w-[200px]">{camp.name}</span>
            </button>
          ))}
        </div>

        {/* Current Campaign Summary Card */}
        <div className="mt-6 p-6 rounded bg-[#1e1b15]/60 border border-[#ece7db]/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <span className="font-mono-exif text-[10px] text-[#7a8058] tracking-[0.25em] uppercase">
              {activeCampaign.atelier}
            </span>
            <h3 className="font-display text-2xl text-[#ece7db] mt-1">
              {activeCampaign.name}
            </h3>
            <p className="font-body text-xs text-[#d9d2c1]/80 mt-1 max-w-xl">
              {activeCampaign.description}
            </p>
          </div>
          <span className="font-mono-exif text-xs text-[#837c6d] shrink-0">
            {campaignPhotos.length} PLATES IN CHAPTER
          </span>
        </div>
      </div>

      {/* VIEW 1: 3D Stack Cascade Deck */}
      {viewMode === 'stack-deck' && (
        <div className="max-w-5xl mx-auto px-6 sm:px-10 space-y-12 sm:space-y-16">
          {campaignPhotos.map((photo, index) => {
            const topOffset = 110 + (index % 12) * 18;

            return (
              <div
                key={photo.id}
                className="sticky transition-all duration-300 will-change-transform"
                style={{
                  top: `${topOffset}px`,
                  zIndex: index + 1,
                }}
              >
                <div
                  onClick={() => onSelectPhoto(photo)}
                  onMouseEnter={() => onSetCursorMode?.('view', 'INSPECT')}
                  onMouseLeave={() => onSetCursorMode?.('default')}
                  className="group cursor-pointer bg-[#1e1b15] border border-[#ece7db]/15 rounded-lg p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-400 hover:border-[#7a8058]/60"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between font-mono-exif text-xs text-[#837c6d] pb-4 mb-6 border-b border-[#ece7db]/10">
                    <div className="flex items-center gap-3">
                      <span className="text-[#7a8058] font-bold tracking-widest">
                        PLATE {photo.romanNumeral}
                      </span>
                      <span>—</span>
                      <span className="text-[#ece7db] uppercase">{photo.exif.location}</span>
                    </div>
                    <span>EXP {photo.exif.shutterSpeed} @ {photo.exif.aperture}</span>
                  </div>

                  {/* Spread Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-7">
                      <div className="relative overflow-hidden rounded border border-[#ece7db]/10 shadow-lg">
                        <PlaceholderArtwork
                          asset={photo}
                          showExifOverlay={false}
                          aspectRatioClass="aspect-[4/5] sm:aspect-[3/2]"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-5 flex flex-col justify-between space-y-5">
                      <div>
                        <span className="font-mono-exif text-[10px] text-[#7a8058] tracking-[0.25em] uppercase">
                          ATELIER ARCHIVE
                        </span>
                        <h3 className="font-display text-2xl text-[#ece7db] mt-1 leading-snug">
                          {photo.title}
                        </h3>
                        <p className="mt-3 font-body text-xs sm:text-sm text-[#d9d2c1]/80 leading-relaxed">
                          {photo.curatorStory}
                        </p>
                      </div>

                      <div className="p-3 rounded bg-[#17140f]/70 border border-[#ece7db]/10 font-mono-exif text-[10px] space-y-1 text-[#837c6d]">
                        <div className="flex justify-between">
                          <span>SYSTEM:</span>
                          <span className="text-[#ece7db]">{photo.exif.camera}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>OPTIC:</span>
                          <span className="text-[#ece7db]">{photo.exif.lens}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ISO:</span>
                          <span className="text-[#7a8058]">{photo.exif.iso}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs font-mono-exif text-[#7a8058] group-hover:text-[#ece7db] transition-colors">
                        <span>VIEW FULL RESOLUTION</span>
                        <span>↗</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: Magazine Spread Cascade */}
      {viewMode === 'magazine-spread' && (
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-20">
          {campaignPhotos.map((photo, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div
                key={photo.id}
                onClick={() => onSelectPhoto(photo)}
                onMouseEnter={() => onSetCursorMode?.('view', 'EXPAND')}
                onMouseLeave={() => onSetCursorMode?.('default')}
                className={`cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center p-6 sm:p-10 rounded-lg bg-[#1a1712] border border-[#ece7db]/10 hover:border-[#7a8058]/50 transition-all duration-300 ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : ''}`}>
                  <div className="relative overflow-hidden rounded border border-[#ece7db]/15 shadow-2xl">
                    <PlaceholderArtwork
                      asset={photo}
                      showExifOverlay={true}
                    />
                  </div>
                </div>

                <div className={`lg:col-span-5 space-y-6 ${isReversed ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center gap-3 font-mono-exif text-xs text-[#7a8058]">
                    <span>SPREAD #{String(index + 1).padStart(2, '0')}</span>
                    <span>·</span>
                    <span>PLATE {photo.romanNumeral}</span>
                  </div>

                  <h3 className="font-display text-3xl sm:text-4xl text-[#ece7db]">
                    {photo.title}
                  </h3>

                  <p className="font-body text-sm text-[#d9d2c1] leading-relaxed">
                    {photo.curatorStory}
                  </p>

                  <div className="border-t border-b border-[#ece7db]/10 py-3 font-mono-exif text-xs text-[#837c6d] flex items-center justify-between">
                    <span>{photo.exif.camera}</span>
                    <span className="text-[#7a8058]">{photo.exif.aperture}</span>
                    <span>{photo.exif.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mt-28 pt-8 border-t border-[#ece7db]/10 flex items-center justify-between text-xs font-mono-exif text-[#837c6d]">
        <button
          onClick={onBack}
          onMouseEnter={() => onSetCursorMode?.('link')}
          onMouseLeave={() => onSetCursorMode?.('default')}
          className="hover:text-[#ece7db] transition-colors cursor-pointer"
        >
          ← BACK TO INDEX
        </button>
        <span>COLLECTION 03 / 04</span>
      </div>
    </div>
  );
};
