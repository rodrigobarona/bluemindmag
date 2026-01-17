/**
 * Image Utilities for Blue Mind Magazine
 * 
 * Provides utilities for image optimization including:
 * - Blur placeholder generation
 * - Color manipulation
 * - Image loading helpers
 */

/**
 * Generate a blur placeholder SVG data URL from an average color
 * This provides instant visual feedback while images load
 * 
 * @param avgColor - Hex color string (e.g., '#0d4f6c')
 * @returns Base64-encoded SVG data URL
 * 
 * @example
 * ```tsx
 * <Image
 *   src={imageSrc}
 *   placeholder="blur"
 *   blurDataURL={generateBlurPlaceholder('#0d4f6c')}
 * />
 * ```
 */
export function generateBlurPlaceholder(avgColor: string): string {
  // Ensure color is valid hex
  const color = isValidHexColor(avgColor) ? avgColor : '#5a7d8c';
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 5">
    <filter id="b" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="1"/>
    </filter>
    <rect width="100%" height="100%" fill="${color}" filter="url(#b)"/>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generate a gradient blur placeholder from two colors
 * Useful for more dynamic placeholders
 * 
 * @param startColor - Starting hex color
 * @param endColor - Ending hex color
 * @param direction - Gradient direction ('horizontal' | 'vertical' | 'diagonal')
 */
export function generateGradientPlaceholder(
  startColor: string,
  endColor: string,
  direction: 'horizontal' | 'vertical' | 'diagonal' = 'diagonal'
): string {
  const start = isValidHexColor(startColor) ? startColor : '#0d4f6c';
  const end = isValidHexColor(endColor) ? endColor : '#5a7d8c';
  
  const gradientCoords = {
    horizontal: { x1: '0%', y1: '50%', x2: '100%', y2: '50%' },
    vertical: { x1: '50%', y1: '0%', x2: '50%', y2: '100%' },
    diagonal: { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
  };
  
  const coords = gradientCoords[direction];
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 5">
    <defs>
      <linearGradient id="g" x1="${coords.x1}" y1="${coords.y1}" x2="${coords.x2}" y2="${coords.y2}">
        <stop offset="0%" stop-color="${start}"/>
        <stop offset="100%" stop-color="${end}"/>
      </linearGradient>
      <filter id="b" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="1"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)" filter="url(#b)"/>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Check if a string is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Darken a hex color by a percentage
 * 
 * @param color - Hex color string
 * @param percent - Percentage to darken (0-100)
 */
export function darkenColor(color: string, percent: number): string {
  if (!isValidHexColor(color)) return color;
  
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

/**
 * Lighten a hex color by a percentage
 * 
 * @param color - Hex color string
 * @param percent - Percentage to lighten (0-100)
 */
export function lightenColor(color: string, percent: number): string {
  if (!isValidHexColor(color)) return color;
  
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  
  const R = Math.min((num >> 16) + amt, 255);
  const G = Math.min((num >> 8 & 0x00FF) + amt, 255);
  const B = Math.min((num & 0x0000FF) + amt, 255);
  
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

/**
 * Get a contrasting text color (black or white) for a given background
 * 
 * @param bgColor - Background hex color
 * @returns '#000000' or '#ffffff'
 */
export function getContrastingTextColor(bgColor: string): string {
  if (!isValidHexColor(bgColor)) return '#ffffff';
  
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Default blur placeholder for ocean/surf theme
 */
export const DEFAULT_BLUR_PLACEHOLDER = generateBlurPlaceholder('#0d4f6c');

/**
 * Pre-generated blur placeholders for common colors
 */
export const BLUR_PLACEHOLDERS = {
  oceanBlue: generateBlurPlaceholder('#0d4f6c'),
  deepBlue: generateBlurPlaceholder('#0a3d5c'),
  sunset: generateBlurPlaceholder('#c9956c'),
  golden: generateBlurPlaceholder('#d4a574'),
  mist: generateBlurPlaceholder('#5a7d8c'),
  dark: generateBlurPlaceholder('#1a1a2e'),
} as const;




