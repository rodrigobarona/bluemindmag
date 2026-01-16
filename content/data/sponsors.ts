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

