import type { NavLink, SocialLink, SiteConfig } from '../types/content';

// ============================================
// BLUE MIND MAGAZINE - SITE CONFIG
// ============================================

export const siteConfig: SiteConfig = {
  name: 'Blue Mind Magazine',
  tagline: 'From surfers, to surfers',
  url: 'https://bluemindmag.com',
  email: 'info@bluemindmag.com',
  defaultLocale: 'en',
  locales: ['en', 'pt'] as const,
};

// ============================================
// NAVIGATION LINKS
// ============================================

export const mainNavLinks: NavLink[] = [
  { key: 'home', href: '/' },
  { key: 'issues', href: '/issues' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];

export const footerNavLinks: NavLink[] = [
  { key: 'newsletter', href: '/newsletter' },
  { key: 'privacy', href: '/privacy' },
  { key: 'cookies', href: '/cookies' },
  { key: 'terms', href: '/terms' },
];

// ============================================
// SOCIAL LINKS
// ============================================

export const socialLinks: SocialLink[] = [
  {
    platform: 'instagram',
    url: 'https://www.instagram.com/bluemindmag/',
    label: 'Instagram',
  },
  {
    platform: 'linkedin',
    url: 'https://www.linkedin.com/company/bluemindmag/',
    label: 'LinkedIn',
  },
];

// ============================================
// EXTERNAL LINKS
// ============================================

export const externalLinks = {
  beehiiv: 'https://bluemindmag.beehiiv.com/subscribe',
  publuu: 'https://publuu.com',
  surfisio: 'https://surfisio.pt',
  smi: 'https://surfingmedicine.org',
};

