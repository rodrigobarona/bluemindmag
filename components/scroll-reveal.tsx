'use client';

/**
 * Unified ScrollReveal Components
 * 
 * This file re-exports animation components from the central location
 * to maintain backwards compatibility with existing imports.
 * 
 * All animation components now:
 * - Respect prefers-reduced-motion for accessibility
 * - Use standardized animation values from ANIMATION_CONFIG
 * - Handle hydration safely with useMounted hook
 */

// Re-export all animation components from the central location
export {
  ScrollReveal,
  ScrollFade,
  ScrollScale,
  StaggerContainer,
  StaggerItem,
  Parallax,
  Floating,
  ScaleReveal,
  LineDraw,
  TextReveal,
} from './animations/scroll-reveal';

// Also export the animation config and hook for direct use
export { useReducedMotion, ANIMATION_CONFIG } from '@/lib/use-reduced-motion';
