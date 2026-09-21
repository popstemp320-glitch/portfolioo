import React, { useState } from 'react';
import { CollectionCategory } from '../types';
import { KineticTextRoll } from './KineticTextRoll';
import { Settings, Menu, X, ArrowUpRight, ArrowLeft } from 'lucide-react';

interface PortalNavigationProps {
  currentView: 'home' | CollectionCategory | 'curator';
  onNavigate: (view: 'home' | CollectionCategory | 'curator') => void;
  onOpenCurator: () => void;
  onOpenAbout?: () => void;
  onOpenPricing?: () => void;
  onOpenInquire?: () => void;
  onOpenMenu?: () => void;
  onSetCursorMode?: (mode: 'default' | 'view' | 'drag-horizontal' | 'zoom' | 'link') => void;
}

export const PortalNavigation: React.FC<PortalNavigationProps> = ({
  currentView,
  onNavigate,
  onOpenCurator,
  onOpenAbout,
  onOpenPricing,
  onOpenInquire,
  onOpenMenu,
  onSetCursorMode,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems: { id: 'home' | CollectionCategory; label: string; num: string }[] = [
    { id: 'home', label: 'Index', num: '00' },
    { id: 'weddings', label: 'Weddings', num: '01' },
    { id: 'engagements', label: 'Engagements', num: '02' },
    { id: 'commercials', label: 'Commercials', num: '03' },
    { id: 'editorials', label: 'Editorials', num: '04' },
  ];

  const handleOpenMenuClick = () => {
    if (onOpenMenu) {
      onOpenMenu();
    } else {
      setIsDrawerOpen(true);
    }
  };

  // If on Landing Page ('home'): Render the exact bespoke editorial header from user screenshot
  if (currentView === 'home') {
    return (
      <>
        <header
          id="landing-signature-header"
          className="fixed top-0 inset-x-0 z-[9990] px-6 sm:px-10 md:px-14 py-6 md:py-8 flex items-center justify-between pointer-events-none select-none text-[#ece7db]"
        >
          {/* Left: MENU trigger with hamburger */}
          <div className="pointer-events-auto">
            <button
              onClick={handleOpenMenuClick}
              onMouseEnter={() => onSetCursorMode?.('link')}
              onMouseLeave={() => onSetCursorMode?.('default')}
              className="group cursor-pointer flex items-center gap-2.5 font-mono-exif text-xs sm:text-sm tracking-[0.22em] uppercase text-[#ece7db]/90 hover:text-[#e04838] transition-all duration-300 hover:-translate-y-0.5"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:text-[#e04838]" />
              <span className="font-light">MENU</span>
            </button>
          </div>

          {/* Center: Handwritten Script Signature "sumeetzphotography" */}
          <div className="pointer-events-auto text-center -translate-x-1 sm:translate-x-0">
            <button
              onClick={() => onNavigate('home')}
              onMouseEnter={() => onSetCursorMode?.('link')}
              onMouseLeave={() => onSetCursorMode?.('default')}
              className="cursor-pointer group flex flex-col items-center focus:outline-none transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="font-signature text-2xl sm:text-3xl md:text-4xl text-[#ece7db] tracking-wide group-hover:text-[#ff6e5e] transition-all duration-300 leading-tight whitespace-nowrap group-hover:drop-shadow-[0_4px_16px_rgba(224,72,56,0.35)]">
                sumeetzphotography
              </span>
            </button>
          </div>

          {/* Right: ABOUT, PRICING, SIGN IN, [INQUIRE] */}
          <div className="pointer-events-auto flex items-center gap-4 sm:gap-6 md:gap-8 font-mono-exif text-xs tracking-[0.2em] uppercase">
            <button
              onClick={onOpenAbout}
              onMouseEnter={() => onSetCursorMode?.('link')}
              onMouseLeave={() => onSetCursorMode?.('default')}
              className="hidden md:inline-block text-[#d9d2c1]/80 hover:text-[#e04838] transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_4px_12px_rgba(224,72,56,0.4)] cursor-pointer font-medium"
            >
              ABOUT
            </button>

            <button
              onClick={onOpenPricing}
              onMouseEnter={() => onSetCursorMode?.('link')}
              onMouseLeave={() => onSetCursorMode?.('default')}
              className="hidden md:inline-block text-[#d9d2c1]/80 hover:text-[#e04838] transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_4px_12px_rgba(224,72,56,0.4)] cursor-pointer font-medium"
            >
              PRICING
            </button>

            <button
              onClick={onOpenCurator}
              onMouseEnter={() => onSetCursorMode?.('link')}
              onMouseLeave={() => onSetCursorMode?.('default')}
              className="hidden sm:inline-block text-[#d9d2c1]/80 hover:text-[#e04838] transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_4px_12px_rgba(224,72,56,0.4)] cursor-pointer font-medium"
              title="Curator Studio Sign In"
            >
              SIGN IN
            </button>

            <button
              onClick={onOpenInquire}
              onMouseEnter={() => onSetCursorMode?.('link')}
              onMouseLeave={() => onSetCursorMode?.('default')}
              className="px-4 py-1.5 rounded-full border border-[#ece7db]/40 text-[#ece7db] hover:text-[#e04838] hover:border-[#e04838] hover:bg-[#e04838]/15 hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(224,72,56,0.35)] active:translate-y-0 transition-all duration-300 cursor-pointer text-[11px] sm:text-xs font-medium"
            >
              INQUIRE
            </button>
          </div>
        </header>

        {/* Fallback Drawer if onOpenMenu wasn't provided */}
        {isDrawerOpen && (
          <div
            id="portal-drawer-backdrop"
            className="fixed inset-0 z-[9998] bg-[#17140f]/95 backdrop-blur-2xl flex flex-col justify-between p-8 sm:p-12 animate-in fade-in duration-300"
          >
            <div className="flex items-center justify-between border-b border-[#ece7db]/10 pb-6">
              <span className="font-signature text-2xl sm:text-3xl text-[#ece7db]">sumeetzphotography</span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-full border border-[#ece7db]/20 text-[#ece7db] hover:bg-[#ece7db]/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-6 my-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsDrawerOpen(false);
                  }}
                  className="flex items-baseline justify-between py-2 border-b border-[#ece7db]/5 text-left group"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono-exif text-xs text-[#837c6d]">{item.num}</span>
                    <span className="font-display text-3xl sm:text-4xl text-[#d9d2c1]/70 group-hover:text-[#ece7db]">
                      {item.label}
                    </span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[#837c6d] group-hover:text-[#ece7db] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  // If inside a specific collection view: Render refined collection header with direct switcher
  const isBeige = currentView === 'weddings';

  return (
    <>
      <nav
        id="persistent-floating-nav"
        className={`fixed top-0 inset-x-0 z-[9990] px-6 sm:px-10 md:px-14 py-6 md:py-8 flex items-center justify-between pointer-events-none select-none ${
          isBeige ? 'text-[#1c1917]' : 'floating-blend-header text-[#ece7db]'
        }`}
      >
        {/* Brand / Return to Index */}
        <button
          onClick={() => onNavigate('home')}
          onMouseEnter={() => onSetCursorMode?.('link')}
          onMouseLeave={() => onSetCursorMode?.('default')}
          className="pointer-events-auto group cursor-pointer flex items-center gap-3 focus:outline-none"
        >
          <div className={`p-2 rounded-full border border-current ${isBeige ? 'hover:bg-[#1c1917]/10' : 'hover:bg-[#ece7db]/15'} transition-colors`}>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className={`font-signature text-xl sm:text-2xl ${isBeige ? 'text-[#1c1917]' : 'text-[#ece7db]'} -mb-1`}>
              sumeetzphotography
            </span>
            <span className={`font-mono-exif text-[9px] tracking-[0.25em] uppercase ${
              isBeige ? 'text-[#787164] group-hover:text-[#1c1917]' : 'text-[#837c6d] group-hover:text-[#ece7db]'
            } transition-colors`}>
              RETURN TO INDEX
            </span>
          </div>
        </button>

        {/* Desktop Direct Portal Links */}
        <div className="hidden lg:flex items-center gap-8 pointer-events-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => onSetCursorMode?.('link')}
                onMouseLeave={() => onSetCursorMode?.('default')}
                className={`group cursor-pointer font-mono-exif text-[11px] tracking-[0.2em] uppercase flex items-baseline gap-1.5 transition-all duration-300 py-1 ${
                  isActive
                    ? (isBeige ? 'text-[#1c1917] font-semibold' : 'text-[#ece7db] font-semibold')
                    : (isBeige ? 'text-[#787164] hover:text-[#1c1917]' : 'text-[#d9d2c1]/70 hover:text-[#ece7db]')
                }`}
              >
                <span className="text-[8.5px] opacity-50 font-normal">{item.num}</span>
                <KineticTextRoll
                  primaryText={item.label}
                  primaryClassName={isActive ? (isBeige ? 'text-[#1c1917]' : 'text-[#ece7db]') : (isBeige ? 'text-[#787164]' : 'text-[#d9d2c1]/80')}
                  secondaryClassName={isBeige ? 'text-[#e04838]' : 'text-[#ece7db]'}
                />
                {isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full ml-0.5 -translate-y-0.5 ${isBeige ? 'bg-[#e04838]' : 'bg-[#ece7db]'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={onOpenInquire}
            onMouseEnter={() => onSetCursorMode?.('link')}
            onMouseLeave={() => onSetCursorMode?.('default')}
            className={`font-mono-exif text-[10px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-current ${
              isBeige ? 'hover:bg-[#1c1917]/10 hover:border-[#1c1917]' : 'hover:bg-[#ece7db]/15'
            } transition-all cursor-pointer hidden sm:inline-block`}
          >
            INQUIRE
          </button>

          <button
            onClick={onOpenCurator}
            onMouseEnter={() => onSetCursorMode?.('link')}
            onMouseLeave={() => onSetCursorMode?.('default')}
            className={`font-mono-exif text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-current transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'curator'
                ? (isBeige ? 'bg-[#1c1917] text-[#f4efe6]' : 'bg-[#ece7db] text-[#17140f]')
                : (isBeige ? 'hover:bg-[#1c1917]/10' : 'hover:bg-[#ece7db]/15')
            }`}
            title="Curator Studio Admin"
          >
            <Settings className="w-3 h-3" />
            <span className="hidden sm:inline">STUDIO</span>
          </button>

          <button
            onClick={handleOpenMenuClick}
            onMouseEnter={() => onSetCursorMode?.('link')}
            onMouseLeave={() => onSetCursorMode?.('default')}
            className={`lg:hidden p-2 rounded-full border border-current ${
              isBeige ? 'hover:bg-[#1c1917]/10' : 'hover:bg-[#ece7db]/15'
            } transition-colors cursor-pointer`}
            aria-label="Open Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </nav>
    </>
  );
};

