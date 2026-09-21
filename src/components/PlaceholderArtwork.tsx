import React from 'react';
import { PhotoAsset } from '../types';

interface PlaceholderArtworkProps {
  asset: PhotoAsset;
  className?: string;
  showExifOverlay?: boolean;
  priority?: boolean;
  aspectRatioClass?: string;
  interactive?: boolean;
}

export const PlaceholderArtwork: React.FC<PlaceholderArtworkProps> = ({
  asset,
  className = '',
  showExifOverlay = true,
  aspectRatioClass,
}) => {
  const { placeholderArt, customImageUrl, title, romanNumeral, exif, aspectRatio } = asset;
  const [primaryColor, accentColor, subtleColor] = placeholderArt.palette;

  // Aspect ratio class mapper
  const getAspectRatioClass = () => {
    if (aspectRatioClass) return aspectRatioClass;
    switch (aspectRatio) {
      case '4:5':
        return 'aspect-[4/5]';
      case '3:2':
        return 'aspect-[3/2]';
      case '16:9':
        return 'aspect-[16/9]';
      case '1:1':
        return 'aspect-square';
      case '2:3':
        return 'aspect-[2/3]';
      default:
        return 'aspect-[4/5]';
    }
  };

  // If user uploaded a custom image in Curator Studio, display it with the same fine-art treatment
  if (customImageUrl) {
    return (
      <div
        className={`relative w-full overflow-hidden curated-frame-container bg-[#1f1b14] border border-[#ece7db]/10 ${getAspectRatioClass()} ${className}`}
      >
        <img
          src={customImageUrl}
          alt={title}
          className="w-full h-full object-cover curated-frame-image"
          loading="lazy"
        />
        {/* Subtle archival film watermark & border */}
        <div className="absolute inset-0 pointer-events-none border border-[#ece7db]/10" />
        {showExifOverlay && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#17140f]/90 via-[#17140f]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="font-mono-exif text-[10px] text-[#ece7db] tracking-wider uppercase truncate">
              {title}
            </p>
            <p className="font-mono-exif text-[9px] text-[#837c6d] tracking-widest mt-0.5">
              {exif.camera} · {exif.focalLength} · {exif.aperture}
            </p>
          </div>
        )}
      </div>
    );
  }

  // High-End Procedural Fine-Art Photographic Print Placeholder
  return (
    <div
      className={`relative w-full overflow-hidden curated-frame-container bg-[#1c1913] border border-[#ece7db]/10 select-none ${getAspectRatioClass()} ${className}`}
    >
      {/* Dynamic Layered Photographic Composition with Film Tone */}
      <div className="w-full h-full relative curated-frame-image">
        {/* Deep Analog Tone Background Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${accentColor}25 0%, ${primaryColor} 70%, #12100c 100%)`,
          }}
        />

        {/* Minimalist Architectural / Sculptural Silhouette SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-75 mix-blend-screen"
          viewBox="0 0 400 500"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id={`grad-${asset.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.45" />
              <stop offset="50%" stopColor={subtleColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor="#17140f" stopOpacity="0.8" />
            </linearGradient>
            <radialGradient id={`rad-${asset.id}`} cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ece7db" stopOpacity="0.15" />
              <stop offset="60%" stopColor={accentColor} stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Light cone / ray */}
          <rect width="100%" height="100%" fill={`url(#rad-${asset.id})`} />

          {/* Silhouette forms based on editorial category and silhouetteType */}
          {placeholderArt.silhouetteType === 'veil' && (
            <g className="transition-transform duration-700">
              <path
                d="M160 50 C240 120, 280 260, 220 440 C190 380, 150 280, 160 50 Z"
                fill={`url(#grad-${asset.id})`}
                opacity="0.85"
              />
              <path
                d="M130 140 C200 180, 310 290, 260 480 C210 400, 120 280, 130 140 Z"
                fill="#ece7db"
                opacity="0.06"
              />
              <circle cx="200" cy="110" r="48" fill="#ece7db" opacity="0.12" />
            </g>
          )}

          {placeholderArt.silhouetteType === 'archway' && (
            <g>
              <path
                d="M110 500 L110 240 C110 140, 290 140, 290 240 L290 500 Z"
                fill="none"
                stroke={accentColor}
                strokeWidth="1.5"
                opacity="0.4"
              />
              <path
                d="M130 500 L130 250 C130 170, 270 170, 270 250 L270 500 Z"
                fill={`url(#grad-${asset.id})`}
                opacity="0.5"
              />
              <line x1="60" y1="500" x2="340" y2="500" stroke="#837c6d" strokeWidth="0.8" opacity="0.3" />
            </g>
          )}

          {placeholderArt.silhouetteType === 'monolith' && (
            <g>
              <rect x="150" y="140" width="100" height="260" fill={`url(#grad-${asset.id})`} opacity="0.9" />
              <polygon points="150,140 250,140 290,100 190,100" fill="#ece7db" opacity="0.08" />
              <polygon points="250,140 290,100 290,360 250,400" fill="#17140f" opacity="0.5" />
            </g>
          )}

          {placeholderArt.silhouetteType === 'prism' && (
            <g>
              <polygon points="200,90 320,380 80,380" fill={`url(#grad-${asset.id})`} opacity="0.75" />
              <line x1="200" y1="90" x2="200" y2="380" stroke="#ece7db" strokeWidth="1" opacity="0.3" />
              <circle cx="200" cy="220" r="65" fill="#ece7db" opacity="0.05" />
            </g>
          )}

          {placeholderArt.silhouetteType === 'waves' && (
            <g>
              <path
                d="M0 320 C100 300, 180 340, 260 310 C340 280, 380 300, 400 290 L400 500 L0 500 Z"
                fill={`url(#grad-${asset.id})`}
                opacity="0.6"
              />
              <path
                d="M0 370 C90 350, 190 390, 280 360 C350 340, 390 360, 400 350 L400 500 L0 500 Z"
                fill="#17140f"
                opacity="0.5"
              />
            </g>
          )}

          {placeholderArt.silhouetteType === 'minimal-horizon' && (
            <g>
              <line x1="0" y1="310" x2="400" y2="310" stroke="#837c6d" strokeWidth="1" opacity="0.4" />
              <circle cx="200" cy="240" r="45" fill={`url(#grad-${asset.id})`} opacity="0.7" />
              <line x1="190" y1="310" x2="190" y2="285" stroke="#ece7db" strokeWidth="1.5" opacity="0.7" />
            </g>
          )}

          {placeholderArt.silhouetteType === 'sculpture' && (
            <g>
              <path
                d="M140 420 C110 320, 140 200, 200 160 C260 200, 290 320, 260 420 Z"
                fill={`url(#grad-${asset.id})`}
                opacity="0.8"
              />
              <ellipse cx="200" cy="180" rx="35" ry="50" fill="#ece7db" opacity="0.07" />
            </g>
          )}

          {placeholderArt.silhouetteType === 'botanical' && (
            <g>
              <path
                d="M200 480 C200 300, 160 210, 130 120"
                stroke={subtleColor}
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M200 360 C250 330, 280 270, 270 210"
                stroke={accentColor}
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
              />
              <circle cx="130" cy="120" r="18" fill={`url(#grad-${asset.id})`} opacity="0.7" />
              <circle cx="270" cy="210" r="14" fill={`url(#grad-${asset.id})`} opacity="0.6" />
            </g>
          )}

          {/* Delicate Archival Grid Crosses */}
          <line x1="20" y1="20" x2="30" y2="20" stroke="#837c6d" strokeWidth="0.7" opacity="0.35" />
          <line x1="25" y1="15" x2="25" y2="25" stroke="#837c6d" strokeWidth="0.7" opacity="0.35" />
          <line x1="370" y1="20" x2="380" y2="20" stroke="#837c6d" strokeWidth="0.7" opacity="0.35" />
          <line x1="375" y1="15" x2="375" y2="25" stroke="#837c6d" strokeWidth="0.7" opacity="0.35" />
        </svg>

        {/* Tactile Monochrome Film Emulsion Noise Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(${subtleColor} 1px, transparent 1px)`,
            backgroundSize: '8px 8px',
          }}
        />

        {/* Vignette edge shading on the frame */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 35px rgba(23, 20, 15, 0.65)',
          }}
        />

        {/* Gallery Fine-Print Header & Corner Indicators */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[9px] font-mono-exif text-[#d9d2c1]/60 tracking-widest">
          <span>PLATE {romanNumeral}</span>
          <span className="opacity-75">{asset.collection.toUpperCase()}</span>
        </div>

        {/* Center Editorial Annotation Watermark */}
        <div className="absolute inset-x-4 bottom-14 pointer-events-none text-center">
          <p className="font-display italic text-[#ece7db]/90 text-sm md:text-base tracking-wide drop-shadow-sm line-clamp-1">
            {title}
          </p>
          <p className="font-mono-exif text-[8.5px] text-[#837c6d] tracking-[0.25em] uppercase mt-1">
            {placeholderArt.annotation}
          </p>
        </div>

        {/* EXIF Metadata Bar Reveal on Hover */}
        {showExifOverlay && (
          <div className="absolute bottom-0 inset-x-0 px-3.5 py-2.5 bg-gradient-to-t from-[#17140f]/95 via-[#17140f]/80 to-transparent flex items-center justify-between border-t border-[#ece7db]/10 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            <span className="font-mono-exif text-[9.5px] text-[#d9d2c1] tracking-wider truncate max-w-[65%]">
              {exif.camera} · {exif.lens}
            </span>
            <span className="font-mono-exif text-[9px] text-[#7a8058] tracking-widest shrink-0">
              {exif.focalLength} {exif.aperture}
            </span>
          </div>
        )}
      </div>

      {/* 1px quiet boundary border matching --bone/10 */}
      <div className="absolute inset-0 border border-[#ece7db]/10 pointer-events-none" />
    </div>
  );
};
