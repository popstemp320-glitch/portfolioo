import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CollectionCategory, PhotoAsset } from '../types';
import { PlaceholderArtwork } from '../components/PlaceholderArtwork';
import { WEDDINGS_SINGLE_FILE_HTML } from '../data/weddingsSingleFileCode';
import { ArrowLeft, ArrowDown, ChevronLeft, ChevronRight, ArrowUpRight, Camera, Code2, ExternalLink, Copy, Check, X } from 'lucide-react';

interface WeddingsViewProps {
  photos: PhotoAsset[];
  onBack: () => void;
  onSelectPhoto: (photo: PhotoAsset) => void;
  onNavigate?: (view: 'home' | CollectionCategory | 'curator') => void;
  onOpenInquire?: () => void;
  onOpenPricing?: () => void;
  onSetCursorMode?: (mode: 'default' | 'view' | 'drag-horizontal' | 'zoom' | 'link', text?: string) => void;
}

interface WeddingPlateSpec {
  id: string;
  title: string;
  subtitle?: string;
  aspectRatio: '4:5' | '3:2' | '16:9' | '1:1' | '2:3';
  aspectClass: string;
  placeholderUrl: string;
  exifCamera: string;
  exifLens: string;
  plateNumber: string;
}

// Curated high-aesthetic film wedding editorial placeholders matching the video
const WEDDING_EDITORIAL_PLATES: Record<string, WeddingPlateSpec> = {
  // THE DAY (00:06 - 00:26)
  day_candid_laugh: {
    id: 'w-day-01',
    title: 'Laughing in the Meadow Grass',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11',
    exifLens: 'Summilux-M 35mm f/1.4',
    plateNumber: 'PLATE 01',
  },
  day_kiss_hallway: {
    id: 'w-day-02',
    title: 'Sanctuary in the Shadowed Hall',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Contax 645',
    exifLens: 'Zeiss 80mm f/2.0',
    plateNumber: 'PLATE 02',
  },
  day_velvet_bag: {
    id: 'w-day-03',
    title: 'Heirloom Sunburst Velvet Clutch',
    aspectRatio: '1:1',
    aspectClass: 'aspect-square',
    placeholderUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1000&auto=format&fit=crop',
    exifCamera: 'Hasselblad 500C/M',
    exifLens: 'Planar 80mm f/2.8',
    plateNumber: 'PLATE 03',
  },
  day_dinner_toast: {
    id: 'w-day-04',
    title: 'Candlelight Votive & Champagne Glass',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1519225438150-70f1a92e105b?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica MP (35mm Film)',
    exifLens: 'Summicron 50mm f/2.0',
    plateNumber: 'PLATE 04',
  },
  day_couple_meadow: {
    id: 'w-day-05',
    title: 'Golden Hour Stroll on Piedmont Hills',
    aspectRatio: '3:2',
    aspectClass: 'aspect-[3/2]',
    placeholderUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Contax 645',
    exifLens: 'Zeiss 80mm f/2.0',
    plateNumber: 'PLATE 05',
  },
  day_bride_tear: {
    id: 'w-day-06',
    title: 'Unguarded Joy & White Peonies',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11',
    exifLens: 'Noctilux 50mm f/0.95',
    plateNumber: 'PLATE 06',
  },
  day_mariachi_ceremony: {
    id: 'w-day-07',
    title: 'Mariachi Processional Under Virginia Sky',
    aspectRatio: '16:9',
    aspectClass: 'aspect-[16/9]',
    placeholderUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1600&auto=format&fit=crop',
    exifCamera: 'Contax 645',
    exifLens: 'Zeiss Distagon 45mm f/2.8',
    plateNumber: 'PLATE 07',
  },
  day_motion_blur_gown: {
    id: 'w-day-08',
    title: 'Motion & Silk in the Dressing Room',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11',
    exifLens: 'Summilux 35mm f/1.4',
    plateNumber: 'PLATE 08',
  },
  day_dress_stars: {
    id: 'w-day-09',
    title: 'Celestial Pearl Beadwork on Organza',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Macro Zeiss 120mm f/4.0',
    exifLens: 'Contax 645',
    plateNumber: 'PLATE 09',
  },
  day_street_crosswalk: {
    id: 'w-day-10',
    title: 'Joyful Run on 5th Avenue Crosswalk',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11',
    exifLens: 'Summicron 28mm f/2.0',
    plateNumber: 'PLATE 10',
  },
  day_passionate_embrace: {
    id: 'w-day-11',
    title: 'Tender Embrace in Silver Emulsion',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica MP (Ilford HP5+)',
    exifLens: 'Summilux 50mm f/1.4',
    plateNumber: 'PLATE 11',
  },
  day_wax_seals: {
    id: 'w-day-12',
    title: 'Crimson Wax Seals & Hand-Written Vows',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Hasselblad 500C/M',
    exifLens: 'Planar 80mm f/2.8',
    plateNumber: 'PLATE 12',
  },
  day_ring_box: {
    id: 'w-day-13',
    title: 'Heirloom Gold Bands in Velvet Case',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1543290903-883b27b3b4f9?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Zeiss 120mm Macro',
    exifLens: 'Portra 400',
    plateNumber: 'PLATE 13',
  },
  day_clutch_detail: {
    id: 'w-day-14',
    title: 'Gold Starburst Sunburst & Red Velvet',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Contax 645',
    exifLens: 'Zeiss 80mm f/2.0',
    plateNumber: 'PLATE 14',
  },
  day_champagne_cheers: {
    id: 'w-day-15',
    title: 'Coupes Raised in Golden Dusk',
    aspectRatio: '16:9',
    aspectClass: 'aspect-[16/9]',
    placeholderUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1600&auto=format&fit=crop',
    exifCamera: 'Contax 645',
    exifLens: 'Zeiss 80mm f/2.0',
    plateNumber: 'PLATE 15',
  },
  day_bridal_heels: {
    id: 'w-day-16',
    title: 'Ivory Satin Kitten Heels on Parquet',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11',
    exifLens: 'Summilux 35mm f/1.4',
    plateNumber: 'PLATE 16',
  },
  day_perfume_tray: {
    id: 'w-day-17',
    title: 'Antique Gold Gilt Mirror Tray & Jewels',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Hasselblad 500C/M',
    exifLens: 'Planar 80mm f/2.8',
    plateNumber: 'PLATE 17',
  },
  day_tent_silhouette: {
    id: 'w-day-18',
    title: 'Cowboy Hats Under the Pavilion Marquee',
    aspectRatio: '16:9',
    aspectClass: 'aspect-[16/9]',
    placeholderUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop',
    exifCamera: 'Leica MP (Ilford HP5+)',
    exifLens: 'Noctilux 50mm f/0.95',
    plateNumber: 'PLATE 18',
  },

  // PORTRAITS (00:27 - 00:34)
  port_woods_embrace: {
    id: 'w-port-01',
    title: 'Quiet Laughter Under Beech Trees',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Contax 645',
    exifLens: 'Zeiss 80mm f/2.0',
    plateNumber: 'PLATE 19',
  },
  port_grass_dress_circle: {
    id: 'w-port-02',
    title: 'The Radial Symmetry of Lawn & Silk',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11',
    exifLens: 'Summicron 28mm f/2.0',
    plateNumber: 'PLATE 20',
  },
  port_balcony_monument: {
    id: 'w-port-03',
    title: 'Sunlit Terrace & Distant Obelisk',
    aspectRatio: '16:9',
    aspectClass: 'aspect-[16/9]',
    placeholderUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
    exifCamera: 'Contax 645',
    exifLens: 'Zeiss 45mm f/2.8',
    plateNumber: 'PLATE 21',
  },
  port_ballroom_ballerinas: {
    id: 'w-port-04',
    title: 'Dancers Beneath the Crystal Chandelier',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11',
    exifLens: 'Summilux 35mm f/1.4',
    plateNumber: 'PLATE 22',
  },
  port_pink_telephone: {
    id: 'w-port-05',
    title: 'Vintage Rotary Phone & Matchboxes',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1520923642038-b4259acecbd7?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Hasselblad 500C/M',
    exifLens: 'Planar 80mm f/2.8',
    plateNumber: 'PLATE 23',
  },
  port_save_date_card: {
    id: 'w-port-06',
    title: 'Pressed Floral Invitation on Linen',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Contax 645',
    exifLens: 'Zeiss 120mm Macro',
    plateNumber: 'PLATE 24',
  },
  port_cherry_cake: {
    id: 'w-port-07',
    title: 'Buttercream Piping & Glacé Cherry',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11',
    exifLens: 'Summicron 50mm f/2.0',
    plateNumber: 'PLATE 25',
  },
  port_wallpaper_prep: {
    id: 'w-port-08',
    title: 'Veil Adjustment in Floral Damask Room',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Contax 645 (Portra 800)',
    exifLens: 'Zeiss 80mm f/2.0',
    plateNumber: 'PLATE 26',
  },
  port_library_dining: {
    id: 'w-port-09',
    title: 'Candlelight on Dark Wainscoting',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11',
    exifLens: 'Summilux 35mm f/1.4',
    plateNumber: 'PLATE 27',
  },
  port_speakeasy_hug: {
    id: 'w-port-10',
    title: 'Stolen Whisper in the Bar Alcove',
    aspectRatio: '16:9',
    aspectClass: 'aspect-[16/9]',
    placeholderUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
    exifCamera: 'Leica MP (Ilford HP5+)',
    exifLens: 'Noctilux 50mm f/0.95',
    plateNumber: 'PLATE 28',
  },

  // THE PARTY (00:35 - 00:52)
  party_fence_heel: {
    id: 'w-party-01',
    title: 'Adjusting Straps at the Paddock Fence',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11',
    exifLens: 'Summilux 35mm f/1.4',
    plateNumber: 'PLATE 29',
  },
  party_blur_cyan_dress: {
    id: 'w-party-02',
    title: 'Kinetic Motion on the Dance Floor',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11 (1/8th Drag)',
    exifLens: 'Summilux 35mm f/1.4',
    plateNumber: 'PLATE 30',
  },
  party_cake_cutting_kiss: {
    id: 'w-party-03',
    title: 'Frosting and Spontaneous Kiss',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Contax 645',
    exifLens: 'Zeiss 80mm f/2.0',
    plateNumber: 'PLATE 31',
  },
  party_direct_flash_columns: {
    id: 'w-party-04',
    title: 'Dark Sunglasses & Neoclassical Marble',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11 + SF 40 Flash',
    exifLens: 'Elmarit 28mm f/2.8',
    plateNumber: 'PLATE 32',
  },
  party_horse_fence: {
    id: 'w-party-05',
    title: 'Thoroughbred Curiosity at the Pasture Gate',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Contax 645',
    exifLens: 'Zeiss 80mm f/2.0',
    plateNumber: 'PLATE 33',
  },
  party_garden_bar: {
    id: 'w-party-06',
    title: 'Ice Buckets & Garden Parasol',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11',
    exifLens: 'Summicron 35mm f/2.0',
    plateNumber: 'PLATE 34',
  },
  party_bridesmaids_running: {
    id: 'w-party-07',
    title: 'Sprint Across the Autumn Meadow',
    aspectRatio: '16:9',
    aspectClass: 'aspect-[16/9]',
    placeholderUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
    exifCamera: 'Leica MP (Ilford HP5+)',
    exifLens: 'Summilux 35mm f/1.4',
    plateNumber: 'PLATE 35',
  },
  party_toast_tears: {
    id: 'w-party-08',
    title: 'Wiping a Tear During the Best Man Speech',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Contax 645',
    exifLens: 'Zeiss 120mm f/4.0',
    plateNumber: 'PLATE 36',
  },
  party_tiramisu_tower: {
    id: 'w-party-09',
    title: 'Espresso Coupes & Cocoa Dusting',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11',
    exifLens: 'Macro 90mm f/4.0',
    plateNumber: 'PLATE 37',
  },
  party_ivy_arch_veil: {
    id: 'w-party-10',
    title: 'Glow of the Veil in the Boxwood Garden',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Contax 645',
    exifLens: 'Zeiss 80mm f/2.0',
    plateNumber: 'PLATE 38',
  },
  party_convertible_kiss: {
    id: 'w-party-11',
    title: 'Departure in the 1968 Alfa Romeo Spider',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11',
    exifLens: 'Summicron 28mm f/2.0',
    plateNumber: 'PLATE 39',
  },
  party_confetti_walk: {
    id: 'w-party-12',
    title: 'Confetti Blizzard at Midnight Exit',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Leica M11 + Direct Flash',
    exifLens: 'Elmarit 24mm f/2.8',
    plateNumber: 'PLATE 40',
  },
  party_window_silhouette: {
    id: 'w-party-13',
    title: 'Quiet Reflection by the Sheer Curtains',
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    placeholderUrl: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop',
    exifCamera: 'Contax 645 (Ilford Delta 400)',
    exifLens: 'Zeiss 80mm f/2.0',
    plateNumber: 'PLATE 41',
  },
  party_grand_reception_night: {
    id: 'w-party-14',
    title: 'The Room at Full Volume Under Crystal Light',
    aspectRatio: '16:9',
    aspectClass: 'aspect-[16/9]',
    placeholderUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1600&auto=format&fit=crop',
    exifCamera: 'Leica M11 (Ambient Candlelight)',
    exifLens: 'Noctilux 50mm f/0.95',
    plateNumber: 'PLATE 42',
  },
};

const REVIEWS_DATA = [
  {
    author: 'FRANCES + THE KNOT',
    location: 'VIRGINIA COUNTRY ESTATE',
    quote:
      'Sumeet is a TRUE PROFESSIONAL. We had never gotten a professional photo done before, so when we started posing, we felt very awkward, but you wouldn’t be able to tell from these photos. Sumeet made us look AND also feel amazing as he was the natural hype man and kept that energy up for hours into the reception. We had several friends and family members asking where we had found the photographer, because his energy was truly addictive and everyone loved how he made others feel really good during the event. Make sure you have Sumeet as part of your day—you will feel amazing AND leave with amazing and authentic photos.',
  },
  {
    author: 'REANNA & HAWKEYE',
    location: 'RIVERSIDE ON THE POTOMAC',
    quote:
      'Looking through our film scans felt like reliving every second in high definition emotion. He didn’t direct us into awkward statues; he let us breathe, laughed with us, and captured the split-second glances that nobody else even noticed. An absolute master of light and human connection.',
  },
  {
    author: 'SHAWNI & BEN',
    location: 'MANHATTAN TOWNHOUSE',
    quote:
      'The medium format black and whites blew us away. Everyone talks about having nice wedding photos, but these feel like archival museum plates. He was invisible when it mattered and our closest confidant during our portraits. We cannot stop looking at them.',
  },
  {
    author: 'ABIGAIL & MAX',
    location: 'BLUE RIDGE MEADOWS',
    quote:
      'Every guest commented on his demeanor. Calm, deliberate, unfazed by shifting weather, and entirely devoted to the craft. Sumeet is not just a photographer; he is an artist who preserves the soul of a day.',
  },
];

export const WeddingsView: React.FC<WeddingsViewProps> = ({
  photos,
  onBack,
  onSelectPhoto,
  onNavigate,
  onOpenInquire,
  onOpenPricing,
  onSetCursorMode,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState<'the-day' | 'portraits' | 'the-party' | 'stories' | 'reviews'>('the-day');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [hoveredStory, setHoveredStory] = useState<string | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis Smooth Momentum Scrolling + GSAP ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    const onScroll = () => {
      ScrollTrigger.update();
      setScrollY(window.scrollY);

      // Section tracking for fixed TOC
      const sections = ['the-day', 'portraits', 'the-party', 'stories', 'reviews'] as const;
      for (const sectionId of [...sections].reverse()) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    lenis.on('scroll', onScroll);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Setup GSAP animations after DOM elements are ready
    const timer = setTimeout(() => {
      // 1. Photo cards entrance and viewport glide
      const cards = gsap.utils.toArray<HTMLElement>('.gsap-photo-card');
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 45, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              end: 'top 35%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Internal image subtle scrub parallax
        const img = card.querySelector('.gsap-card-img');
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      });

      // 2. Differential column parallax in vertical grid
      const columns = gsap.utils.toArray<HTMLElement>('.gsap-grid-col');
      columns.forEach((col) => {
        const speed = parseFloat(col.getAttribute('data-speed') || '1');
        if (speed !== 1) {
          gsap.to(col, {
            y: (speed - 1) * 140,
            ease: 'none',
            scrollTrigger: {
              trigger: col.closest('.photo-grid-container') || col,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });

      // 3. FIRST HALF MOTION: Sideways movement when scrolled down
      const sidewaysLeftCols = gsap.utils.toArray<HTMLElement>('.gsap-col-sideways-left');
      sidewaysLeftCols.forEach((col) => {
        gsap.fromTo(
          col,
          { x: 35 },
          {
            x: -55,
            ease: 'none',
            scrollTrigger: {
              trigger: col.closest('.photo-grid-container') || col,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });

      const sidewaysRightCols = gsap.utils.toArray<HTMLElement>('.gsap-col-sideways-right');
      sidewaysRightCols.forEach((col) => {
        gsap.fromTo(
          col,
          { x: -35 },
          {
            x: 55,
            ease: 'none',
            scrollTrigger: {
              trigger: col.closest('.photo-grid-container') || col,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });

      const sidewaysStrips = gsap.utils.toArray<HTMLElement>('.gsap-sideways-strip');
      sidewaysStrips.forEach((strip) => {
        gsap.fromTo(
          strip,
          { x: 60 },
          {
            x: -80,
            ease: 'none',
            scrollTrigger: {
              trigger: strip,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });

      // 4. SECOND HALF MOTION: Moves in a different way (Vertical dynamic parallax, 3D tilt & zoom)
      const secondHalfUpCols = gsap.utils.toArray<HTMLElement>('.gsap-second-half-col-up');
      secondHalfUpCols.forEach((col) => {
        gsap.fromTo(
          col,
          { y: 60, scale: 0.98, rotate: 1 },
          {
            y: -85,
            scale: 1.02,
            rotate: -1.2,
            ease: 'none',
            scrollTrigger: {
              trigger: col.closest('.photo-grid-container') || col,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });

      const secondHalfDownCols = gsap.utils.toArray<HTMLElement>('.gsap-second-half-col-down');
      secondHalfDownCols.forEach((col) => {
        gsap.fromTo(
          col,
          { y: -50, scale: 1.02, rotate: -1 },
          {
            y: 90,
            scale: 0.98,
            rotate: 1.2,
            ease: 'none',
            scrollTrigger: {
              trigger: col.closest('.photo-grid-container') || col,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });

      const secondHalfFastCols = gsap.utils.toArray<HTMLElement>('.gsap-second-half-col-fast');
      secondHalfFastCols.forEach((col) => {
        gsap.fromTo(
          col,
          { y: 80, scale: 0.96 },
          {
            y: -115,
            scale: 1.03,
            ease: 'none',
            scrollTrigger: {
              trigger: col.closest('.photo-grid-container') || col,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });

      const secondHalfGlideCols = gsap.utils.toArray<HTMLElement>('.gsap-second-half-col-glide');
      secondHalfGlideCols.forEach((col) => {
        gsap.fromTo(
          col,
          { y: -40, rotate: 1 },
          {
            y: 70,
            rotate: -1,
            ease: 'none',
            scrollTrigger: {
              trigger: col.closest('.photo-grid-container') || col,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });

      const secondHalfScaleTilts = gsap.utils.toArray<HTMLElement>('.gsap-second-half-scale-tilt');
      secondHalfScaleTilts.forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.94, opacity: 0.9 },
          {
            scale: 1.05,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });

      // 5. Editorial text breakouts blur-to-sharp & fade-in
      const breakouts = gsap.utils.toArray<HTMLElement>('.gsap-editorial-breakout');
      breakouts.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 35, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, 120);

    return () => {
      clearTimeout(timer);
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { offset: -40, duration: 1.25 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(WEDDINGS_SINGLE_FILE_HTML);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Safe wrapper for opening photo into Lightbox
  const handlePhotoClick = (spec: WeddingPlateSpec) => {
    // Check if we have a matching asset in the catalog or create a virtual one
    const found = photos.find((p) => p.id === spec.id);
    if (found) {
      onSelectPhoto(found);
    } else {
      const virtualAsset: PhotoAsset = {
        id: spec.id,
        title: spec.title,
        collection: 'weddings',
        romanNumeral: spec.plateNumber.replace('PLATE ', ''),
        aspectRatio: spec.aspectRatio,
        orientation: spec.aspectRatio === '16:9' ? 'landscape' : 'portrait',
        customImageUrl: spec.placeholderUrl,
        placeholderArt: {
          preset: 'analog-warmth',
          palette: ['#1a1a1a', '#e04838', '#ece7db'],
          silhouetteType: 'archway',
          annotation: spec.title,
        },
        exif: {
          camera: spec.exifCamera,
          lens: spec.exifLens,
          focalLength: '50mm',
          aperture: 'f/2.0',
          shutterSpeed: '1/500s',
          iso: 'Portra 400',
          location: 'Mumbai, India & Virginia',
          year: '2026',
        },
        curatorStory: `Archival exposure from the Weddings portfolio. Captured on physical medium format emulsion.`,
        order: 1,
      };
      onSelectPhoto(virtualAsset);
    }
  };

  // Editorial Text Breakout Component (Requirements 3 & 4)
  const EditorialBreakout: React.FC<{
    label?: string;
    quote: string;
    subText?: string;
    glyph?: string;
    actionText?: string;
    onActionClick?: () => void;
  }> = ({
    label,
    quote,
    subText,
    glyph,
    actionText,
    onActionClick,
  }) => {
    return (
      <div
        className="gsap-editorial-breakout my-24 sm:my-32 max-w-3xl mx-auto text-center px-4 relative select-none"
      >
        {glyph && (
          <span className="font-display italic text-lg sm:text-xl text-[#787164] block mb-2.5">
            {glyph}
          </span>
        )}
        {label && (
          <span className="font-mono-exif text-[9px] sm:text-[10px] tracking-[0.35em] text-[#787164] uppercase block mb-6 font-medium">
            {label}
          </span>
        )}
        <p className="font-display italic text-2xl sm:text-3xl md:text-4xl font-light text-[#1c1917] leading-relaxed tracking-tight">
          “{quote}”
        </p>
        {subText && (
          <p className="font-body text-xs sm:text-sm text-[#5c5549] leading-relaxed max-w-lg mx-auto mt-6 tracking-wide">
            {subText}
          </p>
        )}
        {actionText && (
          <button
            onClick={onActionClick}
            className="mt-8 font-mono-exif text-[9px] tracking-[0.3em] text-[#787164] hover:text-[#e04838] transition-colors uppercase inline-flex items-center gap-1.5 group cursor-pointer focus:outline-none"
          >
            <span>{actionText}</span>
            <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
        )}
      </div>
    );
  };

  // Render an editorial photographic placeholder frame against warm beige background with GSAP glide & hover lift
  const renderFrame = (specKey: keyof typeof WEDDING_EDITORIAL_PLATES, customClass = '') => {
    const spec = WEDDING_EDITORIAL_PLATES[specKey];
    if (!spec) return null;

    return (
      <div
        onClick={() => handlePhotoClick(spec)}
        onMouseEnter={() => onSetCursorMode?.('view', 'INSPECT')}
        onMouseLeave={() => onSetCursorMode?.('default')}
        className={`gsap-photo-card group cursor-pointer relative flex flex-col select-none break-inside-avoid mb-8 sm:mb-10 ${customClass}`}
      >
        <div className={`relative w-full overflow-hidden rounded-sm bg-[#faf7f2] border border-[#dfd7c7] group-hover:border-[#e04838] transition-all duration-700 ease-out shadow-[0_8px_30px_rgba(40,30,20,0.08)] group-hover:shadow-[0_20px_45px_rgba(224,72,56,0.18)] group-hover:-translate-y-2 ${spec.aspectClass}`}>
          {/* Real high-res aesthetic placeholder image */}
          <img
            src={spec.placeholderUrl}
            alt={spec.title}
            loading="lazy"
            className="gsap-card-img w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] opacity-95 group-hover:opacity-100"
          />

          {/* Archival film wash overlay */}
          <div className="absolute inset-0 bg-[#f5f0e6]/10 mix-blend-multiply pointer-events-none" />

          {/* Plate Watermark & Hover Metadata Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-[#1c1917]/90 via-[#1c1917]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-baseline justify-between text-left">
            <div>
              <p className="font-mono-exif text-[10px] text-[#f4efe6] uppercase tracking-wider">
                {spec.title}
              </p>
              <p className="font-mono-exif text-[9px] text-[#ff7d70] tracking-widest mt-0.5">
                {spec.exifCamera} · {spec.exifLens}
              </p>
            </div>
            <span className="font-mono-exif text-[9px] tracking-widest text-[#f4efe6]/80 uppercase">
              EXPAND +
            </span>
          </div>

          {/* Corner Plate Stamp (Always visible subtle) */}
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-sm bg-[#faf7f2]/90 backdrop-blur-sm border border-[#dfd7c7] text-[9px] font-mono-exif tracking-widest text-[#1c1917]/80 pointer-events-none shadow-sm">
            {spec.plateNumber}
          </div>
        </div>

        {/* Minimal Under-Frame Label */}
        <div className="mt-2.5 flex items-baseline justify-between px-1 text-[10px] font-mono-exif text-[#787164]">
          <span className="group-hover:text-[#e04838] transition-colors truncate max-w-[75%] font-medium">
            {spec.title}
          </span>
          <span className="text-[9px] tracking-widest uppercase text-[#787164]/80">
            {spec.aspectRatio}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div id="weddings-view" className="relative w-full bg-[#f4efe6] text-[#1c1917] selection:bg-[#e04838]/20 selection:text-[#1c1917]">
      {/* 
        ========================================================================
        1. CINEMATIC HERO SECTION
        Clean atmospheric sky backdrop and monumental "WEDDINGS" typography
        ========================================================================
      */}
      <section className="relative w-full h-screen min-h-[660px] max-h-screen overflow-hidden flex flex-col justify-end items-center pb-12 sm:pb-16 px-6 select-none">
        {/* Soft luminous warm beige atmospheric backdrop */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#ede5d8] via-[#f4efe6] to-[#f4efe6]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-multiply transition-transform duration-300 ease-out"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1800&auto=format&fit=crop)',
              transform: `scale(1.05) translateY(${scrollY * 0.12}px)`,
            }}
          />
          {/* Subtle warm sunlight bloom */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#fffcf5]/70 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* CENTER MONUMENTAL HERO TITLE */}
        <div className="relative z-20 text-center flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display italic text-lg sm:text-xl text-[#787164] mb-2"
          >
            §
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 65, scale: 0.92, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            onMouseEnter={() => onSetCursorMode?.('link', 'WEDDINGS')}
            onMouseLeave={() => onSetCursorMode?.('default')}
            className="group font-display font-light text-6xl sm:text-8xl md:text-9xl lg:text-[7.8rem] tracking-tight uppercase leading-none text-[#1c1917] hover:text-[#e04838] transition-colors duration-500 cursor-pointer select-none drop-shadow-[0_10px_25px_rgba(28,25,23,0.12)] hover:drop-shadow-[0_20px_40px_rgba(224,72,56,0.25)]"
          >
            WEDDINGS
          </motion.h1>

          <motion.span
            initial={{ opacity: 0, y: 25, letterSpacing: '0.6em' }}
            animate={{ opacity: 0.9, y: 0, letterSpacing: '0.4em' }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="font-mono-exif text-[10px] sm:text-xs tracking-[0.4em] text-[#787164] uppercase mt-4 font-medium"
          >
            DOCUMENTARY
          </motion.span>

          {/* Interactive Scroll Down Indicator */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            onClick={() => scrollToSection('the-day')}
            onMouseEnter={() => onSetCursorMode?.('link', 'SCROLL')}
            onMouseLeave={() => onSetCursorMode?.('default')}
            className="group mt-10 flex flex-col items-center gap-2 text-[#787164] hover:text-[#e04838] transition-all duration-300 hover:-translate-y-1 cursor-pointer focus:outline-none"
          >
            <span className="font-mono-exif text-[9px] tracking-[0.3em] uppercase group-hover:drop-shadow-[0_2px_8px_rgba(224,72,56,0.3)]">
              EXPLORE CURATED WORK
            </span>
            <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1 group-hover:text-[#e04838]" />
          </motion.button>
        </div>
      </section>

      {/* 
        ========================================================================
        2. STICKY SIDEBAR: Fixed Left-Side Navigation (Requirement 2)
        Stays in view as user scrolls, active beacon, hover lift & navy blue glow
        ========================================================================
      */}
      <aside className="fixed left-4 sm:left-8 lg:left-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4 font-mono-exif text-[9px] sm:text-[10px] tracking-[0.25em] uppercase select-none">
        {/* Subtle vertical indicator rail */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#1c1917]/15 pointer-events-none" />

        {[
          { id: 'the-day', num: '01', label: 'THE DAY' },
          { id: 'portraits', num: '02', label: 'PORTRAITS' },
          { id: 'the-party', num: '03', label: 'THE PARTY' },
          { id: 'stories', num: '04', label: 'STORIES' },
          { id: 'reviews', num: '05', label: 'REVIEWS' },
        ].map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              onMouseEnter={() => onSetCursorMode?.('link', item.label)}
              onMouseLeave={() => onSetCursorMode?.('default')}
              className={`relative text-left transition-all duration-300 hover:-translate-y-0.5 hover:translate-x-1.5 cursor-pointer flex items-center gap-3 group focus:outline-none ${
                isActive
                  ? 'text-[#0f172a] font-semibold drop-shadow-[0_0_8px_rgba(30,58,138,0.4)]'
                  : 'text-[#787164] hover:text-[#1e3a8a]'
              }`}
            >
              <span
                className={`relative z-10 w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[#1e3a8a] shadow-[0_0_10px_rgba(30,58,138,0.9),0_0_20px_rgba(30,58,138,0.5)] scale-125'
                    : 'bg-[#dfd7c7] border border-[#1c1917]/20 group-hover:bg-[#1e3a8a] group-hover:border-[#1e3a8a] group-hover:shadow-[0_0_8px_rgba(30,58,138,0.6)]'
                }`}
              />
              <span className="opacity-60 text-[8px] font-mono-exif">{item.num}</span>
              <span className={`tracking-[0.22em] ${isActive ? 'text-[#1e3a8a] drop-shadow-[0_0_6px_rgba(30,58,138,0.25)]' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </aside>

      {/* MOBILE STICKY BOTTOM ANCHOR BAR (Requirement 2 for Mobile) */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-[#f4efe6]/95 backdrop-blur-md border border-[#dfd7c7] rounded-full px-4 py-2 flex items-center gap-3 font-mono-exif text-[9px] tracking-widest uppercase shadow-xl overflow-x-auto max-w-[92vw]">
        {[
          { id: 'the-day', label: 'DAY' },
          { id: 'portraits', label: 'PORTRAITS' },
          { id: 'the-party', label: 'PARTY' },
          { id: 'stories', label: 'STORIES' },
          { id: 'reviews', label: 'REVIEWS' },
        ].map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-full transition-colors ${
                isActive ? 'bg-[#e04838] text-white font-medium shadow-md' : 'text-[#787164] hover:text-[#1c1917]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
        <button
          onClick={() => setShowCodeModal(true)}
          className="whitespace-nowrap px-2.5 py-1 rounded-full text-[#e04838] border border-[#e04838]/40 hover:bg-[#e04838]/10 text-[8px] flex items-center gap-1"
        >
          <Code2 className="w-3 h-3" />
          <span>HTML</span>
        </button>
      </div>

      {/* 
        ========================================================================
        3. EDITORIAL BODY CONTENT CONTAINER (4-Column Layout & Scroll Kinetics)
        Warm Linen Beige Canvas (#f4efe6) with Dedicated Sticky Sidebar Margin
        ========================================================================
      */}
      <div className="relative z-10 max-w-[1520px] mx-auto px-6 sm:px-10 md:pl-40 lg:pl-48 xl:pl-56 pr-6 sm:pr-10 lg:pr-16 pt-20 pb-36 space-y-36 overflow-hidden">

        {/* ------------------------------------------------------------------
            SECTION 1: "THE DAY" (First Half of Gallery)
            4-Column Vertical Grid + Editorial Breakouts + Sideways Motion on Scroll
            ------------------------------------------------------------------ */}
        <section id="the-day" className="space-y-20 scroll-mt-24">
          {/* Section Introduction */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-display italic text-lg text-[#787164] block mb-2">
              §
            </span>
            <span className="font-mono-exif text-[10px] tracking-[0.35em] text-[#787164] uppercase block mb-1">
              01 / THE DAY
            </span>
            <span className="font-mono-exif text-[8px] tracking-[0.25em] text-[#e04838] uppercase font-medium">
              4 COLUMNS · FIRST HALF SIDEWAYS KINETICS
            </span>
          </div>

          {/* 4-COLUMN VERTICAL GRID 1: First Half Sideways Parallax */}
          <div className="photo-grid-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-start">
            <div className="gsap-grid-col gsap-col-sideways-left col-1 flex flex-col" data-speed="0.95">
              {renderFrame('day_candid_laugh')}
              {renderFrame('day_dinner_toast')}
            </div>
            <div className="gsap-grid-col gsap-col-sideways-right col-2 flex flex-col sm:pt-10 lg:pt-14" data-speed="1.08">
              {renderFrame('day_velvet_bag')}
              {renderFrame('day_mariachi_ceremony')}
            </div>
            <div className="gsap-grid-col gsap-col-sideways-left col-3 flex flex-col" data-speed="0.98">
              {renderFrame('day_kiss_hallway')}
              {renderFrame('day_couple_meadow')}
            </div>
            <div className="gsap-grid-col gsap-col-sideways-right col-4 flex flex-col sm:pt-6 lg:pt-16" data-speed="1.06">
              {renderFrame('day_bride_tear')}
              {renderFrame('day_clutch_detail')}
            </div>
          </div>

          {/* Editorial Text Breakout 1 */}
          <EditorialBreakout
            quote="Most of your day will happen without direction, so we photograph it that way. Close when it counts. Out of sight when the moment is yours. The portraits are the only part that’s staged, and even those keep moving so they feel like something you lived rather than something you posed for."
            actionText="CONTINUE EXPLORING ↓"
            onActionClick={() => scrollToSection('the-day-centerpiece-1')}
          />

          {/* KINETIC SIDEWAYS FILM STRIP (First Half Horizontal Sideways Ribbon) */}
          <div id="the-day-centerpiece-1" className="w-full py-4 overflow-hidden border-y border-[#dfd7c7]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono-exif text-[9px] tracking-[0.3em] text-[#787164] uppercase">
                PANORAMIC STRIP · SIDEWAYS HORIZONTAL TRANSLATION
              </span>
              <span className="font-mono-exif text-[9px] text-[#e04838] tracking-widest uppercase font-medium">
                SCROLL DRIFT ← →
              </span>
            </div>
            <div className="gsap-sideways-strip flex gap-6 sm:gap-8 w-[125%] -ml-[12%]">
              <div className="w-1/4 flex-shrink-0">
                {renderFrame('day_motion_blur_gown')}
              </div>
              <div className="w-1/4 flex-shrink-0 pt-6">
                {renderFrame('day_wax_seals')}
              </div>
              <div className="w-1/4 flex-shrink-0">
                {renderFrame('day_dress_stars')}
              </div>
              <div className="w-1/4 flex-shrink-0 pt-6">
                {renderFrame('day_ring_box')}
              </div>
            </div>
          </div>

          {/* 4-COLUMN VERTICAL GRID 2: Narrative Details & Intimacy (First Half: Sideways Motion) */}
          <div className="photo-grid-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-start">
            <div className="gsap-grid-col gsap-col-sideways-left col-1 flex flex-col" data-speed="0.95">
              {renderFrame('day_street_crosswalk')}
            </div>
            <div className="gsap-grid-col gsap-col-sideways-right col-2 flex flex-col sm:pt-8 lg:pt-14" data-speed="1.08">
              {renderFrame('day_passionate_embrace')}
            </div>
            <div className="gsap-grid-col gsap-col-sideways-left col-3 flex flex-col" data-speed="1.0">
              {renderFrame('day_bridal_heels')}
              {renderFrame('day_perfume_tray')}
            </div>
            <div className="gsap-grid-col gsap-col-sideways-right col-4 flex flex-col sm:pt-6 lg:pt-10" data-speed="1.06">
              {renderFrame('day_tent_silhouette')}
            </div>
          </div>

          {/* Editorial Text Breakout 2 */}
          <EditorialBreakout
            label="THE SMALL THINGS"
            quote="Everything chosen on purpose gets kept on purpose: the rings, the letters, the borrowed, the red."
          />

          {/* Wide Golden Hour Toast Anchor */}
          <div className="w-full">
            {renderFrame('day_champagne_cheers')}
          </div>
        </section>


        {/* ------------------------------------------------------------------
            SECTION 2: "PORTRAITS" (Second Half of Gallery Begins)
            4-Column Vertical Grid + Second Half Movements (Vertical Parallax & 3D Tilt)
            ------------------------------------------------------------------ */}
        <section id="portraits" className="space-y-20 scroll-mt-24 pt-16 border-t border-[#dfd7c7]">
          {/* Editorial Text Breakout 3 */}
          <EditorialBreakout
            label="02 / PORTRAITS · SECOND HALF MOTION TRANSITION"
            quote="Your wedding isn’t spent posing. We direct in motion, never stiff, so most couples loosen within the first fifteen minutes. Those who’d rather stay close to their guests need only twenty minutes during cocktail hour."
          />

          {/* 4-COLUMN VERTICAL GRID: Portraits in Motion (Second Half: Vertical Dynamic Depth & Tilt) */}
          <div className="photo-grid-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-start">
            <div className="gsap-grid-col gsap-second-half-col-up col-1 flex flex-col" data-speed="0.92">
              {renderFrame('port_woods_embrace')}
              {renderFrame('port_save_date_card')}
            </div>
            <div className="gsap-grid-col gsap-second-half-col-down col-2 flex flex-col sm:pt-10 lg:pt-14" data-speed="1.12">
              {renderFrame('port_grass_dress_circle')}
              {renderFrame('port_cherry_cake')}
            </div>
            <div className="gsap-grid-col gsap-second-half-col-fast col-3 flex flex-col" data-speed="0.88">
              {renderFrame('port_pink_telephone')}
              {renderFrame('port_library_dining')}
            </div>
            <div className="gsap-grid-col gsap-second-half-col-glide col-4 flex flex-col sm:pt-8 lg:pt-12" data-speed="1.06">
              {renderFrame('port_wallpaper_prep')}
              {renderFrame('port_speakeasy_hug')}
            </div>
          </div>

          {/* Editorial Text Breakout 4 */}
          <EditorialBreakout
            label="THE PEOPLE"
            quote="Some frames are planned. The best ones happen while everyone forgets the camera is in the room."
          />

          {/* Wide Balcony Terrace Anchor (3D Perspective Scale & Lift) */}
          <div className="w-full gsap-second-half-scale-tilt">
            {renderFrame('port_balcony_monument')}
          </div>

          {/* Ballroom Ballerinas Focal Card */}
          <div className="max-w-3xl mx-auto gsap-second-half-col-up">
            {renderFrame('port_ballroom_ballerinas')}
          </div>
        </section>


        {/* ------------------------------------------------------------------
            SECTION 3: "THE PARTY" (Second Half Continuation)
            4-Column Vertical Grid + Second Half Movements (Vertical Momentum & Parallax)
            ------------------------------------------------------------------ */}
        <section id="the-party" className="space-y-20 scroll-mt-24 pt-16 border-t border-[#dfd7c7]">
          {/* Editorial Text Breakout 5 */}
          <EditorialBreakout
            label="03 / THE PARTY"
            quote="Later, once the vows are kept and the formalities have burned away, the night loosens into something no timeline can hold. It is the least composed hour and the most worth keeping, the room at full volume, everyone finally and entirely themselves."
          />

          {/* 4-COLUMN VERTICAL GRID 1: Party Dynamics (Second Half: Vertical Climb & Descent) */}
          <div className="photo-grid-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-start">
            <div className="gsap-grid-col gsap-second-half-col-up col-1 flex flex-col" data-speed="0.92">
              {renderFrame('party_fence_heel')}
              {renderFrame('party_bridesmaids_running')}
            </div>
            <div className="gsap-grid-col gsap-second-half-col-down col-2 flex flex-col sm:pt-10 lg:pt-14" data-speed="1.12">
              {renderFrame('party_direct_flash_columns')}
              {renderFrame('party_cake_cutting_kiss')}
            </div>
            <div className="gsap-grid-col gsap-second-half-col-fast col-3 flex flex-col" data-speed="0.88">
              {renderFrame('party_blur_cyan_dress')}
              {renderFrame('party_horse_fence')}
            </div>
            <div className="gsap-grid-col gsap-second-half-col-glide col-4 flex flex-col sm:pt-8 lg:pt-12" data-speed="1.06">
              {renderFrame('party_garden_bar')}
              {renderFrame('party_toast_tears')}
            </div>
          </div>

          {/* Editorial Text Breakout 6 */}
          <EditorialBreakout
            label="THE SPEECH"
            quote="Somebody always cries. It is never who they predicted."
          />

          {/* Editorial Text Breakout 7 */}
          <EditorialBreakout
            label="THE PRACTICAL"
            quote="The unglamorous things, promised plainly. Your full gallery is in your hands within three to four weeks, depending on the season. A second photographer when the day runs in two directions at once. Three cameras, doubled cards, every frame backed up before the night is over, so nothing you lived is ever left to chance."
          />

          {/* Wide Anchor: Ivy Arch Veil Glow */}
          <div className="max-w-4xl mx-auto gsap-second-half-scale-tilt">
            {renderFrame('party_ivy_arch_veil')}
          </div>

          {/* Editorial Text Breakout 8 */}
          <EditorialBreakout
            label="AFTERWARD"
            quote="We had a blast. Wonderful from start to finish. We can’t stop looking at the photos."
            subText="The line that keeps returning in the notes couples send us isn’t about how good we are at showing up in the pictures. The work is quiet, and answering quietly."
          />

          {/* 4-COLUMN VERTICAL GRID 2: Vintage Car, Confetti, Tiramisu & Window */}
          <div className="photo-grid-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-start">
            <div className="gsap-grid-col gsap-second-half-col-up col-1 flex flex-col" data-speed="0.92">
              {renderFrame('party_convertible_kiss')}
            </div>
            <div className="gsap-grid-col gsap-second-half-col-down col-2 flex flex-col sm:pt-10 lg:pt-14" data-speed="1.12">
              {renderFrame('party_confetti_walk')}
            </div>
            <div className="gsap-grid-col gsap-second-half-col-fast col-3 flex flex-col" data-speed="0.88">
              {renderFrame('party_window_silhouette')}
            </div>
            <div className="gsap-grid-col gsap-second-half-col-glide col-4 flex flex-col sm:pt-6 lg:pt-10" data-speed="1.06">
              {renderFrame('party_tiramisu_tower')}
            </div>
          </div>

          {/* Editorial Text Breakout 9 */}
          <EditorialBreakout
            label="THE NIGHT AFTER"
            quote="When the room finally empties, what stays is how it felt."
          />

          {/* Full Volume Reception Grand Finale */}
          <div className="w-full gsap-second-half-scale-tilt">
            {renderFrame('party_grand_reception_night')}
          </div>
        </section>


        {/* ------------------------------------------------------------------
            SECTION 4: "THE STORIES" (Video 00:53)
            Interactive editorial typography list with hover preview & lift
            ------------------------------------------------------------------ */}
        <motion.section
          id="stories"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="scroll-mt-24 pt-20 border-t border-[#dfd7c7]"
        >
          <div className="mb-8">
            <span className="font-mono-exif text-[10px] tracking-[0.35em] text-[#787164] uppercase font-medium">
              04 / THE STORIES
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'reanna-hawkeye',
                title: 'REANNA & HAWKEYE',
                previewImg: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
                location: 'Riverside on the Potomac',
              },
              {
                id: 'shawni-ben',
                title: 'SHAWNI & BEN',
                previewImg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
                location: 'Manhattan Historic Townhouse',
              },
              {
                id: 'abigail-max',
                title: 'ABIGAIL & MAX',
                previewImg: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
                location: 'Blue Ridge Sanctuary',
              },
              {
                id: 'all-stories',
                title: 'ALL VISUAL STORIES',
                previewImg: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop',
                location: 'Exhibition Archive',
              },
            ].map((story) => (
              <div
                key={story.id}
                onMouseEnter={() => {
                  setHoveredStory(story.id);
                  onSetCursorMode?.('link', 'OPEN');
                }}
                onMouseLeave={() => {
                  setHoveredStory(null);
                  onSetCursorMode?.('default');
                }}
                onClick={() => {
                  if (story.id === 'all-stories') {
                    onBack();
                  } else {
                    onOpenInquire?.();
                  }
                }}
                className="group relative flex items-center justify-between py-4 border-b border-[#dfd7c7] cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-baseline gap-4 sm:gap-8">
                  <h3 className="font-display font-light text-3xl sm:text-5xl md:text-6xl tracking-tight uppercase text-[#1c1917] group-hover:text-[#e04838] transition-all duration-300 group-hover:drop-shadow-[0_4px_16px_rgba(224,72,56,0.25)]">
                    {story.title}
                  </h3>
                  <span className="font-mono-exif text-[10px] tracking-[0.2em] text-[#787164] uppercase hidden sm:inline">
                    / {story.location}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[#787164] group-hover:text-[#e04838] transition-colors">
                  <span className="font-mono-exif text-xs tracking-widest uppercase hidden md:inline">
                    VIEW
                  </span>
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>

                {/* Floating Preview Thumbnail that reveals when hovered */}
                {hoveredStory === story.id && (
                  <div className="pointer-events-none absolute right-24 sm:right-36 top-1/2 -translate-y-1/2 z-30 w-36 sm:w-44 aspect-[4/5] rounded-lg overflow-hidden border border-[#e04838] shadow-[0_15px_35px_rgba(224,72,56,0.25)] animate-in fade-in zoom-in-95 duration-200 hidden md:block">
                    <img
                      src={story.previewImg}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>


        {/* ------------------------------------------------------------------
            SECTION 5: "REVIEWS" (Video 00:54 - 00:56)
            Signature watermark, real quotation & interactive carousel
            ------------------------------------------------------------------ */}
        <motion.section
          id="reviews"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="scroll-mt-24 pt-20 border-t border-[#dfd7c7] text-center max-w-3xl mx-auto px-4"
        >
          <div className="mb-6 flex flex-col items-center">
            <span className="font-signature text-3xl sm:text-4xl text-[#1c1917] mb-2">
              sumeetzphotography
            </span>
            <span className="font-mono-exif text-[9px] tracking-[0.35em] text-[#787164] uppercase font-medium">
              05 / CLIENT TESTIMONIALS & PRAISE
            </span>
          </div>

          <div className="relative min-h-[220px] sm:min-h-[180px] flex items-center justify-center">
            <p className="font-body text-sm sm:text-base md:text-lg text-[#1c1917] leading-relaxed font-light italic transition-opacity duration-300">
              “{REVIEWS_DATA[currentReviewIndex].quote}”
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-6">
            <div>
              <span className="font-mono-exif text-xs tracking-[0.25em] text-[#e04838] uppercase font-medium block">
                {REVIEWS_DATA[currentReviewIndex].author}
              </span>
              <span className="font-mono-exif text-[9px] tracking-widest text-[#787164] uppercase mt-1 block">
                {REVIEWS_DATA[currentReviewIndex].location}
              </span>
            </div>

            {/* Interactive Carousel Controls: PREV 01 / 16 NEXT */}
            <div className="flex items-center gap-6 font-mono-exif text-xs tracking-[0.25em] uppercase text-[#1c1917]">
              <button
                onClick={() =>
                  setCurrentReviewIndex((prev) =>
                    prev === 0 ? REVIEWS_DATA.length - 1 : prev - 1
                  )
                }
                onMouseEnter={() => onSetCursorMode?.('link')}
                onMouseLeave={() => onSetCursorMode?.('default')}
                className="hover:text-[#e04838] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-1 focus:outline-none"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>PREV</span>
              </button>

              <span className="text-[#787164] text-[11px]">
                {String(currentReviewIndex + 1).padStart(2, '0')} / {String(REVIEWS_DATA.length).padStart(2, '0')}
              </span>

              <button
                onClick={() =>
                  setCurrentReviewIndex((prev) =>
                    prev === REVIEWS_DATA.length - 1 ? 0 : prev + 1
                  )
                }
                onMouseEnter={() => onSetCursorMode?.('link')}
                onMouseLeave={() => onSetCursorMode?.('default')}
                className="hover:text-[#e04838] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-1 focus:outline-none"
              >
                <span>NEXT</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.section>


        {/* ------------------------------------------------------------------
            SECTION 6: "ONWARD" (Video 00:57 - 00:58)
            Massive editorial links: INQUIRE, PRICING, EDITORIALS, ENGAGEMENTS
            ------------------------------------------------------------------ */}
        <motion.section
          id="onward"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="scroll-mt-24 pt-24 border-t border-[#dfd7c7] space-y-12"
        >
          <div className="text-left">
            <span className="font-mono-exif text-[10px] tracking-[0.3em] text-[#787164] uppercase font-medium">
              ONWARD
            </span>
          </div>

          <div className="space-y-10 sm:space-y-14">
            {/* INQUIRE */}
            <div
              onClick={() => onOpenInquire?.()}
              onMouseEnter={() => onSetCursorMode?.('link', 'COMMISSION')}
              onMouseLeave={() => onSetCursorMode?.('default')}
              className="group cursor-pointer text-left transition-transform duration-300 hover:-translate-y-1.5"
            >
              <span className="font-mono-exif text-[9px] sm:text-[10px] tracking-[0.25em] text-[#787164] group-hover:text-[#e04838] uppercase block transition-colors mb-1 font-medium">
                START HERE
              </span>
              <h2 className="font-display font-light text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] tracking-tight uppercase leading-none text-[#1c1917] group-hover:text-[#e04838] transition-all duration-300 group-hover:drop-shadow-[0_10px_25px_rgba(224,72,56,0.2)]">
                INQUIRE
              </h2>
            </div>

            {/* PRICING */}
            <div
              onClick={() => onOpenPricing?.()}
              onMouseEnter={() => onSetCursorMode?.('link', 'RATES')}
              onMouseLeave={() => onSetCursorMode?.('default')}
              className="group cursor-pointer text-left transition-transform duration-300 hover:-translate-y-1.5"
            >
              <span className="font-mono-exif text-[9px] sm:text-[10px] tracking-[0.25em] text-[#787164] group-hover:text-[#e04838] uppercase block transition-colors mb-1 font-medium">
                MY PHILOSOPHY
              </span>
              <h2 className="font-display font-light text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] tracking-tight uppercase leading-none text-[#1c1917] group-hover:text-[#e04838] transition-all duration-300 group-hover:drop-shadow-[0_10px_25px_rgba(224,72,56,0.2)]">
                PRICING
              </h2>
            </div>

            {/* EDITORIALS */}
            <div
              onClick={() => onNavigate?.('editorials')}
              onMouseEnter={() => onSetCursorMode?.('link', 'VIEW')}
              onMouseLeave={() => onSetCursorMode?.('default')}
              className="group cursor-pointer text-left transition-transform duration-300 hover:-translate-y-1.5"
            >
              <span className="font-mono-exif text-[9px] sm:text-[10px] tracking-[0.25em] text-[#787164] group-hover:text-[#e04838] uppercase block transition-colors mb-1 font-medium">
                PREVIOUS: 04
              </span>
              <h2 className="font-display font-light text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] tracking-tight uppercase leading-none text-[#1c1917] group-hover:text-[#e04838] transition-all duration-300 group-hover:drop-shadow-[0_10px_25px_rgba(224,72,56,0.2)]">
                EDITORIALS
              </h2>
            </div>

            {/* ENGAGEMENTS */}
            <div
              onClick={() => onNavigate?.('engagements')}
              onMouseEnter={() => onSetCursorMode?.('link', 'VIEW')}
              onMouseLeave={() => onSetCursorMode?.('default')}
              className="group cursor-pointer text-left transition-transform duration-300 hover:-translate-y-1.5"
            >
              <span className="font-mono-exif text-[9px] sm:text-[10px] tracking-[0.25em] text-[#787164] group-hover:text-[#e04838] uppercase block transition-colors mb-1 font-medium">
                UP NEXT: 02
              </span>
              <h2 className="font-display font-light text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] tracking-tight uppercase leading-none text-[#1c1917] group-hover:text-[#e04838] transition-all duration-300 group-hover:drop-shadow-[0_10px_25px_rgba(224,72,56,0.2)]">
                ENGAGEMENTS
              </h2>
            </div>
          </div>

          {/* Bottom Footer Credit Strip */}
          <footer className="pt-16 border-t border-[#dfd7c7] flex flex-col sm:flex-row items-center justify-between text-[#787164] font-mono-exif text-[9px] sm:text-[10px] tracking-[0.22em] uppercase gap-4 text-center sm:text-left select-none">
            <span>FILM WEDDING PHOTOGRAPHER · DOCUMENTARY · MUMBAI, INDIA & NATIONWIDE</span>
            <span>WARM ARCHIVAL · TIMELESS EMULSION</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#e04838] transition-colors cursor-pointer"
            >
              TOP ↑
            </button>
          </footer>
        </motion.section>

      </div>

      {/* 
        ========================================================================
        4. STANDALONE SINGLE-FILE HTML DELIVERABLE MODAL (Requirement 4)
        Preview, copy code, and open standalone HTML demo in new tab
        ========================================================================
      */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#faf7f2] border border-[#dfd7c7] rounded-lg shadow-2xl flex flex-col overflow-hidden text-[#1c1917]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#dfd7c7] flex items-center justify-between bg-[#f4efe6]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#e04838]/10 text-[#e04838]">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-[#1c1917] uppercase tracking-wide">
                    Standalone Single-File HTML Solution
                  </h3>
                  <p className="font-mono-exif text-[9px] text-[#787164] tracking-widest uppercase">
                    Embedded Tailwind CSS CDN · GSAP 3.12 · ScrollTrigger · Lenis 1.1 Smooth Scroll
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="p-1.5 rounded text-[#787164] hover:text-[#1c1917] hover:bg-[#1c1917]/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Actions Bar */}
            <div className="px-6 py-3.5 bg-[#ede6d9] border-b border-[#dfd7c7] flex flex-wrap items-center justify-between gap-3 text-xs font-mono-exif">
              <span className="text-[#787164] flex items-center gap-1.5">
                <span>Location:</span>
                <code className="text-[#1c1917] bg-[#faf7f2] px-2 py-0.5 rounded border border-[#dfd7c7]">public/weddings-single-file.html</code>
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="/weddings-single-file.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded bg-[#faf7f2] hover:bg-white text-[#1c1917] border border-[#dfd7c7] transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>OPEN IN NEW TAB</span>
                </a>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-1.5 rounded bg-[#e04838] hover:bg-[#c93b2b] text-white font-medium transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED TO CLIPBOARD!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY SINGLE-FILE HTML</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Snippet Preview Window */}
            <div className="flex-1 overflow-auto p-4 bg-[#1c1917] font-mono text-[11px] text-[#e8e4dc] leading-relaxed selection:bg-[#e04838]/40">
              <pre className="whitespace-pre overflow-x-auto">
                <code>{WEDDINGS_SINGLE_FILE_HTML}</code>
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[#dfd7c7] bg-[#f4efe6] flex items-center justify-between text-[10px] font-mono-exif text-[#787164]">
              <span>Ready for immediate testing or standalone deployment without any build step.</span>
              <button
                onClick={() => setShowCodeModal(false)}
                className="hover:text-[#1c1917] transition-colors uppercase tracking-widest cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
