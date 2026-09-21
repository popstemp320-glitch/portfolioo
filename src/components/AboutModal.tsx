import React from 'react';
import { X, Camera, Film, Compass, Award } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInquire: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenInquire,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#17140f]/85 backdrop-blur-md transition-opacity"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#1c1813] border border-[#ece7db]/20 rounded-2xl p-6 sm:p-10 text-[#ece7db] shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-[#ece7db]/20 text-[#ece7db]/70 hover:text-[#ece7db] hover:border-[#ece7db]/50 transition-colors cursor-pointer"
          aria-label="Close about modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <span className="font-mono-exif text-[10px] tracking-[0.3em] text-[#837c6d] uppercase">
            ARTIST STATEMENT & METHODOLOGY
          </span>
          <h2 className="font-signature text-4xl sm:text-5xl text-[#ece7db] mt-1">
            sumeetzphotography
          </h2>
          <p className="font-mono-exif text-xs text-[#7a8058] tracking-widest mt-1 uppercase">
            Fine-Art Archival Curation · Mumbai, India · Available Nationwide
          </p>
        </div>

        <div className="space-y-6 text-[#d9d2c1]/85 font-body text-sm sm:text-base leading-relaxed">
          <p>
            Photography is not merely documentation; it is the choreography of light, geometry, and unrepeatable intimacy. Rooted in traditional medium-format emulsion, my approach balances the effortless grace of documentary reportage with the rigorous visual symmetry of architectural design.
          </p>
          <p>
            Whether standing on the bluffs of Cap de Formentor or framing an intimate ceremony in a historic Manhattan townhouse, every composition is crafted on physical film stocks—Kodak Portra 400 and Ilford HP5+—honoring subtle tonal graduations that digital sensors simply flatten.
          </p>
        </div>

        {/* Archival Toolset / Hardware */}
        <div className="mt-8 pt-8 border-t border-[#ece7db]/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#26221a]/60 border border-[#ece7db]/10">
            <Camera className="w-4 h-4 text-[#7a8058] mb-2" />
            <div className="font-mono-exif text-[10px] tracking-widest text-[#837c6d] uppercase">
              Primary System
            </div>
            <div className="font-display text-base text-[#ece7db] mt-0.5">
              Contax 645 & Carl Zeiss 80mm f/2.0
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#26221a]/60 border border-[#ece7db]/10">
            <Film className="w-4 h-4 text-[#e6a87c] mb-2" />
            <div className="font-mono-exif text-[10px] tracking-widest text-[#837c6d] uppercase">
              Emulsion Stocks
            </div>
            <div className="font-display text-base text-[#ece7db] mt-0.5">
              Kodak Tri-X 400 & Portra 800
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#26221a]/60 border border-[#ece7db]/10">
            <Award className="w-4 h-4 text-[#7a8058] mb-2" />
            <div className="font-mono-exif text-[10px] tracking-widest text-[#837c6d] uppercase">
              Devotion
            </div>
            <div className="font-display text-base text-[#ece7db] mt-0.5">
              18 Commissions Annually Worldwide
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#ece7db]/10 flex items-center justify-between">
          <span className="font-mono-exif text-xs text-[#837c6d]">
            AVAILABLE FOR MMXXV & MMXXVI DATES
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenInquire();
            }}
            className="px-6 py-2.5 rounded-full bg-[#ece7db] text-[#17140f] font-mono-exif text-xs uppercase tracking-[0.2em] font-medium hover:bg-white cursor-pointer transition-all"
          >
            INQUIRE WITH STUDIO
          </button>
        </div>
      </div>
    </div>
  );
};
