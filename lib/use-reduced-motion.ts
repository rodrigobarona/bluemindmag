'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if the user has requested reduced motion in their OS settings
 * 
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * if (prefersReducedMotion) {
 *   // Skip or simplify animations
 * }
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation variants that respect reduced motion preference
 * Returns empty/instant animations when reduced motion is preferred
 */
export function getMotionVariants(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      transition: { duration: 0.01 },
    };
  }
  return null; // Use default animations
}

/**
 * Standard animation configuration
 * Centralizes all animation values for consistency
 */
export const ANIMATION_CONFIG = {
  // Durations (in seconds)
  duration: {
    fast: 0.2,
    base: 0.4,
    slow: 0.6,
    slower: 0.8,
  },
  // Easing curves
  ease: {
    smooth: [0.25, 0.4, 0.25, 1],
    out: [0.16, 1, 0.3, 1],
    inOut: [0.65, 0, 0.35, 1],
  },
  // Distance values (in pixels)
  distance: {
    small: 20,
    base: 40,
    large: 60,
  },
  // Hover lift values (negative Y)
  lift: {
    small: -4,
    base: -6,
    large: -8,
  },
  // Image scale on hover
  scale: {
    subtle: 1.02,
    base: 1.05,
    large: 1.1,
  },
  // Stagger delays
  stagger: {
    fast: 0.05,
    base: 0.1,
    slow: 0.15,
  },
} as const;
