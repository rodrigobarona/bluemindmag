import type { Issue } from '@/content/types/content';

// ============================================
// DYNAMIC ISSUE THEME UTILITIES
// ============================================

/**
 * Generate CSS custom properties for issue accent color
 */
export function getIssueThemeStyles(issue: Issue): React.CSSProperties {
  return {
    '--brand': issue.accentColor,
    '--brand-foreground': getContrastColor(issue.accentColor),
    '--accent': issue.accentColor,
    '--accent-foreground': getContrastColor(issue.accentColor),
    '--ring': issue.accentColor,
  } as React.CSSProperties;
}

/**
 * Get contrasting text color (black or white) for a given background
 */
export function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark colors, black for light colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Generate a lighter variant of the accent color for backgrounds
 */
export function getLighterAccent(hexColor: string, opacity: number = 0.1): string {
  return `${hexColor}${Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')}`;
}

/**
 * Get the default brand color
 */
export const DEFAULT_BRAND_COLOR = '#0097B2';

/**
 * Check if a color is the default brand color
 */
export function isDefaultBrandColor(color: string): boolean {
  return color.toLowerCase() === DEFAULT_BRAND_COLOR.toLowerCase();
}

