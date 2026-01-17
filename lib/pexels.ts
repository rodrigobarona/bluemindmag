/**
 * Pexels API Integration for Blue Mind Magazine
 * Fetches high-quality ocean and surf photography for all sections
 */

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || process.env.PEXELS_API_URL;
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

// ============================================
// CURATED SEARCH QUERIES BY SECTION
// ============================================

// Hero images - Dramatic, cinematic ocean/surf
const HERO_QUERIES = [
  'ocean waves aerial view',
  'surfer silhouette sunset',
  'underwater ocean blue',
  'beach sunrise golden hour',
  'ocean wave barrel',
  'surfing big waves',
  'ocean horizon calm',
  'tropical beach aerial',
  'stormy ocean waves',
  'pacific ocean sunset',
];

// Quote/atmosphere backgrounds - Subtle, textural
const QUOTE_QUERIES = [
  'ocean horizon minimal',
  'calm sea sunset',
  'beach fog morning',
  'ocean mist',
  'water texture abstract',
  'sea calm blue',
  'sunrise ocean peaceful',
  'dusk beach waves',
];

// Science/research themed
const SCIENCE_QUERIES = [
  'ocean marine life',
  'coral reef underwater',
  'waves underwater',
  'marine biology research',
  'ocean ecosystem',
  'sea creatures underwater',
];

// Surfer lifestyle
const SURFER_QUERIES = [
  'surfer beach lifestyle',
  'surfboard on beach',
  'surfer walking beach',
  'surf culture',
  'beach lifestyle sunset',
  'surfer dawn patrol',
];

// Portugal/Atlantic specific
const PORTUGAL_QUERIES = [
  'portugal coast',
  'atlantic ocean waves',
  'nazare waves portugal',
  'ericeira portugal surf',
  'portuguese beach',
];

// Newsletter/CTA backgrounds
const CTA_QUERIES = [
  'ocean blue gradient',
  'beach aerial view',
  'ocean waves pattern',
  'blue water texture',
  'sea surface ripples',
];

// ============================================
// TYPES
// ============================================

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

export interface ImageResult {
  src: string;
  srcLarge: string;
  srcMedium: string;
  srcSmall: string;
  photographer: string;
  photographerUrl?: string;
  alt: string;
  avgColor: string;
  pexelsUrl?: string;
}

// ============================================
// FALLBACK IMAGES
// ============================================

// Fallback images if API fails or no key
const FALLBACK_HERO_IMAGES: ImageResult[] = [
  {
    src: '/images/hero/ocean-aerial.jpg',
    srcLarge: '/images/hero/ocean-aerial.jpg',
    srcMedium: '/images/hero/ocean-aerial.jpg',
    srcSmall: '/images/hero/ocean-aerial.jpg',
    photographer: 'Pexels',
    alt: 'Aerial view of ocean waves',
    avgColor: '#0d4f6c',
  },
  {
    src: '/images/hero/surfer-sunset.jpg',
    srcLarge: '/images/hero/surfer-sunset.jpg',
    srcMedium: '/images/hero/surfer-sunset.jpg',
    srcSmall: '/images/hero/surfer-sunset.jpg',
    photographer: 'Pexels',
    alt: 'Surfer silhouette at golden sunset',
    avgColor: '#c9956c',
  },
  {
    src: '/images/hero/underwater-blue.jpg',
    srcLarge: '/images/hero/underwater-blue.jpg',
    srcMedium: '/images/hero/underwater-blue.jpg',
    srcSmall: '/images/hero/underwater-blue.jpg',
    photographer: 'Pexels',
    alt: 'Underwater ocean blue light rays',
    avgColor: '#0a3d5c',
  },
  {
    src: '/images/hero/beach-golden-hour.jpg',
    srcLarge: '/images/hero/beach-golden-hour.jpg',
    srcMedium: '/images/hero/beach-golden-hour.jpg',
    srcSmall: '/images/hero/beach-golden-hour.jpg',
    photographer: 'Pexels',
    alt: 'Beach at golden hour with waves',
    avgColor: '#d4a574',
  },
];

const FALLBACK_QUOTE_IMAGES: ImageResult[] = [
  {
    src: '/images/atmosphere/ocean-mist.jpg',
    srcLarge: '/images/atmosphere/ocean-mist.jpg',
    srcMedium: '/images/atmosphere/ocean-mist.jpg',
    srcSmall: '/images/atmosphere/ocean-mist.jpg',
    photographer: 'Pexels',
    alt: 'Ocean mist at dawn',
    avgColor: '#5a7d8c',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if Pexels API is configured
 */
export function isPexelsConfigured(): boolean {
  return !!PEXELS_API_KEY;
}

/**
 * Transform Pexels photo to our ImageResult format
 */
function transformPhoto(photo: PexelsPhoto, query?: string): ImageResult {
  return {
    src: photo.src.original,
    srcLarge: photo.src.large2x,
    srcMedium: photo.src.large,
    srcSmall: photo.src.medium,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    alt: photo.alt || `${query || 'Ocean'} photography`,
    avgColor: photo.avg_color,
    pexelsUrl: photo.url,
  };
}

/**
 * Get random item from array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Fetch images from Pexels API
 */
async function fetchFromPexels(
  query: string,
  options: {
    perPage?: number;
    page?: number;
    orientation?: 'landscape' | 'portrait' | 'square';
  } = {}
): Promise<PexelsSearchResponse | null> {
  if (!PEXELS_API_KEY) {
    return null;
  }

  const { perPage = 1, page = 1, orientation = 'landscape' } = options;

  try {
    const params = new URLSearchParams({
      query,
      per_page: perPage.toString(),
      page: page.toString(),
      orientation,
    });

    const response = await fetch(`${PEXELS_BASE_URL}/search?${params}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      next: {
        // Cache for 1 hour
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      console.error('Pexels API error:', response.status, response.statusText);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Pexels fetch error:', error);
    return null;
  }
}

// ============================================
// PUBLIC API FUNCTIONS
// ============================================

/**
 * Get a random hero image for the homepage
 */
export async function getHeroImage(): Promise<ImageResult | null> {
  const query = getRandomItem(HERO_QUERIES);
  const response = await fetchFromPexels(query, { perPage: 5 });
  
  if (response && response.photos.length > 0) {
    return transformPhoto(getRandomItem(response.photos), query);
  }
  
  return getRandomItem(FALLBACK_HERO_IMAGES);
}

/**
 * Get multiple hero images for sliders/galleries
 */
export async function getHeroImages(count: number = 3): Promise<ImageResult[]> {
  const images: ImageResult[] = [];
  const queries = HERO_QUERIES.slice(0, count);
  
  for (const query of queries) {
    const response = await fetchFromPexels(query, { perPage: 1 });
    
    if (response && response.photos.length > 0) {
      images.push(transformPhoto(response.photos[0], query));
    }
  }
  
  // Fill with fallbacks if needed
  while (images.length < count) {
    images.push(FALLBACK_HERO_IMAGES[images.length % FALLBACK_HERO_IMAGES.length]);
  }
  
  return images;
}

/**
 * Get atmospheric image for quote sections
 */
export async function getQuoteImage(): Promise<ImageResult | null> {
  const query = getRandomItem(QUOTE_QUERIES);
  const response = await fetchFromPexels(query, { perPage: 3 });
  
  if (response && response.photos.length > 0) {
    return transformPhoto(getRandomItem(response.photos), query);
  }
  
  return FALLBACK_QUOTE_IMAGES[0] || null;
}

/**
 * Get science/research themed images
 */
export async function getScienceImage(): Promise<ImageResult | null> {
  const query = getRandomItem(SCIENCE_QUERIES);
  const response = await fetchFromPexels(query, { perPage: 3 });
  
  if (response && response.photos.length > 0) {
    return transformPhoto(getRandomItem(response.photos), query);
  }
  
  return null;
}

/**
 * Get surfer lifestyle images
 */
export async function getSurferImage(): Promise<ImageResult | null> {
  const query = getRandomItem(SURFER_QUERIES);
  const response = await fetchFromPexels(query, { perPage: 3 });
  
  if (response && response.photos.length > 0) {
    return transformPhoto(getRandomItem(response.photos), query);
  }
  
  return null;
}

/**
 * Get Portugal/Atlantic themed images
 */
export async function getPortugalImage(): Promise<ImageResult | null> {
  const query = getRandomItem(PORTUGAL_QUERIES);
  const response = await fetchFromPexels(query, { perPage: 3 });
  
  if (response && response.photos.length > 0) {
    return transformPhoto(getRandomItem(response.photos), query);
  }
  
  return null;
}

/**
 * Get CTA/Newsletter background images
 */
export async function getCtaImage(): Promise<ImageResult | null> {
  const query = getRandomItem(CTA_QUERIES);
  const response = await fetchFromPexels(query, { perPage: 3 });
  
  if (response && response.photos.length > 0) {
    return transformPhoto(getRandomItem(response.photos), query);
  }
  
  return getRandomItem(FALLBACK_HERO_IMAGES);
}

/**
 * Get images for issue highlights (editorial sections)
 */
export async function getSectionImages(sections: string[]): Promise<Map<string, ImageResult>> {
  const imageMap = new Map<string, ImageResult>();
  
  const sectionQueries: Record<string, string[]> = {
    'editors-note': ['ocean horizon peaceful', 'calm sea morning'],
    'meet-the-scientist': SCIENCE_QUERIES,
    'students-peak': ['surfer learning', 'beginner surfing'],
    'surf-science-explained': ['ocean waves physics', 'wave formation'],
    'meet-the-surfer': SURFER_QUERIES,
    'tips-tricks': ['surfboard beach', 'surf equipment'],
    'community-projects': ['beach cleanup', 'surf community'],
    default: HERO_QUERIES,
  };
  
  for (const section of sections) {
    const queries = sectionQueries[section] || sectionQueries.default;
    const query = getRandomItem(queries);
    const response = await fetchFromPexels(query, { perPage: 1 });
    
    if (response && response.photos.length > 0) {
      imageMap.set(section, transformPhoto(response.photos[0], query));
    }
  }
  
  return imageMap;
}

/**
 * Search for specific surf/ocean content
 */
export async function searchSurfImages(
  customQuery: string,
  count: number = 6
): Promise<ImageResult[]> {
  const response = await fetchFromPexels(customQuery, { perPage: count });
  
  if (response && response.photos.length > 0) {
    return response.photos.map(photo => transformPhoto(photo, customQuery));
  }
  
  return [];
}

/**
 * Get curated images by category
 */
export async function getCuratedImages(
  category: 'hero' | 'quote' | 'science' | 'surfer' | 'portugal' | 'cta',
  count: number = 3
): Promise<ImageResult[]> {
  const queryMap: Record<string, string[]> = {
    hero: HERO_QUERIES,
    quote: QUOTE_QUERIES,
    science: SCIENCE_QUERIES,
    surfer: SURFER_QUERIES,
    portugal: PORTUGAL_QUERIES,
    cta: CTA_QUERIES,
  };
  
  const queries = queryMap[category] || HERO_QUERIES;
  const images: ImageResult[] = [];
  
  // Fetch from different queries for variety
  for (let i = 0; i < count && i < queries.length; i++) {
    const response = await fetchFromPexels(queries[i], { perPage: 1 });
    
    if (response && response.photos.length > 0) {
      images.push(transformPhoto(response.photos[0], queries[i]));
    }
  }
  
  return images;
}

/**
 * Get a specific image by Pexels ID
 */
export async function getPhotoById(id: number): Promise<ImageResult | null> {
  if (!PEXELS_API_KEY) return null;
  
  try {
    const response = await fetch(`${PEXELS_BASE_URL}/photos/${id}`, {
      headers: { Authorization: PEXELS_API_KEY },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });
    
    if (!response.ok) return null;
    
    const photo: PexelsPhoto = await response.json();
    return transformPhoto(photo);
  } catch {
    return null;
  }
}
