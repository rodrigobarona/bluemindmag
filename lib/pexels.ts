/**
 * Pexels API Integration for Blue Mind Magazine
 * Fetches high-quality ocean and surf photography for all sections
 * 
 * Features:
 * - Slot-based deterministic image assignment (no repeats across pages)
 * - Multi-layer caching with unstable_cache (24h TTL)
 * - Blur placeholder generation for instant loading feedback
 */

import { unstable_cache } from 'next/cache';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || process.env.PEXELS_API_URL;
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

// ============================================
// IMAGE CATEGORIES & QUERIES
// ============================================

type ImageCategory = 'hero' | 'quote' | 'science' | 'surfer' | 'portugal' | 'cta' | 'contact';

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

// Quote/atmosphere backgrounds - Soft, calm (NOT ocean-focused, use nature variety)
const QUOTE_QUERIES = [
  'morning mist lake calm',
  'fog forest peaceful',
  'soft clouds sky pastel',
  'zen garden peaceful',
  'mountain mist sunrise',
  'lavender field calm',
  'meadow morning dew',
  'still water reflection trees',
];

// Science/underwater - Colorful marine life (vibrant, not dark)
const SCIENCE_QUERIES = [
  'coral reef fish colorful',
  'jellyfish glowing dark water',
  'sea turtle swimming underwater',
  'dolphins underwater blue',
  'manta ray underwater graceful',
  'kelp forest underwater sunlight',
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

// Portugal/Atlantic specific - Rocky cliffs and dramatic landscapes (emphasize rocks)
const PORTUGAL_QUERIES = [
  'dramatic cliff edge aerial view',
  'rocky coast birds eye view',
  'sea arch rock formation',
  'lighthouse cliff stormy sky',
  'basalt columns coastline',
  'volcanic rocks ocean coast',
];

// Newsletter/CTA backgrounds - Very dark, moody (storm, night, abyss)
const CTA_QUERIES = [
  'storm clouds ocean dark dramatic',
  'lightning ocean night',
  'deep ocean abyss dark',
  'underwater cave dark mysterious',
  'moonlight ocean reflection night',
  'thunderstorm sea dramatic waves',
  'dark water texture abstract',
  'black sand beach moody',
];

// Contact page - Warm, golden sunset tones (very warm, inviting)
const CONTACT_QUERIES = [
  'palm silhouette sunset orange',
  'beach hammock sunset tropical',
  'tropical sunset vibrant colors',
  'pier sunset golden reflection',
  'coconut palms golden hour',
  'beach bonfire night warm',
];

// Category to queries mapping
const CATEGORY_QUERIES: Record<ImageCategory, string[]> = {
  hero: HERO_QUERIES,
  quote: QUOTE_QUERIES,
  science: SCIENCE_QUERIES,
  surfer: SURFER_QUERIES,
  portugal: PORTUGAL_QUERIES,
  cta: CTA_QUERIES,
  contact: CONTACT_QUERIES,
};

// ============================================
// SLOT REGISTRY - Deterministic Image Assignment
// ============================================

/**
 * Each page section gets a unique slot to ensure no image repetition
 * across different pages during user navigation.
 * 
 * Format: 'page:section' -> { category, index }
 * The index determines which query from the category to use.
 */
const IMAGE_SLOTS: Record<string, { category: ImageCategory; index: number }> = {
  // Home page
  'home:hero': { category: 'hero', index: 0 },
  'home:quote': { category: 'quote', index: 0 },
  'home:newsletter': { category: 'cta', index: 0 },
  
  // About page - Each section uses completely different visual style
  'about:hero': { category: 'portugal', index: 0 },      // Dramatic cliffs
  'about:quote': { category: 'science', index: 0 },      // Underwater/marine (distinct from hero)
  'about:surfer': { category: 'surfer', index: 0 },
  'about:newsletter': { category: 'cta', index: 1 },
  
  // Contact page - Warm sunset imagery (distinct from dark CTA footer)
  'contact:hero': { category: 'contact', index: 0 },
  'contact:newsletter': { category: 'cta', index: 2 },
  
  // Issues pages
  'issues:hero': { category: 'hero', index: 1 },
  'issues:newsletter': { category: 'cta', index: 3 },
  
  // Newsletter page - Use sunny beach hero (not underwater, to contrast with dark CTA)
  'newsletter:hero': { category: 'hero', index: 3 },
  'newsletter:newsletter': { category: 'cta', index: 4 },
  
  // Legal pages (share same images)
  'legal:newsletter': { category: 'cta', index: 5 },
};

// Section-specific queries for issue highlights
const SECTION_QUERIES: Record<string, string[]> = {
  'editors-note': ['ocean horizon peaceful', 'calm sea morning'],
  'meet-the-scientist': SCIENCE_QUERIES,
  'students-peak': ['surfer learning', 'beginner surfing'],
  'surf-science-explained': ['ocean waves physics', 'wave formation'],
  'meet-the-surfer': SURFER_QUERIES,
  'tips-tricks': ['surfboard beach', 'surf equipment'],
  'community-projects': ['beach cleanup', 'surf community'],
};

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
  blurDataURL?: string;
}

// ============================================
// FALLBACK IMAGES
// ============================================

const FALLBACK_IMAGES: Record<ImageCategory, ImageResult[]> = {
  hero: [
    {
      src: '/images/hero/ocean-aerial.jpg',
      srcLarge: '/images/hero/ocean-aerial.jpg',
      srcMedium: '/images/hero/ocean-aerial.jpg',
      srcSmall: '/images/hero/ocean-aerial.jpg',
      photographer: 'Blue Mind',
      alt: 'Aerial view of ocean waves',
      avgColor: '#0d4f6c',
      blurDataURL: generateBlurPlaceholder('#0d4f6c'),
    },
    {
      src: '/images/hero/surfer-sunset.jpg',
      srcLarge: '/images/hero/surfer-sunset.jpg',
      srcMedium: '/images/hero/surfer-sunset.jpg',
      srcSmall: '/images/hero/surfer-sunset.jpg',
      photographer: 'Blue Mind',
      alt: 'Surfer silhouette at golden sunset',
      avgColor: '#c9956c',
      blurDataURL: generateBlurPlaceholder('#c9956c'),
    },
    {
      src: '/images/hero/underwater-blue.jpg',
      srcLarge: '/images/hero/underwater-blue.jpg',
      srcMedium: '/images/hero/underwater-blue.jpg',
      srcSmall: '/images/hero/underwater-blue.jpg',
      photographer: 'Blue Mind',
      alt: 'Underwater ocean blue light rays',
      avgColor: '#0a3d5c',
      blurDataURL: generateBlurPlaceholder('#0a3d5c'),
    },
    {
      src: '/images/hero/beach-golden-hour.jpg',
      srcLarge: '/images/hero/beach-golden-hour.jpg',
      srcMedium: '/images/hero/beach-golden-hour.jpg',
      srcSmall: '/images/hero/beach-golden-hour.jpg',
      photographer: 'Blue Mind',
      alt: 'Beach at golden hour with waves',
      avgColor: '#d4a574',
      blurDataURL: generateBlurPlaceholder('#d4a574'),
    },
  ],
  quote: [
    {
      src: '/images/hero/ocean-aerial.jpg',
      srcLarge: '/images/hero/ocean-aerial.jpg',
      srcMedium: '/images/hero/ocean-aerial.jpg',
      srcSmall: '/images/hero/ocean-aerial.jpg',
      photographer: 'Blue Mind',
      alt: 'Ocean mist at dawn',
      avgColor: '#5a7d8c',
      blurDataURL: generateBlurPlaceholder('#5a7d8c'),
    },
  ],
  science: [
    {
      src: '/images/hero/underwater-blue.jpg',
      srcLarge: '/images/hero/underwater-blue.jpg',
      srcMedium: '/images/hero/underwater-blue.jpg',
      srcSmall: '/images/hero/underwater-blue.jpg',
      photographer: 'Blue Mind',
      alt: 'Ocean science imagery',
      avgColor: '#0a3d5c',
      blurDataURL: generateBlurPlaceholder('#0a3d5c'),
    },
  ],
  surfer: [
    {
      src: '/images/hero/surfer-sunset.jpg',
      srcLarge: '/images/hero/surfer-sunset.jpg',
      srcMedium: '/images/hero/surfer-sunset.jpg',
      srcSmall: '/images/hero/surfer-sunset.jpg',
      photographer: 'Blue Mind',
      alt: 'Surfer lifestyle',
      avgColor: '#c9956c',
      blurDataURL: generateBlurPlaceholder('#c9956c'),
    },
  ],
  portugal: [
    {
      src: '/images/hero/ocean-aerial.jpg',
      srcLarge: '/images/hero/ocean-aerial.jpg',
      srcMedium: '/images/hero/ocean-aerial.jpg',
      srcSmall: '/images/hero/ocean-aerial.jpg',
      photographer: 'Blue Mind',
      alt: 'Portuguese coastline',
      avgColor: '#0d4f6c',
      blurDataURL: generateBlurPlaceholder('#0d4f6c'),
    },
  ],
  cta: [
    {
      src: '/images/hero/ocean-aerial.jpg',
      srcLarge: '/images/hero/ocean-aerial.jpg',
      srcMedium: '/images/hero/ocean-aerial.jpg',
      srcSmall: '/images/hero/ocean-aerial.jpg',
      photographer: 'Blue Mind',
      alt: 'Ocean blue gradient',
      avgColor: '#0d4f6c',
      blurDataURL: generateBlurPlaceholder('#0d4f6c'),
    },
    {
      src: '/images/hero/beach-golden-hour.jpg',
      srcLarge: '/images/hero/beach-golden-hour.jpg',
      srcMedium: '/images/hero/beach-golden-hour.jpg',
      srcSmall: '/images/hero/beach-golden-hour.jpg',
      photographer: 'Blue Mind',
      alt: 'Beach aerial view',
      avgColor: '#d4a574',
      blurDataURL: generateBlurPlaceholder('#d4a574'),
    },
  ],
  contact: [
    {
      src: '/images/hero/beach-golden-hour.jpg',
      srcLarge: '/images/hero/beach-golden-hour.jpg',
      srcMedium: '/images/hero/beach-golden-hour.jpg',
      srcSmall: '/images/hero/beach-golden-hour.jpg',
      photographer: 'Blue Mind',
      alt: 'Beach sunset golden hour',
      avgColor: '#d4a574',
      blurDataURL: generateBlurPlaceholder('#d4a574'),
    },
  ],
};

// ============================================
// BLUR PLACEHOLDER GENERATION
// ============================================

/**
 * Generate a blur placeholder SVG data URL from an average color
 * This provides instant visual feedback while images load
 */
export function generateBlurPlaceholder(avgColor: string): string {
  // Ensure color is valid
  const color = avgColor.startsWith('#') ? avgColor : '#5a7d8c';
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 5">
    <filter id="b" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="1"/>
    </filter>
    <rect width="100%" height="100%" fill="${color}" filter="url(#b)"/>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

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
    blurDataURL: generateBlurPlaceholder(photo.avg_color),
  };
}

/**
 * Get fallback image for a category
 */
function getFallbackImage(category: ImageCategory, index: number = 0): ImageResult {
  const fallbacks = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.hero;
  return fallbacks[index % fallbacks.length];
}

/**
 * Fetch images from Pexels API (internal, not cached)
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
    // #region agent log
    console.log('[DEBUG-PEXELS] NO_API_KEY:', JSON.stringify({query}));
    fetch('http://127.0.0.1:7244/ingest/883f54ad-f78b-46b3-b134-6db15539d91d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'pexels.ts:fetchFromPexels',message:'NO_API_KEY',data:{query},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return null;
  }

  const { perPage = 1, page = 1, orientation = 'landscape' } = options;

  // #region agent log
  console.log('[DEBUG-PEXELS] PEXELS_API_REQUEST:', JSON.stringify({query,perPage,page,orientation,fullUrl:`${PEXELS_BASE_URL}/search?query=${query}&per_page=${perPage}&page=${page}`}));
  fetch('http://127.0.0.1:7244/ingest/883f54ad-f78b-46b3-b134-6db15539d91d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'pexels.ts:fetchFromPexels:request',message:'PEXELS_API_REQUEST',data:{query,perPage,page,orientation,fullUrl:`${PEXELS_BASE_URL}/search?query=${query}&per_page=${perPage}&page=${page}`},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C,D'})}).catch(()=>{});
  // #endregion

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
      // Fetch-level cache as backup (24 hours)
      next: {
        revalidate: 86400,
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
// CACHED API FUNCTIONS
// ============================================

/**
 * Internal function to fetch a POOL of images for a slot's category
 * Fetches 15 images to provide variety, cached for 24h
 */
async function fetchImagePoolForCategory(category: ImageCategory, queryIndex: number): Promise<ImageResult[]> {
  const queries = CATEGORY_QUERIES[category];
  const query = queries[queryIndex % queries.length];
  
  // Fetch 15 images to build a pool for random selection
  const response = await fetchFromPexels(query, { perPage: 15, page: 1 });

  // #region agent log
  console.log('[DEBUG-PEXELS] POOL_FETCH:', JSON.stringify({category,queryIndex,query,photoCount:response?.photos?.length||0}));
  fetch('http://127.0.0.1:7244/ingest/883f54ad-f78b-46b3-b134-6db15539d91d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'pexels.ts:fetchImagePoolForCategory',message:'POOL_FETCH',data:{category,queryIndex,query,photoCount:response?.photos?.length||0},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'FIX'})}).catch(()=>{});
  // #endregion

  if (response?.photos && response.photos.length > 0) {
    return response.photos.map(photo => transformPhoto(photo, query));
  }

  // Return multiple fallbacks if API fails
  return [getFallbackImage(category, 0)];
}

/**
 * Get cached image pool for a category
 * Pool is cached for 24h, but random selection happens on each render
 */
async function getCachedImagePool(category: ImageCategory, queryIndex: number): Promise<ImageResult[]> {
  const cachedFetch = unstable_cache(
    async () => fetchImagePoolForCategory(category, queryIndex),
    [`pexels-pool-${category}-${queryIndex}`],
    { 
      revalidate: 86400, // 24 hours - pool is cached
      tags: ['pexels', `pexels-pool-${category}`]
    }
  );
  
  return cachedFetch();
}

/**
 * Internal function to fetch image for a slot
 * Now selects RANDOMLY from a cached pool for variety on each visit
 */
async function fetchImageForSlotInternal(slot: string): Promise<ImageResult | null> {
  const config = IMAGE_SLOTS[slot];
  if (!config) {
    console.warn(`Unknown image slot: ${slot}`);
    return null;
  }

  // Get the cached pool of images for this category
  const pool = await getCachedImagePool(config.category, config.index);
  
  // RANDOM SELECTION: Pick a random image from the pool each time
  const randomIndex = Math.floor(Math.random() * pool.length);
  const selectedImage = pool[randomIndex];

  // #region agent log
  console.log('[DEBUG-PEXELS] RANDOM_SELECT:', JSON.stringify({slot,category:config.category,poolSize:pool.length,randomIndex,selectedPhotoPreview:selectedImage?.src?.substring(0,60)||null}));
  fetch('http://127.0.0.1:7244/ingest/883f54ad-f78b-46b3-b134-6db15539d91d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'pexels.ts:fetchImageForSlotInternal',message:'RANDOM_SELECT',data:{slot,category:config.category,poolSize:pool.length,randomIndex},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'FIX'})}).catch(()=>{});
  // #endregion

  return selectedImage || getFallbackImage(config.category, config.index);
}

/**
 * Get image for a specific slot with FRESH random selection
 * 
 * Slots are formatted as 'page:section', e.g.:
 * - 'home:hero'
 * - 'about:quote'
 * - 'contact:newsletter'
 * 
 * The image POOL is cached (24h), but selection is random on each render
 * for a fresh feel on every visit.
 */
export async function getImageForSlot(slot: string): Promise<ImageResult | null> {
  // #region agent log
  console.log('[DEBUG-PEXELS] SLOT_REQUEST_START:', JSON.stringify({slot,note:'NO_CACHE_ON_SELECTION'}));
  fetch('http://127.0.0.1:7244/ingest/883f54ad-f78b-46b3-b134-6db15539d91d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'pexels.ts:getImageForSlot',message:'SLOT_REQUEST_START',data:{slot,note:'NO_CACHE_ON_SELECTION'},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'FIX'})}).catch(()=>{});
  // #endregion

  // NO unstable_cache here - we want fresh random selection each time
  // The pool fetch inside is cached, but the random pick is not
  const result = await fetchImageForSlotInternal(slot);
  
  // #region agent log
  console.log('[DEBUG-PEXELS] SLOT_REQUEST_RESULT:', JSON.stringify({slot,hasSrc:!!result?.src,photographer:result?.photographer||null,avgColor:result?.avgColor||null,srcPreview:result?.src?.substring(0,80)||null}));
  fetch('http://127.0.0.1:7244/ingest/883f54ad-f78b-46b3-b134-6db15539d91d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'pexels.ts:getImageForSlot:result',message:'SLOT_REQUEST_RESULT',data:{slot,hasSrc:!!result?.src,photographer:result?.photographer||null,avgColor:result?.avgColor||null,srcPreview:result?.src?.substring(0,80)||null},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'FIX'})}).catch(()=>{});
  // #endregion
  
  return result;
}

/**
 * Internal function to fetch a POOL of images for a section
 * Fetches 15 images to provide variety, cached for 24h
 */
async function fetchSectionImagePool(section: string, queryIndex: number): Promise<ImageResult[]> {
  const queries = SECTION_QUERIES[section] || HERO_QUERIES;
  const query = queries[queryIndex % queries.length];
  
  // Fetch 15 images to build a pool for random selection
  const response = await fetchFromPexels(query, { perPage: 15, page: 1 });

  if (response?.photos && response.photos.length > 0) {
    return response.photos.map(photo => transformPhoto(photo, query));
  }

  return [getFallbackImage('hero', 0)];
}

/**
 * Get cached image pool for a section
 */
async function getCachedSectionPool(section: string, queryIndex: number): Promise<ImageResult[]> {
  const cachedFetch = unstable_cache(
    async () => fetchSectionImagePool(section, queryIndex),
    [`pexels-section-pool-${section}-${queryIndex}`],
    { 
      revalidate: 86400, // 24 hours - pool is cached
      tags: ['pexels', `pexels-section-pool-${section}`]
    }
  );
  
  return cachedFetch();
}

/**
 * Get image for issue section highlights with FRESH random selection
 * Pool is cached (24h), but random selection happens each render.
 */
export async function getSectionImage(section: string, index: number): Promise<ImageResult | null> {
  // Get the cached pool
  const pool = await getCachedSectionPool(section, index);
  
  // RANDOM SELECTION from the pool
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || getFallbackImage('hero', index);
}

/**
 * Get images for multiple issue highlights
 */
export async function getSectionImages(sections: string[]): Promise<Map<string, ImageResult>> {
  const imageMap = new Map<string, ImageResult>();

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const image = await getSectionImage(section, i);
    if (image) {
      imageMap.set(section, image);
    }
  }

  return imageMap;
}

// ============================================
// LEGACY API FUNCTIONS (Deprecated - use getImageForSlot instead)
// ============================================

/**
 * @deprecated Use getImageForSlot('home:hero') instead
 */
export async function getHeroImage(): Promise<ImageResult | null> {
  return getImageForSlot('home:hero');
}

/**
 * @deprecated Use getImageForSlot('home:quote') instead
 */
export async function getQuoteImage(): Promise<ImageResult | null> {
  return getImageForSlot('home:quote');
}

/**
 * @deprecated Use getImageForSlot with appropriate slot instead
 */
export async function getScienceImage(): Promise<ImageResult | null> {
  return getImageForSlot('about:hero');
}

/**
 * @deprecated Use getImageForSlot('about:surfer') instead
 */
export async function getSurferImage(): Promise<ImageResult | null> {
  return getImageForSlot('about:surfer');
}

/**
 * @deprecated Use getImageForSlot('about:hero') instead
 */
export async function getPortugalImage(): Promise<ImageResult | null> {
  return getImageForSlot('about:hero');
}

/**
 * @deprecated Use getImageForSlot with appropriate slot instead
 */
export async function getCtaImage(): Promise<ImageResult | null> {
  return getImageForSlot('home:newsletter');
}

/**
 * Get multiple hero images for sliders/galleries
 */
export async function getHeroImages(count: number = 3): Promise<ImageResult[]> {
  const images: ImageResult[] = [];

  for (let i = 0; i < count && i < HERO_QUERIES.length; i++) {
    const response = await fetchFromPexels(HERO_QUERIES[i], { perPage: 1 });

    if (response && response.photos.length > 0) {
      images.push(transformPhoto(response.photos[0], HERO_QUERIES[i]));
    } else {
      images.push(getFallbackImage('hero', i));
    }
  }

  return images;
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
  category: ImageCategory,
  count: number = 3
): Promise<ImageResult[]> {
  const queries = CATEGORY_QUERIES[category] || HERO_QUERIES;
  const images: ImageResult[] = [];

  for (let i = 0; i < count && i < queries.length; i++) {
    const response = await fetchFromPexels(queries[i], { perPage: 1 });

    if (response && response.photos.length > 0) {
      images.push(transformPhoto(response.photos[0], queries[i]));
    } else {
      images.push(getFallbackImage(category, i));
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
