// ============================================
// BLUE MIND MAGAZINE - SPONSORS DATA
// Re-exports from MDX (single source of truth)
// ============================================

import {
  getAllSponsorsMDX,
  getSponsorByIdMDX,
  getSponsorsByIdsMDX,
  getSponsorsByTierMDX,
} from '@/lib/mdx';
import type { Sponsor } from '../types/content';

// Re-export functions with simpler names for backward compatibility
export function getAllSponsors(): Sponsor[] {
  return getAllSponsorsMDX();
}

export function getSponsorById(id: string): Sponsor | undefined {
  return getSponsorByIdMDX(id);
}

export function getSponsorsByIds(ids: string[]): Sponsor[] {
  return getSponsorsByIdsMDX(ids);
}

export function getSponsorsByTier(tier: Sponsor['tier']): Sponsor[] {
  return getSponsorsByTierMDX(tier);
}

// Re-export type for convenience
export type { Sponsor } from '../types/content';
