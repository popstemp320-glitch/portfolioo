export type CollectionCategory = 'weddings' | 'engagements' | 'commercials' | 'editorials';

export type AspectRatio = '3:2' | '4:5' | '16:9' | '1:1' | '2:3';

export type ImageOrientation = 'landscape' | 'portrait' | 'panoramic' | 'square';

export interface ExifData {
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
  location: string;
  year?: string;
}

export interface PhotoAsset {
  id: string;
  title: string;
  collection: CollectionCategory;
  romanNumeral: string;
  aspectRatio: AspectRatio;
  orientation: ImageOrientation;
  isHero?: boolean;
  isDiptych?: boolean;
  diptychPairId?: string;
  placeholderArt: {
    preset: 'analog-warmth' | 'golden-noir' | 'sepia-mist' | 'botanical-moss' | 'terracotta-dusk' | 'shadow-geometry' | 'coastal-grain' | 'studio-monochrome';
    palette: [string, string, string]; // [primary, accent, subtle]
    silhouetteType: 'monolith' | 'archway' | 'botanical' | 'prism' | 'waves' | 'sculpture' | 'minimal-horizon' | 'veil';
    annotation: string;
    grainDensity?: number;
  };
  customImageUrl?: string; // If uploaded via Curator Studio
  exif: ExifData;
  curatorStory: string;
  curatorQuote?: string;
  order: number;
}

export interface CollectionMeta {
  id: CollectionCategory;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  scrollSignatureName: string;
  scrollSignatureDesc: string;
  heroAssetId: string;
  totalFrames: number;
}
