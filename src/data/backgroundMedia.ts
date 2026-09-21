export interface BackgroundMediaItem {
  id: string;
  category: 'default' | 'weddings' | 'engagements' | 'commercials' | 'editorials' | 'visual_stories' | 'editorial_exchange';
  title: string;
  subtitle: string;
  videoUrl?: string;
  imageUrl: string;
  location: string;
  quote?: string;
}

export const DEFAULT_BACKGROUND_MEDIA: Record<string, BackgroundMediaItem> = {
  default: {
    id: 'bg-default',
    category: 'default',
    title: 'New York Skyline at Sunset',
    subtitle: 'Golden Hour Promenade Embrace',
    // Atmospheric city skyline couple video loop
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-along-a-pier-at-sunset-41712-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop',
    location: 'Brooklyn Bridge Promenade · New York',
    quote: '“The golden city suspended between water and sky.”',
  },
  weddings: {
    id: 'bg-weddings',
    category: 'weddings',
    title: 'The Veil at Villa Cimbrone',
    subtitle: 'Silk Train in Mediterranean Sea Breeze',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-holding-a-bouquet-at-a-wedding-41873-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
    location: 'Ravello · Amalfi Coast',
    quote: '“Architecture, vows, and sunlight meeting at dusk.”',
  },
  engagements: {
    id: 'bg-engagements',
    category: 'engagements',
    title: 'Wind Over the Coastal Cliffs',
    subtitle: 'Oceanic Gale & Raw Intimacy',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-couple-walking-holding-hands-on-the-beach-at-sunset-41708-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=2070&auto=format&fit=crop',
    location: 'Cap de Formentor · Mallorca',
    quote: '“The landscape is not a backdrop; it is an accomplice in emotion.”',
  },
  commercials: {
    id: 'bg-commercials',
    category: 'commercials',
    title: 'Haute Horlogerie & Precious Alloys',
    subtitle: 'Sculpted Studio Lighting on Raw Craft',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-watchmaker-repairing-a-clock-41724-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop',
    location: 'Geneva Atelier · Switzerland',
    quote: '“Precision engineering treated with the reverence of sacred sculpture.”',
  },
  editorials: {
    id: 'bg-editorials',
    category: 'editorials',
    title: 'Chiaroscuro in Raw Linen',
    subtitle: 'Monochrome Shadow & High Fashion Contours',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-dramatic-studio-lighting-42148-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2076&auto=format&fit=crop',
    location: 'Berlin Atelier · Germany',
    quote: '“Form in equilibrium: large format silver halide sheets.”',
  },
  visual_stories: {
    id: 'bg-visual-stories',
    category: 'visual_stories',
    title: 'All Visual Stories',
    subtitle: 'Archival Cinematography Anthology',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-shot-of-the-city-at-sunset-42352-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=2070&auto=format&fit=crop',
    location: 'Nationwide & European Archival Sessions',
    quote: '“Every frame an unrepeatable poem of light.”',
  },
  editorial_exchange: {
    id: 'bg-editorial-exchange',
    category: 'editorial_exchange',
    title: 'The Darkroom Contact Sheet',
    subtitle: 'Silver Halide & Physical Emulsion',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-artist-sketching-in-his-studio-41731-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2074&auto=format&fit=crop',
    location: 'Archival Darkroom · Paris',
    quote: '“Tangible silver, slow chemistry, and permanence.”',
  },
};
