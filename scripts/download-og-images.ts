/**
 * Download images from Pexels for OG image backgrounds
 * Run with: npx tsx scripts/download-og-images.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || process.env.PEXELS_API_URL;
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

if (!PEXELS_API_KEY) {
  console.error('❌ PEXELS_API_KEY or PEXELS_API_URL environment variable is required');
  process.exit(1);
}

// OG Image queries optimized for social sharing
// Need high contrast, vibrant colors, readable with text overlay
const OG_QUERIES = {
  'home': 'aerial beach waves colorful sunset',
  'about': 'surfing golden hour warm colors',
  'contact': 'tropical beach sunset vibrant orange',
  'newsletter': 'turquoise ocean waves aerial bright',
  'issues': 'surfboard beach sand colorful',
  'legal': 'calm ocean blue gradient peaceful',
};

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
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
  alt: string;
}

async function searchPexels(query: string): Promise<PexelsPhoto[]> {
  try {
    const params = new URLSearchParams({
      query,
      per_page: '5',
      page: '1',
      orientation: 'landscape',
    });

    const response = await fetch(`${PEXELS_BASE_URL}/search?${params}`, {
      headers: {
        Authorization: PEXELS_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error(`Error searching Pexels for "${query}":`, error);
    return [];
  }
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Downloaded: ${path.basename(filepath)}`);
  } catch (error) {
    console.error(`❌ Failed to download ${url}:`, error);
  }
}

async function main() {
  console.log('🔍 Searching Pexels for OG images...\n');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectRoot = path.resolve(__dirname, '..');
  const fallbackDir = path.join(projectRoot, 'public', 'images', 'fallback');

  // Create fallback directory if it doesn't exist
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
  }

  for (const [type, query] of Object.entries(OG_QUERIES)) {
    console.log(`\n📸 Searching for: ${type} ("${query}")`);
    
    const photos = await searchPexels(query);
    
    if (photos.length === 0) {
      console.log(`⚠️  No images found for ${type}`);
      continue;
    }

    // Show options
    console.log(`\nFound ${photos.length} images:\n`);
    photos.forEach((photo, index) => {
      console.log(`${index + 1}. ${photo.alt || 'Untitled'}`);
      console.log(`   By: ${photo.photographer}`);
      console.log(`   Color: ${photo.avg_color}`);
      console.log(`   URL: ${photo.url}\n`);
    });

    // Download the best one (first result is usually best)
    const bestPhoto = photos[0];
    const filename = `${type}-og.jpg`;
    const filepath = path.join(fallbackDir, filename);

    console.log(`⬇️  Downloading best image for ${type}...`);
    await downloadImage(bestPhoto.src.large2x, filepath);
    
    // Log metadata
    console.log(`   Photographer: ${bestPhoto.photographer}`);
    console.log(`   Avg Color: ${bestPhoto.avg_color}`);
    console.log(`   Pexels URL: ${bestPhoto.url}`);

    // Wait a bit to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✨ Done! Update the FALLBACK_IMAGES mapping in app/api/og/route.tsx');
  console.log('\nNew files:');
  Object.keys(OG_QUERIES).forEach(type => {
    console.log(`  - /images/fallback/${type}-og.jpg`);
  });
}

main().catch(console.error);
