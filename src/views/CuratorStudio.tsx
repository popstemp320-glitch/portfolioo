import React, { useState } from 'react';
import { CollectionCategory, PhotoAsset, AspectRatio, ImageOrientation } from '../types';
import { PlaceholderArtwork } from '../components/PlaceholderArtwork';
import {
  UploadCloud,
  Plus,
  Trash2,
  Eye,
  Lock,
  Unlock,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface CuratorStudioProps {
  photoAssets: PhotoAsset[];
  onUpdateAssets: (newAssets: PhotoAsset[]) => void;
  onResetCatalog: () => void;
  onSelectPhoto: (photo: PhotoAsset) => void;
  onClose: () => void;
  onSetCursorMode?: (mode: 'default' | 'view' | 'drag-horizontal' | 'zoom' | 'link', text?: string) => void;
}

export const CuratorStudio: React.FC<CuratorStudioProps> = ({
  photoAssets,
  onUpdateAssets,
  onResetCatalog,
  onSelectPhoto,
  onClose,
  onSetCursorMode,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default accessible for frictionless curator experience
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Filtering in visualizer
  const [selectedFilter, setSelectedFilter] = useState<'all' | CollectionCategory>('all');

  // New asset modal / form
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCollection, setNewCollection] = useState<CollectionCategory>('weddings');
  const [newAspectRatio, setNewAspectRatio] = useState<AspectRatio>('4:5');
  const [newOrientation, setNewOrientation] = useState<ImageOrientation>('portrait');
  const [newCamera, setNewCamera] = useState('Leica M11');
  const [newLens, setNewLens] = useState('Summilux-M 50mm f/1.4');
  const [newFocalLength, setNewFocalLength] = useState('50mm');
  const [newAperture, setNewAperture] = useState('f/1.4');
  const [newShutter, setNewShutter] = useState('1/1000s');
  const [newIso, setNewIso] = useState('ISO 100');
  const [newLocation, setNewLocation] = useState('Kyoto, Japan');
  const [newCuratorStory, setNewCuratorStory] = useState(
    'Captured under natural rake lighting on fine-grain monochrome sheet.'
  );
  const [isHero, setIsHero] = useState(false);
  const [uploadedImageDataUrl, setUploadedImageDataUrl] = useState<string | null>(null);

  // Handle file drop
  const handleDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImageDataUrl(event.target.result as string);
            setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
            setIsAddingNew(true);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleManualFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImageDataUrl(event.target.result as string);
          setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
          setIsAddingNew(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Asset Submission
  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const count = photoAssets.filter((p) => p.collection === newCollection).length;
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

    const newAsset: PhotoAsset = {
      id: `${newCollection}-${Date.now()}`,
      title: newTitle || 'Untitled Study',
      collection: newCollection,
      romanNumeral: romanNumerals[count % romanNumerals.length] || 'X',
      aspectRatio: newAspectRatio,
      orientation: newOrientation,
      isHero: isHero,
      placeholderArt: {
        preset: 'analog-warmth',
        palette: ['#26221a', '#7a8058', '#ece7db'],
        silhouetteType: 'monolith',
        annotation: `${newCollection.toUpperCase()} · CURATOR STUDIO MASTER`,
      },
      customImageUrl: uploadedImageDataUrl || undefined,
      exif: {
        camera: newCamera,
        lens: newLens,
        focalLength: newFocalLength,
        aperture: newAperture,
        shutterSpeed: newShutter,
        iso: newIso,
        location: newLocation,
        year: '2026',
      },
      curatorStory: newCuratorStory,
      order: count + 1,
    };

    onUpdateAssets([newAsset, ...photoAssets]);
    setIsAddingNew(false);
    setUploadedImageDataUrl(null);
    setNewTitle('');
  };

  // Delete Asset
  const handleDeleteAsset = (id: string) => {
    if (confirm('Remove this photographic asset from the curated collection?')) {
      onUpdateAssets(photoAssets.filter((a) => a.id !== id));
    }
  };

  const filteredAssets =
    selectedFilter === 'all'
      ? photoAssets
      : photoAssets.filter((a) => a.collection === selectedFilter);

  return (
    <div id="curator-studio-root" className="relative min-h-screen bg-[#17140f] text-[#ece7db] pt-28 md:pt-36 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#ece7db]/10 pb-8 mb-12">
          <div>
            <button
              onClick={onClose}
              onMouseEnter={() => onSetCursorMode?.('link')}
              onMouseLeave={() => onSetCursorMode?.('default')}
              className="inline-flex items-center gap-2 font-mono-exif text-xs text-[#837c6d] hover:text-[#ece7db] tracking-[0.2em] uppercase transition-colors mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO PORTFOLIO</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="font-mono-exif text-[11px] text-[#7a8058] tracking-[0.3em] uppercase">
                ADMIN CONSOLE
              </span>
              <span className="text-[#837c6d]">·</span>
              <span className="font-mono-exif text-[11px] text-[#837c6d] tracking-widest">
                AUTHENTICATED AS CHIEF CURATOR
              </span>
            </div>
            <h1 className="font-display font-light text-4xl sm:text-5xl text-[#ece7db] tracking-tight mt-1">
              Curator Studio.
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetCatalog}
              className="px-4 py-2 rounded-full border border-[#ece7db]/15 hover:border-[#9c5a3c] bg-[#26221a]/60 text-xs font-mono-exif text-[#d9d2c1] hover:text-[#ece7db] transition-colors cursor-pointer flex items-center gap-2"
              title="Reset to default fine-art catalog"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#9c5a3c]" />
              <span>RESET CATALOG</span>
            </button>

            <button
              onClick={() => setIsAddingNew(true)}
              className="px-5 py-2 rounded-full bg-[#7a8058] hover:bg-[#5c6046] text-[#17140f] hover:text-[#ece7db] text-xs font-mono-exif font-semibold tracking-wider transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>NEW ASSET</span>
            </button>
          </div>
        </div>

        {/* Drag & Drop Batch Upload Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropFiles}
          className="w-full border-2 border-dashed border-[#ece7db]/20 hover:border-[#7a8058] rounded-lg p-8 sm:p-12 text-center bg-[#1e1b15]/60 hover:bg-[#1e1b15] transition-all duration-300 mb-16 cursor-pointer relative group"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleManualFileInput}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="max-w-md mx-auto flex flex-col items-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-[#26221a] border border-[#ece7db]/15 flex items-center justify-center text-[#7a8058] group-hover:scale-110 transition-transform mb-4 shadow-xl">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl text-[#ece7db]">
              Drop Raw or Processed Photographs Here
            </h3>
            <p className="font-mono-exif text-xs text-[#837c6d] tracking-wider mt-2">
              Accepts high-res JPG, PNG, or AVIF. Automatically provisions EXIF fields, aspect ratios, and archival indexing.
            </p>
            <span className="mt-4 inline-block px-4 py-1.5 rounded-full border border-[#ece7db]/15 text-[10px] font-mono-exif text-[#7a8058] tracking-widest uppercase">
              OR CLICK TO BROWSE LOCAL FILES
            </span>
          </div>
        </div>

        {/* Filter Tabs & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ece7db]/10 pb-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {(['all', 'weddings', 'engagements', 'commercials', 'editorials'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono-exif tracking-wider uppercase transition-all cursor-pointer ${
                    selectedFilter === cat
                      ? 'bg-[#ece7db] text-[#17140f] font-semibold'
                      : 'text-[#837c6d] hover:text-[#ece7db] bg-[#26221a]/50'
                  }`}
                >
                  {cat} ({cat === 'all' ? photoAssets.length : photoAssets.filter((p) => p.collection === cat).length})
                </button>
              )
            )}
          </div>

          <span className="font-mono-exif text-xs text-[#837c6d]">
            {filteredAssets.length} PLATES CURATED
          </span>
        </div>

        {/* Asset Pool Visualizer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAssets.map((photo) => (
            <div
              key={photo.id}
              className="bg-[#1e1b15] border border-[#ece7db]/10 rounded-sm overflow-hidden flex flex-col justify-between group hover:border-[#7a8058]/50 transition-colors shadow-lg"
            >
              <div>
                <div className="relative">
                  <PlaceholderArtwork
                    asset={photo}
                    showExifOverlay={false}
                    aspectRatioClass="aspect-[4/5]"
                  />
                  {photo.customImageUrl && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#7a8058] text-[#17140f] font-mono-exif text-[9px] font-bold">
                      USER ASSET
                    </span>
                  )}
                  {photo.isHero && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#9c5a3c] text-[#ece7db] font-mono-exif text-[9px] font-bold">
                      HERO
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between text-[10px] font-mono-exif text-[#837c6d]">
                    <span className="uppercase text-[#7a8058]">{photo.collection}</span>
                    <span>PLATE {photo.romanNumeral}</span>
                  </div>
                  <h4 className="font-display text-base text-[#ece7db] mt-1 truncate">
                    {photo.title}
                  </h4>
                  <p className="font-mono-exif text-[10px] text-[#837c6d] mt-2 truncate">
                    {photo.exif.camera} · {photo.exif.lens}
                  </p>
                  <p className="font-mono-exif text-[9px] text-[#837c6d]/80 mt-1 truncate">
                    {photo.exif.location} · {photo.aspectRatio}
                  </p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-3 bg-[#17140f]/60 border-t border-[#ece7db]/10 flex items-center justify-between">
                <button
                  onClick={() => onSelectPhoto(photo)}
                  className="text-xs font-mono-exif text-[#7a8058] hover:text-[#ece7db] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>PREVIEW</span>
                </button>
                <button
                  onClick={() => handleDeleteAsset(photo.id)}
                  className="text-xs font-mono-exif text-[#9c5a3c] hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>REMOVE</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: New Asset / Bespoke Placeholder Generator */}
        {isAddingNew && (
          <div className="fixed inset-0 z-50 bg-[#17140f]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#1e1b15] border border-[#ece7db]/20 rounded-lg max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#ece7db]/10 pb-4 mb-6">
                <div>
                  <span className="font-mono-exif text-[10px] text-[#7a8058] tracking-[0.2em] uppercase">
                    CURATOR METADATA ENGINE
                  </span>
                  <h3 className="font-display text-2xl text-[#ece7db]">
                    {uploadedImageDataUrl ? 'Publish Uploaded Photographic Print' : 'Add Bespoke Curated Asset'}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    setUploadedImageDataUrl(null);
                  }}
                  className="text-[#837c6d] hover:text-[#ece7db] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateAsset} className="space-y-6">
                {uploadedImageDataUrl && (
                  <div className="p-3 bg-[#17140f] rounded border border-[#ece7db]/10 flex items-center gap-4">
                    <img
                      src={uploadedImageDataUrl}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded border border-[#ece7db]/10"
                    />
                    <div>
                      <p className="font-mono-exif text-xs text-[#ece7db]">Uploaded Image Attached</p>
                      <p className="font-mono-exif text-[10px] text-[#7a8058]">Ready for exhibition catalog</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-mono-exif text-xs text-[#837c6d] uppercase mb-1">
                    Exhibition Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. The Morning Mist at Villa Cimbrone"
                    className="w-full bg-[#17140f] border border-[#ece7db]/15 rounded px-3.5 py-2 text-[#ece7db] font-display text-lg focus:outline-none focus:border-[#7a8058]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono-exif text-xs text-[#837c6d] uppercase mb-1">
                      Collection Category
                    </label>
                    <select
                      value={newCollection}
                      onChange={(e) => setNewCollection(e.target.value as CollectionCategory)}
                      className="w-full bg-[#17140f] border border-[#ece7db]/15 rounded px-3 py-2 text-[#ece7db] font-mono-exif text-xs focus:outline-none focus:border-[#7a8058]"
                    >
                      <option value="weddings">Weddings</option>
                      <option value="engagements">Engagements</option>
                      <option value="commercials">Commercials</option>
                      <option value="editorials">Editorials</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono-exif text-xs text-[#837c6d] uppercase mb-1">
                      Aspect Ratio
                    </label>
                    <select
                      value={newAspectRatio}
                      onChange={(e) => setNewAspectRatio(e.target.value as AspectRatio)}
                      className="w-full bg-[#17140f] border border-[#ece7db]/15 rounded px-3 py-2 text-[#ece7db] font-mono-exif text-xs focus:outline-none focus:border-[#7a8058]"
                    >
                      <option value="4:5">4:5 (Standard Medium Format)</option>
                      <option value="3:2">3:2 (35mm Classic)</option>
                      <option value="16:9">16:9 (Panoramic Break)</option>
                      <option value="1:1">1:1 (Square Hasselblad)</option>
                    </select>
                  </div>
                </div>

                {/* Technical EXIF */}
                <div className="p-4 bg-[#17140f]/70 rounded border border-[#ece7db]/10 space-y-4">
                  <span className="font-mono-exif text-[10px] text-[#7a8058] tracking-widest uppercase block">
                    EXIF METADATA SPECIFICATIONS
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono-exif text-xs">
                    <div>
                      <label className="text-[10px] text-[#837c6d] block mb-1">CAMERA BODY</label>
                      <input
                        type="text"
                        value={newCamera}
                        onChange={(e) => setNewCamera(e.target.value)}
                        className="w-full bg-[#17140f] border border-[#ece7db]/15 rounded px-2.5 py-1.5 text-[#ece7db]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#837c6d] block mb-1">LENS</label>
                      <input
                        type="text"
                        value={newLens}
                        onChange={(e) => setNewLens(e.target.value)}
                        className="w-full bg-[#17140f] border border-[#ece7db]/15 rounded px-2.5 py-1.5 text-[#ece7db]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#837c6d] block mb-1">FOCAL LENGTH</label>
                      <input
                        type="text"
                        value={newFocalLength}
                        onChange={(e) => setNewFocalLength(e.target.value)}
                        className="w-full bg-[#17140f] border border-[#ece7db]/15 rounded px-2.5 py-1.5 text-[#ece7db]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#837c6d] block mb-1">APERTURE</label>
                      <input
                        type="text"
                        value={newAperture}
                        onChange={(e) => setNewAperture(e.target.value)}
                        className="w-full bg-[#17140f] border border-[#ece7db]/15 rounded px-2.5 py-1.5 text-[#ece7db]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#837c6d] block mb-1">SHUTTER SPEED</label>
                      <input
                        type="text"
                        value={newShutter}
                        onChange={(e) => setNewShutter(e.target.value)}
                        className="w-full bg-[#17140f] border border-[#ece7db]/15 rounded px-2.5 py-1.5 text-[#ece7db]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#837c6d] block mb-1">LOCATION TAG</label>
                      <input
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full bg-[#17140f] border border-[#ece7db]/15 rounded px-2.5 py-1.5 text-[#ece7db]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-mono-exif text-xs text-[#837c6d] uppercase mb-1">
                    Curator Story & Backstory (2 Sentences)
                  </label>
                  <textarea
                    rows={3}
                    value={newCuratorStory}
                    onChange={(e) => setNewCuratorStory(e.target.value)}
                    className="w-full bg-[#17140f] border border-[#ece7db]/15 rounded px-3 py-2 text-[#d9d2c1] font-body text-sm focus:outline-none focus:border-[#7a8058]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="heroCheck"
                    checked={isHero}
                    onChange={(e) => setIsHero(e.target.checked)}
                    className="rounded border-[#ece7db]/20 bg-[#17140f] text-[#7a8058]"
                  />
                  <label htmlFor="heroCheck" className="font-mono-exif text-xs text-[#ece7db] cursor-pointer">
                    Featured Hero Asset in Collection
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ece7db]/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                      setUploadedImageDataUrl(null);
                    }}
                    className="px-4 py-2 rounded-full border border-[#ece7db]/15 text-xs font-mono-exif text-[#837c6d] hover:text-[#ece7db] cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#ece7db] text-[#17140f] hover:bg-[#7a8058] text-xs font-mono-exif font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    COMMIT TO CATALOG
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
