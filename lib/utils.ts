import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL for the current environment.
 * 
 * Priority:
 * 1. NEXT_PUBLIC_BASE_URL - Custom domain (production)
 * 2. VERCEL_URL - Vercel deployment URL (preview/production)
 * 3. localhost:3000 - Local development
 * 
 * This ensures:
 * - Production uses the custom domain
 * - Preview deployments use their unique Vercel URLs
 * - Local development works correctly
 */
export function getBaseUrl(): string {
  // Custom domain takes priority (set in production)
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // Vercel deployment URL (includes preview deployments)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Local development fallback
  return 'http://localhost:3000';
}

/**
 * Get the canonical production URL.
 * Always returns the production domain for SEO purposes (schema.org, canonical URLs).
 */
export function getCanonicalUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://bluemindmag.com';
}

/**
 * Get the contact email address from environment variables.
 * Falls back to empty string if not configured (should be set in production).
 */
export function getContactEmail(): string {
  return process.env.RESEND_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';
}
