import React, { useEffect, useState } from 'react';

export type CursorMode = 'default' | 'view' | 'drag-horizontal' | 'zoom' | 'link';

interface CustomCursorProps {
  mode: CursorMode;
  customText?: string;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ mode, customText }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Update global CSS variables for title scrub effect
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Inertial lerp dampening
  useEffect(() => {
    if (isTouchDevice) return;
    let animationFrameId: number;

    const lerp = () => {
      setPos((prev) => {
        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        return {
          x: prev.x + dx * 0.28,
          y: prev.y + dy * 0.28,
        };
      });
      animationFrameId = requestAnimationFrame(lerp);
    };

    animationFrameId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetPos, isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div
      id="custom-cursor-root"
      className="pointer-events-none fixed z-[99999] top-0 left-0 transition-opacity duration-300"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
    >
      {/* Default minimal 6px dot in --bone with difference blend */}
      {mode === 'default' && (
        <div
          id="cursor-dot-default"
          className="w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ece7db] mix-blend-difference shadow-[0_0_10px_rgba(236,231,219,0.5)] transition-all duration-200"
        />
      )}

      {/* Link mode - subtle ring */}
      {mode === 'link' && (
        <div
          id="cursor-ring-link"
          className="w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ece7db] mix-blend-difference transition-all duration-200 scale-110"
        />
      )}

      {/* Over interactive images: expands into translucent ring/pill displaying "VIEW" or "EXPAND" with inverted blend mode */}
      {mode === 'view' && (
        <div
          id="cursor-pill-view"
          className="-translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-[#ece7db] text-[#17140f] mix-blend-difference font-mono-exif text-[10px] tracking-[0.2em] uppercase font-semibold flex items-center gap-1.5 shadow-2xl transition-all duration-200 scale-100 animate-in fade-in zoom-in-95"
        >
          <span>{customText || 'VIEW'}</span>
          <span className="text-[8px] opacity-70">↗</span>
        </div>
      )}

      {/* On horizontal film strip: shows arrow indicator pointing left/right (DRAG / SCROLL) */}
      {mode === 'drag-horizontal' && (
        <div
          id="cursor-drag-strip"
          className="-translate-x-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-full bg-[#ece7db] text-[#17140f] mix-blend-difference font-mono-exif text-[9px] tracking-[0.22em] uppercase font-semibold flex items-center gap-2 shadow-2xl transition-all duration-200"
        >
          <span>←</span>
          <span>{customText || 'SCROLL · DRAG'}</span>
          <span>→</span>
        </div>
      )}

      {/* Zoom mode */}
      {mode === 'zoom' && (
        <div
          id="cursor-zoom-badge"
          className="-translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-[#ece7db] bg-[#ece7db]/20 text-[#ece7db] mix-blend-difference font-mono-exif text-[10px] flex items-center justify-center font-bold"
        >
          {customText || '+'}
        </div>
      )}
    </div>
  );
};
