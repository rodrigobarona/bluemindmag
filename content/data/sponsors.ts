import type { Sponsor } from '../types/content';

// ============================================
// BLUE MIND MAGAZINE - SPONSORS DATA
// ============================================

export const sponsors: Sponsor[] = [
  {
    id: 'surfing-medicine-international',
    name: 'Surfing Medicine International',
    logo: '/images/sponsors/smi-logo.png',
    url: 'https://surfingmedicine.org',
    tier: 'main',
  },
  {
    id: 'ocean-wellness',
    name: 'Ocean Wellness Co.',
    logo: '/images/sponsors/placeholder-1.svg',
    url: 'https://example.com/ocean-wellness',
    tier: 'supporting',
  },
  {
    id: 'blue-wave-foundation',
    name: 'Blue Wave Foundation',
    logo: '/images/sponsors/placeholder-2.svg',
    url: 'https://example.com/blue-wave',
    tier: 'supporting',
  },
  {
    id: 'surf-science-labs',
    name: 'Surf Science Labs',
    logo: '/images/sponsors/placeholder-3.svg',
    url: 'https://example.com/surf-science',
    tier: 'supporting',
  },
  {
    id: 'coastal-research',
    name: 'Coastal Research Institute',
    logo: '/images/sponsors/placeholder-4.svg',
    url: 'https://example.com/coastal-research',
    tier: 'supporting',
  },
  {
    id: 'wave-therapy',
    name: 'Wave Therapy Center',
    logo: '/images/sponsors/placeholder-5.svg',
    url: 'https://example.com/wave-therapy',
    tier: 'supporting',
  },
  {
    id: 'marine-health',
    name: 'Marine Health Alliance',
    logo: '/images/sponsors/placeholder-6.svg',
    url: 'https://example.com/marine-health',
    tier: 'supporting',
  },
  {
    id: 'surf-academy',
    name: 'International Surf Academy',
    logo: '/images/sponsors/placeholder-7.svg',
    url: 'https://example.com/surf-academy',
    tier: 'supporting',
  },
  {
    id: 'ocean-mind',
    name: 'Ocean Mind Project',
    logo: '/images/sponsors/placeholder-8.svg',
    url: 'https://example.com/ocean-mind',
    tier: 'supporting',
  },
  {
    id: 'blue-therapy',
    name: 'Blue Therapy Initiative',
    logo: '/images/sponsors/placeholder-9.svg',
    url: 'https://example.com/blue-therapy',
    tier: 'supporting',
  },
  {
    id: 'wave-riders',
    name: 'Wave Riders Association',
    logo: '/images/sponsors/placeholder-10.svg',
    url: 'https://example.com/wave-riders',
    tier: 'supporting',
  },
  {
    id: 'surf-wellness',
    name: 'Surf Wellness Network',
    logo: '/images/sponsors/placeholder-11.svg',
    url: 'https://example.com/surf-wellness',
    tier: 'supporting',
  },
];

// Helper functions
export function getSponsorById(id: string): Sponsor | undefined {
  return sponsors.find((sponsor) => sponsor.id === id);
}

export function getSponsorsByIds(ids: string[]): Sponsor[] {
  return ids
    .map((id) => getSponsorById(id))
    .filter((sponsor): sponsor is Sponsor => sponsor !== undefined);
}

export function getSponsorsByTier(tier: Sponsor['tier']): Sponsor[] {
  return sponsors.filter((sponsor) => sponsor.tier === tier);
}

export function getAllSponsors(): Sponsor[] {
  return [...sponsors];
}
