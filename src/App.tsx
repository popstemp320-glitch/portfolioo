/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CollectionCategory, PhotoAsset } from './types';
import { generateFullCuratedCatalog } from './data/highVolumeCatalog';
import { CustomCursor, CursorMode } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { PortalNavigation } from './components/PortalNavigation';
import { LightboxModal } from './components/LightboxModal';
import { LandingIndex } from './views/LandingIndex';
import { WeddingsView } from './views/WeddingsView';
import { EngagementsView } from './views/EngagementsView';
import { CommercialsView } from './views/CommercialsView';
import { EditorialsView } from './views/EditorialsView';
import { CuratorStudio } from './views/CuratorStudio';
import { InquireModal } from './components/InquireModal';
import { AboutModal } from './components/AboutModal';
import { PricingModal } from './components/PricingModal';
import { MenuDrawer } from './components/MenuDrawer';

const STORAGE_KEY = 'aethelgard_curated_assets_v2';

// Helper to extract view from URL or hash
function getInitialView(): 'home' | CollectionCategory | 'curator' {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase().replace('#', '');

  const check = (str: string): 'home' | CollectionCategory | 'curator' | null => {
    if (str.includes('wedding')) return 'weddings';
    if (str.includes('engagement')) return 'engagements';
    if (str.includes('commercial')) return 'commercials';
    if (str.includes('editorial')) return 'editorials';
    if (str.includes('curator') || str.includes('admin')) return 'curator';
    return null;
  };

  return check(hash) || check(path) || 'home';
}

export default function App() {
  // Preloader state
  const [preloaderActive, setPreloaderActive] = useState(true);

  // View state: 'home' or one of the 4 collections or 'curator' studio
  const [currentView, setCurrentView] = useState<'home' | CollectionCategory | 'curator'>(getInitialView);

  // High-volume photo assets loaded with 500+ plates (120-150 per category)
  const [photoAssets, setPhotoAssets] = useState<PhotoAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 400) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return generateFullCuratedCatalog();
  });

  // Lightbox selection
  const [activeLightboxAsset, setActiveLightboxAsset] = useState<PhotoAsset | null>(null);

  // Custom Cursor state
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [cursorText, setCursorText] = useState<string | undefined>(undefined);

  // Modal dialog states for screenshot features (About, Pricing, Inquire, Menu)
  const [inquireModalOpen, setInquireModalOpen] = useState(false);
  const [inquireDefaultCategory, setInquireDefaultCategory] = useState<string>('weddings');
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  const handleOpenInquire = (category = 'weddings') => {
    setInquireDefaultCategory(category);
    setInquireModalOpen(true);
  };

  const handleSetCursor = (mode: CursorMode, text?: string) => {
    setCursorMode(mode);
    setCursorText(text);
  };

  // Persist asset updates
  const handleUpdateAssets = (newAssets: PhotoAsset[]) => {
    setPhotoAssets(newAssets);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAssets));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  };

  // Reset to full high-volume curated catalog
  const handleResetCatalog = () => {
    if (confirm('Reset catalog to the 500+ master curated exhibition plates?')) {
      const freshCatalog = generateFullCuratedCatalog();
      setPhotoAssets(freshCatalog);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(freshCatalog));
      } catch {
        // ignore
      }
    }
  };

  // Sync view to URL hash and handle browser back/forward
  useEffect(() => {
    if (currentView === 'home') {
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      window.location.hash = currentView;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  useEffect(() => {
    const handleHashChange = () => {
      const nextView = getInitialView();
      setCurrentView(nextView);
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const isWeddingsView = currentView === 'weddings';

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-500 ${
      isWeddingsView ? 'bg-[#f4efe6] text-[#1c1917]' : 'bg-[#17140f] text-[#ece7db]'
    } select-none`}>
      {/* 1. Film Texture, Grain & Ambient Atmosphere:
          SVG Grain Overlay: fixed, low-opacity (4.5%) monochrome noise layer with mix-blend-mode: overlay
      */}
      <div className={`ambient-film-grain ${isWeddingsView ? 'opacity-25' : ''}`} aria-hidden="true" />

      {/* Vignette & Ambient Gradient across gallery viewports (only for dark views) */}
      {!isWeddingsView && <div className="ambient-vignette" aria-hidden="true" />}

      {/* Custom Interactive Context-Aware Magnetic Cursor */}
      <CustomCursor mode={cursorMode} customText={cursorText} />

      {/* Preloader with Minimalist Numeric Ticker */}
      {preloaderActive && (
        <Preloader onComplete={() => setPreloaderActive(false)} />
      )}

      {/* Persistent Floating Header Navigation with mix-blend-mode: difference */}
      <PortalNavigation
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenCurator={() => setCurrentView('curator')}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenPricing={() => setPricingModalOpen(true)}
        onOpenInquire={() => handleOpenInquire('weddings')}
        onOpenMenu={() => setMenuDrawerOpen(true)}
        onSetCursorMode={handleSetCursor}
      />

      {/* Primary Subfolder / View Router */}
      <main id="app-main-content">
        {currentView === 'home' && (
          <LandingIndex
            photoAssets={photoAssets}
            onSelectCollection={(cat) => setCurrentView(cat)}
            onSelectPhoto={(photo) => setActiveLightboxAsset(photo)}
            onOpenInquire={() => handleOpenInquire('weddings')}
            onOpenAbout={() => setAboutModalOpen(true)}
            onOpenPricing={() => setPricingModalOpen(true)}
            onSetCursorMode={handleSetCursor}
          />
        )}

        {currentView === 'weddings' && (
          <WeddingsView
            photos={photoAssets}
            onBack={() => setCurrentView('home')}
            onSelectPhoto={(photo) => setActiveLightboxAsset(photo)}
            onNavigate={(view) => setCurrentView(view)}
            onOpenInquire={() => handleOpenInquire('weddings')}
            onOpenPricing={() => setPricingModalOpen(true)}
            onSetCursorMode={handleSetCursor}
          />
        )}

        {currentView === 'engagements' && (
          <EngagementsView
            photos={photoAssets}
            onBack={() => setCurrentView('home')}
            onSelectPhoto={(photo) => setActiveLightboxAsset(photo)}
            onSetCursorMode={handleSetCursor}
          />
        )}

        {currentView === 'commercials' && (
          <CommercialsView
            photos={photoAssets}
            onBack={() => setCurrentView('home')}
            onSelectPhoto={(photo) => setActiveLightboxAsset(photo)}
            onSetCursorMode={handleSetCursor}
          />
        )}

        {currentView === 'editorials' && (
          <EditorialsView
            photos={photoAssets}
            onBack={() => setCurrentView('home')}
            onSelectPhoto={(photo) => setActiveLightboxAsset(photo)}
            onSetCursorMode={handleSetCursor}
          />
        )}

        {currentView === 'curator' && (
          <CuratorStudio
            photoAssets={photoAssets}
            onUpdateAssets={handleUpdateAssets}
            onResetCatalog={handleResetCatalog}
            onSelectPhoto={(photo) => setActiveLightboxAsset(photo)}
            onClose={() => setCurrentView('home')}
            onSetCursorMode={handleSetCursor}
          />
        )}
      </main>

      {/* Cinematic Lightbox Modal with Deep Immersion & Zero-UI Idle State */}
      {activeLightboxAsset && (
        <LightboxModal
          asset={activeLightboxAsset}
          allAssets={photoAssets}
          onClose={() => setActiveLightboxAsset(null)}
          onNavigate={(photo) => setActiveLightboxAsset(photo)}
        />
      )}

      {/* Inquiry & Commission Modal */}
      <InquireModal
        isOpen={inquireModalOpen}
        onClose={() => setInquireModalOpen(false)}
        defaultCategory={inquireDefaultCategory}
      />

      {/* About Artist & Film Philosophy Modal */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        onOpenInquire={() => {
          setAboutModalOpen(false);
          handleOpenInquire('weddings');
        }}
      />

      {/* Pricing & Investment Collections Modal */}
      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        onOpenInquire={(cat) => {
          setPricingModalOpen(false);
          handleOpenInquire(cat);
        }}
      />

      {/* Full Editorial Menu Drawer Overlay */}
      <MenuDrawer
        isOpen={menuDrawerOpen}
        onClose={() => setMenuDrawerOpen(false)}
        onNavigate={(cat) => {
          setCurrentView(cat);
          setMenuDrawerOpen(false);
        }}
        onOpenAbout={() => {
          setMenuDrawerOpen(false);
          setAboutModalOpen(true);
        }}
        onOpenPricing={() => {
          setMenuDrawerOpen(false);
          setPricingModalOpen(true);
        }}
        onOpenInquire={() => {
          setMenuDrawerOpen(false);
          handleOpenInquire('weddings');
        }}
        onOpenCurator={() => {
          setMenuDrawerOpen(false);
          setCurrentView('curator');
        }}
      />
    </div>
  );
}
