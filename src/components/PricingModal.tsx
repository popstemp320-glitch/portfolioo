import React from 'react';
import { X, Check } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInquire: (category: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onOpenInquire,
}) => {
  if (!isOpen) return null;

  const tiers = [
    {
      id: 'engagements',
      name: 'The Engagement & Story Session',
      price: '$2,800',
      description: 'Intimate, unhurried portraiture at sunset across coastal bluffs, architectural sanctuaries, or quiet private estates.',
      features: [
        'Up to 3 hours of continuous natural light exposure',
        'Mixed medium-format film & 60MP digital archive',
        'Physical silver gelatin proof prints (Set of 10)',
        'Full high-resolution archival online gallery',
      ],
    },
    {
      id: 'weddings',
      name: 'The Heirloom Wedding Commission',
      price: 'From $8,500',
      popular: true,
      description: 'Comprehensive, bespoke documentation of full celebration days with multi-format film devotion and heirloom physical presentation.',
      features: [
        'Full day coverage (up to 10 hours) by sumeetzphotography',
        'Contax 645 & Leica M11 medium format and 35mm film rolls',
        'Handcrafted linen-bound fine-art album (12x12 inch)',
        'Private darkroom contact sheets & online heirloom vault',
        'Complimentary destination travel consultation',
      ],
    },
    {
      id: 'editorials',
      name: 'Commercial & Editorial Assignment',
      price: 'Day Rate / Custom',
      description: 'Sculptural campaign art direction, haute atelier documentation, and high-fashion spreads for discerning brands.',
      features: [
        'Comprehensive creative direction & lighting design',
        'Full commercial usage licensing rights',
        'Color grading matching proprietary film tone curves',
        'On-site digital capture tech & rapid preview monitor',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#17140f]/85 backdrop-blur-md transition-opacity"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#1c1813] border border-[#ece7db]/20 rounded-2xl p-6 sm:p-10 text-[#ece7db] shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-[#ece7db]/20 text-[#ece7db]/70 hover:text-[#ece7db] hover:border-[#ece7db]/50 transition-colors cursor-pointer"
          aria-label="Close pricing modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-mono-exif text-[10px] tracking-[0.3em] text-[#837c6d] uppercase">
            INVESTMENT & COMMISSIONS
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-[#ece7db] mt-1">
            Archival Collections
          </h2>
          <p className="font-body text-sm text-[#837c6d] mt-2">
            Every collection is custom-tailored. Nationwide coverage across Washington DC, New York, and destination celebrations worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl p-6 flex flex-col justify-between border ${
                tier.popular
                  ? 'bg-[#26221a]/90 border-[#7a8058] shadow-xl'
                  : 'bg-[#26221a]/50 border-[#ece7db]/10'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#7a8058] text-[#17140f] font-mono-exif text-[9px] uppercase tracking-widest font-semibold">
                  Most Requested
                </span>
              )}

              <div>
                <h3 className="font-display text-xl text-[#ece7db] mb-1">
                  {tier.name}
                </h3>
                <div className="font-mono-exif text-2xl text-[#ece7db] font-light my-3">
                  {tier.price}
                </div>
                <p className="font-body text-xs text-[#837c6d] leading-relaxed mb-6">
                  {tier.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-[#ece7db]/10">
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#d9d2c1]/85">
                      <Check className="w-3.5 h-3.5 text-[#7a8058] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => {
                    onClose();
                    onOpenInquire(tier.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-full font-mono-exif text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    tier.popular
                      ? 'bg-[#ece7db] text-[#17140f] hover:bg-white font-medium'
                      : 'border border-[#ece7db]/30 text-[#ece7db] hover:border-[#ece7db] hover:bg-[#ece7db]/10'
                  }`}
                >
                  Request Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
