import React from 'react';
import { X, ArrowUpRight, Compass, Settings, Heart, Sparkles, Mail } from 'lucide-react';
import { CollectionCategory } from '../types';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: 'home' | CollectionCategory | 'curator') => void;
  onOpenAbout: () => void;
  onOpenPricing: () => void;
  onOpenInquire: () => void;
  onOpenCurator: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenAbout,
  onOpenPricing,
  onOpenInquire,
  onOpenCurator,
}) => {
  if (!isOpen) return null;

  const collections: { id: CollectionCategory; num: string; label: string; desc: string }[] = [
    { id: 'weddings', num: '01', label: 'Weddings', desc: 'Velocity Parallax & Italian Villa Nuptials' },
    { id: 'engagements', num: '02', label: 'Engagements', desc: 'Continuous 35mm Film Strip & Coastal Sunset' },
    { id: 'commercials', num: '03', label: 'Commercials', desc: '3D Stack Cascade Deck & Haute Atelier' },
    { id: 'editorials', num: '04', label: 'Editorials', desc: '3D Tilt Masonry Grid & Raw Emulsion Tones' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#17140f]/80 backdrop-blur-md transition-opacity duration-400"
      />

      {/* Drawer panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg h-full bg-[#1c1813] border-l border-[#ece7db]/15 p-8 sm:p-12 text-[#ece7db] shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
      >
        {/* Top bar with Signature Logo and Close */}
        <div className="flex items-center justify-between pb-8 border-b border-[#ece7db]/10">
          <div className="flex flex-col">
            <span className="font-signature text-2xl sm:text-3xl text-[#ece7db]">
              sumeetzphotography
            </span>
            <span className="font-mono-exif text-[9px] text-[#837c6d] tracking-[0.25em] uppercase">
              AETHELGARD FINE-ART CURATION
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-[#ece7db]/20 text-[#ece7db]/70 hover:text-[#ece7db] hover:border-[#ece7db]/60 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Collections */}
        <div className="py-8 space-y-6">
          <span className="font-mono-exif text-[10px] tracking-[0.3em] text-[#7a8058] uppercase block mb-2">
            PORTFOLIO COLLECTIONS
          </span>
          {collections.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onClose();
                onNavigate(item.id);
              }}
              className="w-full group text-left cursor-pointer flex items-baseline justify-between border-b border-[#ece7db]/5 pb-4 hover:border-[#ece7db]/30 transition-all"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono-exif text-xs text-[#837c6d] group-hover:text-[#7a8058] transition-colors">
                  {item.num}
                </span>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl text-[#ece7db] group-hover:translate-x-2 transition-transform duration-300">
                    {item.label}
                  </h3>
                  <p className="font-mono-exif text-[10px] text-[#837c6d] uppercase tracking-wider mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#837c6d] group-hover:text-[#ece7db] transition-colors" />
            </button>
          ))}
        </div>

        {/* Secondary Links & Studio Access */}
        <div className="pt-6 border-t border-[#ece7db]/10 space-y-4">
          <div className="grid grid-cols-2 gap-3 font-mono-exif text-xs uppercase tracking-widest">
            <button
              onClick={() => {
                onClose();
                onOpenAbout();
              }}
              className="py-2.5 px-4 rounded-lg bg-[#26221a]/60 hover:bg-[#26221a] border border-[#ece7db]/10 text-left transition-colors cursor-pointer"
            >
              About Artist
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenPricing();
              }}
              className="py-2.5 px-4 rounded-lg bg-[#26221a]/60 hover:bg-[#26221a] border border-[#ece7db]/10 text-left transition-colors cursor-pointer"
            >
              Pricing & Tiers
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenInquire();
              }}
              className="py-2.5 px-4 rounded-lg bg-[#ece7db] text-[#17140f] font-semibold text-left transition-all hover:bg-white cursor-pointer"
            >
              Inquire Booking
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenCurator();
              }}
              className="py-2.5 px-4 rounded-lg bg-[#26221a]/60 hover:bg-[#26221a] border border-[#ece7db]/10 text-left transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Curator Studio</span>
            </button>
          </div>

          {/* Footer location line */}
          <div className="pt-4 text-[10px] font-mono-exif text-[#837c6d] tracking-[0.2em] uppercase flex flex-col gap-1">
            <span>WASHINGTON DC · NEW YORK · PARIS</span>
            <span>MEDIUM FORMAT FILM & FINE-ART CURATION</span>
          </div>
        </div>
      </div>
    </div>
  );
};
