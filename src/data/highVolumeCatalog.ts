import { AspectRatio, CollectionCategory, ImageOrientation, PhotoAsset } from '../types';
import { INITIAL_PHOTO_ASSETS } from './catalog';

// Helper to convert numbers to Roman Numerals (1 to 200)
export function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let result = '';
  let n = num;
  for (const [value, letter] of romanNumerals) {
    while (n >= value) {
      result += letter;
      n -= value;
    }
  }
  return result || 'I';
}

interface SeedConfig {
  collection: CollectionCategory;
  titles: string[];
  locations: string[];
  cameras: string[];
  lenses: string[];
  presets: PhotoAsset['placeholderArt']['preset'][];
  silhouettes: PhotoAsset['placeholderArt']['silhouetteType'][];
  palettes: [string, string, string][];
  stories: string[];
  quotes: string[];
  targetCount: number;
}

const SEED_DATA: Record<CollectionCategory, SeedConfig> = {
  weddings: {
    collection: 'weddings',
    targetCount: 140,
    titles: [
      'The Veil at Villa Cimbrone',
      'Silence in the Cloister of San Francesco',
      'Heirloom Linen & Vow Exchange',
      'Intertwined Hands at Twilight',
      'The Olive Grove Banquet at Dusk',
      'Ascension of the Silk Train',
      'Whispers Beneath Cypress Spires',
      'The Glasshouse Revelry',
      'Morning Mist Over Ravello',
      'The Gilded Altar of Santa Chiara',
      'Balcony Kiss Above the Tyrrhenian',
      'Heirloom Pearl Buttons & Lace',
      'Solemn Procession in Monopoli',
      'Twilight Lanterns on the Trullo Patio',
      'First Dance Under Century Wisteria',
      'The Scent of Orange Blossom & Wax',
      'Unspoken Gaze Before the Campanile',
      'Lace Shadows Across Travertine Floor',
      'Champagne Mist at Midnight',
      'The Departure via Mahogany Runabout',
      'Embrace in the Lemon Pergola',
      'Vows Carved in Pietra Leccese',
      'Solemn Benediction in Matera Cave Church',
      'The Bridal Veil Caught in Sea Breeze',
    ],
    locations: [
      'Ravello, Amalfi Coast',
      'Sorrento, Italy',
      'Gordes, Provence',
      'Val d’Orcia, Tuscany',
      'Scala, Campania',
      'Fiesole, Florence',
      'Cotswolds, UK',
      'Ostuni, Puglia',
      'Lake Como, Italy',
      'Matera, Basilicata',
      'Positano, Italy',
      'Santorini, Greece',
      'Mallorca, Spain',
      'Taormina, Sicily',
    ],
    cameras: ['Leica M11', 'Contax 645', 'Hasselblad 907X 50C', 'Pentax 67 II', 'Leica SL2-S', 'Fuji GFX 100 II'],
    lenses: [
      'Noctilux-M 50mm f/1.2 ASPH',
      'Carl Zeiss Planar 80mm f/2',
      'XCD 38mm f/2.5 V',
      'SMC Pentax 105mm f/2.4',
      'Summilux-SL 35mm f/1.4 ASPH',
      'Summicron-M 35mm f/2 ASPH',
      'Carl Zeiss Sonnar 140mm f/2.8',
    ],
    presets: ['analog-warmth', 'sepia-mist', 'golden-noir', 'terracotta-dusk', 'botanical-moss'],
    silhouettes: ['veil', 'archway', 'monolith', 'botanical', 'minimal-horizon', 'prism'],
    palettes: [
      ['#26221a', '#9c5a3c', '#ece7db'],
      ['#1e1b15', '#5c6046', '#d9d2c1'],
      ['#28241c', '#837c6d', '#ece7db'],
      ['#17140f', '#5c6046', '#ece7db'],
      ['#241f18', '#9c5a3c', '#d9d2c1'],
      ['#191611', '#7a8058', '#ece7db'],
    ],
    stories: [
      'Natural rake light illuminating antique bridal lace. The couple paused in reverent stillness as the midday bells concluded.',
      'Medium format negative exposed at f/2.0 with minimal motion blur, retaining the delicate grain of raw linen.',
      'A quiet, unposed interval on the terracotta loggia overlooking the Mediterranean fog as dusk rolled in.',
      'Lit by thirty beeswax tapers. The heavy silver halide shadows sculpt the emotional contours of the vow exchange.',
      'Caught between two stone columns. The sea breeze lifted the silk tulle into an architectural canopy of ephemeral light.',
    ],
    quotes: [
      '“Light is not something that reveals the subject; light is the subject itself.”',
      '“Architecture, feast, and wilderness meeting at the golden hour.”',
      '“In the stillness of medium format film, the breath slows to match the shutter.”',
    ],
  },

  engagements: {
    collection: 'engagements',
    targetCount: 130,
    titles: [
      'Wind Over the Chalk Cliffs',
      'Dusk at Cap de Formentor',
      'Joshua Tree Monolith Silhouette',
      'The Wooden Skiff on Lake Braies',
      'Rain Dance on the Pont des Arts',
      'High Desert Ember Glow',
      'Salt Mist on Black Sand Beach',
      'Serpentine Ridge at Tre Cime',
      'Twilight Walk on the Sólheimasandur',
      'Embrace in the Redwood Cathedrals',
      'The Ferry Crossing to Fårö Island',
      'The First Snow at Lake Louise',
      'Sand Dunes of Erg Chebbi at Sunset',
      'Granite Spires of El Chaltén',
      'Wind-Blown Wool in the Scottish Highlands',
      'Lighthouse Keeper’s Path at Cape Point',
      'Volcanic Crater Lake Reflection',
      'Wild Heather in Connemara',
      'Morning Frost Over the Grand Teton',
      'The Ochre Canyons of Roussillon',
      'Coastal Pine Shadows at Big Sur',
      'The Timber Boardwalk on Hel Peninsula',
      'Tide Pools at Point Reyes',
      'Misty Pines of Yakushima Forest',
    ],
    locations: [
      'Sussex Coast, UK',
      'Mallorca, Spain',
      'Joshua Tree, California',
      'Prags Dolomites, South Tyrol',
      'Paris, France',
      'Scottsdale, Arizona',
      'Vik, Iceland',
      'Big Sur, California',
      'Isle of Skye, Scotland',
      'Gotland, Sweden',
      'Banff, Canada',
      'Patagonia, Argentina',
    ],
    cameras: ['Pentax 67 II', 'Leica M11', 'Hasselblad 500C/M', 'Contax 645', 'Leica M6', 'Nikon F3 Titanium'],
    lenses: [
      'SMC Pentax 90mm f/2.8',
      'Summilux-M 35mm f/1.4 ASPH',
      'Carl Zeiss Distagon 50mm f/4',
      'Carl Zeiss Planar 80mm f/2',
      'Noctilux-M 50mm f/0.95',
      'SMC Pentax 105mm f/2.4',
    ],
    presets: ['coastal-grain', 'golden-noir', 'terracotta-dusk', 'botanical-moss', 'shadow-geometry'],
    silhouettes: ['waves', 'minimal-horizon', 'monolith', 'archway', 'botanical', 'prism'],
    palettes: [
      ['#1c1a14', '#837c6d', '#ece7db'],
      ['#1a1712', '#9c5a3c', '#ece7db'],
      ['#201c15', '#9c5a3c', '#d9d2c1'],
      ['#171610', '#5c6046', '#ece7db'],
      ['#221d17', '#9c5a3c', '#7a8058'],
    ],
    stories: [
      'Gale-force ocean winds whipped through the couple’s coats on the chalk precipice. The film grain yields a tangible tactile presence to the salt-heavy air.',
      'A spontaneous sprint across wet limestone pebbles as the tide broke. Captured with a high-speed focal-plane shutter.',
      'Deep sculptural shadows cast by ancient monolithic formations at sundown. The scale emphasizes closeness.',
      'Natural ambient dawn light filtering through heavy coastal fog, exposing delicate negative contrast.',
    ],
    quotes: [
      '“Wild intimacy shaped by oceanic gale and limestone white.”',
      '“The landscape is not a backdrop; it is an accomplice in emotion.”',
    ],
  },

  commercials: {
    collection: 'commercials',
    targetCount: 120,
    titles: [
      'Chronomètre Souverain No. 4',
      'Maison Courrèges — Tactile Leather',
      'Brutalist Ceramic Vessel No. 12',
      'Eau de Nil Botanical Distillate',
      'The Cast Aluminum Lounge Chair',
      'Tourbillon Escapement in Rose Gold',
      'Hand-Woven Raw Silk Kimono Textile',
      'Monolithic Obsidian Knife with Damascus Blade',
      'The Sculpted Carrara Marble Bas-Relief',
      'Aged Japanese Cedar Tea Caddy',
      'Minimalist Titanium Eyewear Prototype',
      'Maison Hermès Hand-Stitched Saddle',
      'Blown Heavyweight Crystal Decanter',
      'Pure Cast Bronze Architectural Door Pull',
      'Cold-Pressed Olive Oil Amphora',
      'The Modular Sandstone Fireplace Hearth',
      'Forged Carbon Fiber Chronograph Bezel',
      'Single Origin Sencha in Wood-Fired Vessel',
      'Raw Linen Upholstery & Patinated Walnut',
      'The Hand-Blued Steel Watch Hands',
      'Sculptural Borosilicate Glass Vessel',
      'Brushed Champagne Gold Hardware Suite',
      'Smoked Oak & Travertine Coffee Plinth',
      'Anagama-Fired Stoneware Sake Pitcher',
    ],
    locations: [
      'Geneva, Switzerland',
      'Biarritz, France',
      'Kyoto, Japan',
      'Grasse, France',
      'Milan, Italy',
      'Le Locle, Switzerland',
      'Carrara, Italy',
      'Shigaraki, Japan',
      'Copenhagen, Denmark',
      'Basel, Switzerland',
      'Lyon, France',
    ],
    cameras: ['Hasselblad H6D-100c', 'Phase One IQ4 150MP', 'Leica S3', 'Hasselblad 907X 50C', 'Leica SL2'],
    lenses: [
      'HC Macro 120mm II f/4',
      'Schneider Kreuznach 110mm LS f/2.8',
      'Summarit-S 70mm f/2.5 ASPH (CS)',
      'XCD 90mm f/2.5 V',
      'APO-Macro-Elmarit-TL 60mm f/2.8',
    ],
    presets: ['golden-noir', 'terracotta-dusk', 'shadow-geometry', 'studio-monochrome', 'botanical-moss'],
    silhouettes: ['prism', 'sculpture', 'monolith', 'veil', 'archway', 'minimal-horizon'],
    palettes: [
      ['#14120e', '#7a8058', '#ece7db'],
      ['#1f1a14', '#9c5a3c', '#ece7db'],
      ['#191712', '#837c6d', '#d9d2c1'],
      ['#1a1913', '#5c6046', '#ece7db'],
      ['#181611', '#837c6d', '#ece7db'],
    ],
    stories: [
      'Staged under single-source softbox diffusion with black velvet flags to isolate specular highlights.',
      'A sculptural study of tactile materiality. The raking northern light reveals microscopic grain and hand-honed polish.',
      'Commissioned for a centenary European maison. The balance of negative space honors traditional editorial craftsmanship.',
      'Precision engineering captured at 1:1 reproduction ratio, revealing hand-chamfered anglage.',
    ],
    quotes: [
      '“Precision engineering treated with the reverence of sacred sculpture.”',
      '“True luxury lives in the microscopic silence between materials.”',
    ],
  },

  editorials: {
    collection: 'editorials',
    targetCount: 150,
    titles: [
      'Chiaroscuro in Raw Linen',
      'The Monolithic Concrete Fold',
      'Study of Mineral Formations & Flesh',
      'The Solitary Cypress at Pienza',
      'Prism Refraction & Negative Space',
      'Shadow Contour on Cast Bronze',
      'Draped Silk Over Brutalist Slab',
      'Geometrical Ray on Travertine Wall',
      'Study of Black Sand & Human Form',
      'The Diagonal Rift in Volcanic Tuff',
      'Silver Halide Silhouette at High Noon',
      'Form in Equilibrium: Iron & Ochre',
      'The Curved Horizon of White Gypsum',
      'Veiled Torso in North Skylight',
      'Anatomy of Marble Veins in Seravezza',
      'Darkroom Contact: Tri-X 320 Exposure',
      'The Tension of Suspended Wool Fibers',
      'Cylinder, Cone, and Void',
      'Study in Graphite & Skin Tone',
      'Reflections on a Blackened Copper Basin',
      'The Acute Angle of the Sunken Courtyard',
      'Monochrome Horizon at Lake Salda',
      'The Shadow of a Single Willow Branch',
      'Frail Light Across Raw Concrete Plinth',
    ],
    locations: [
      'Berlin, Germany',
      'Naoshima, Japan',
      'Reykjavik, Iceland',
      'Pienza, Italy',
      'Copenhagen, Denmark',
      'Pietrasanta, Italy',
      'Rotterdam, Netherlands',
      'Vals, Switzerland',
      'Valencia, Spain',
      'Stockholm, Sweden',
      'Marseille, France',
    ],
    cameras: ['Deardorff 8x10 Large Format', 'Leica M11-P', 'Hasselblad 907X 50C', 'Fuji GFX 100 II', 'Contax 645', 'Leica SL2-S'],
    lenses: [
      'Goerz Dagor 12” (305mm) f/6.8',
      'Apo-Summicron-M 50mm f/2 ASPH',
      'XCD 80mm f/1.9',
      'GF 110mm f/2 R LM WR',
      'Carl Zeiss Sonnar 140mm f/2.8',
      'Summilux-M 50mm f/1.4 ASPH',
    ],
    presets: ['studio-monochrome', 'shadow-geometry', 'terracotta-dusk', 'botanical-moss', 'golden-noir', 'analog-warmth'],
    silhouettes: ['veil', 'archway', 'sculpture', 'minimal-horizon', 'prism', 'monolith'],
    palettes: [
      ['#17140f', '#5c6046', '#ece7db'],
      ['#1d1b15', '#837c6d', '#ece7db'],
      ['#221d16', '#9c5a3c', '#d9d2c1'],
      ['#181510', '#5c6046', '#ece7db'],
      ['#16130e', '#7a8058', '#ece7db'],
      ['#1e1a14', '#9c5a3c', '#837c6d'],
    ],
    stories: [
      'A quiet meditation on form and drape. Lit entirely by a single north-facing skylight in a former warehouse studio.',
      'Examining the tactile resonance between raw stone and organic form. Exposed on monochrome sheet film.',
      'An acute study of architectural shadows moving across board-formed concrete at 42 degrees azimuth.',
      'Direct beam of Nordic autumn sunlight fractured through optical triangular crown glass onto raw plaster.',
    ],
    quotes: [
      '“In the stillness of large format sheets, the human breath slows to match the shutter.”',
      '“Patience in fine-art photography is learning how to listen before pressing the cable release.”',
    ],
  },
};

// Generate full high-volume catalog with 120-150 items per collection
export function generateFullCuratedCatalog(): PhotoAsset[] {
  const result: PhotoAsset[] = [...INITIAL_PHOTO_ASSETS];

  (['weddings', 'engagements', 'commercials', 'editorials'] as CollectionCategory[]).forEach(
    (collection) => {
      const config = SEED_DATA[collection];
      const existing = result.filter((p) => p.collection === collection);
      const needed = config.targetCount - existing.length;

      for (let i = 0; i < needed; i++) {
        const index = existing.length + i + 1;
        const roman = toRoman(index);

        // Deterministic alternating attributes for beautiful non-uniform rhythm
        const titleBase = config.titles[i % config.titles.length];
        const title = i >= config.titles.length ? `${titleBase} (Study ${toRoman((i % 8) + 1)})` : titleBase;

        const location = config.locations[i % config.locations.length];
        const camera = config.cameras[i % config.cameras.length];
        const lens = config.lenses[i % config.lenses.length];
        const preset = config.presets[i % config.presets.length];
        const silhouette = config.silhouettes[i % config.silhouettes.length];
        const palette = config.palettes[i % config.palettes.length];
        const story = config.stories[i % config.stories.length];
        const quote = i % 5 === 0 ? config.quotes[i % config.quotes.length] : undefined;

        // Non-uniform aspect ratio rhythm: 4:5 portraits blended with 3:2 landscapes, occasional 16:9 panoramic pauses
        let aspectRatio: AspectRatio = '4:5';
        let orientation: ImageOrientation = 'portrait';
        let isHero = false;
        let isDiptych = false;

        if (index % 15 === 0) {
          aspectRatio = '16:9';
          orientation = 'panoramic';
          isHero = true;
        } else if (index % 7 === 0) {
          aspectRatio = '3:2';
          orientation = 'landscape';
        } else if (index % 9 === 0) {
          aspectRatio = '1:1';
          orientation = 'square';
        } else if (index % 6 === 0) {
          isDiptych = true;
        }

        const shutterSpeeds = ['1/250s', '1/500s', '1/1000s', '1/320s', '1/125s', '1/60s'];
        const apertures = ['f/1.2', 'f/1.4', 'f/2.0', 'f/2.8', 'f/4.0', 'f/5.6'];
        const isos = ['ISO 64', 'ISO 100', 'ISO 160', 'ISO 400', 'Portra 400', 'Tri-X 400'];

        const photo: PhotoAsset = {
          id: `${collection}-${String(index).padStart(3, '0')}`,
          title: title,
          collection: collection,
          romanNumeral: roman,
          aspectRatio: aspectRatio,
          orientation: orientation,
          isHero: isHero,
          isDiptych: isDiptych,
          placeholderArt: {
            preset: preset,
            palette: palette,
            silhouetteType: silhouette,
            annotation: `${collection.toUpperCase()} · PLATE ${roman} · ARCHIVAL SHEET`,
            grainDensity: 4,
          },
          exif: {
            camera: camera,
            lens: lens,
            focalLength: lens.match(/\d+mm/)?.[0] || '50mm',
            aperture: apertures[i % apertures.length],
            shutterSpeed: shutterSpeeds[i % shutterSpeeds.length],
            iso: isos[i % isos.length],
            location: location,
            year: `${2024 + (i % 3)}`,
          },
          curatorStory: story,
          curatorQuote: quote,
          order: index,
        };

        result.push(photo);
      }
    }
  );

  return result;
}
