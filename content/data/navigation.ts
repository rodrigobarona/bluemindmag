import type { NavLink, SocialLink, SiteConfig } from "../types/content";

// ============================================
// BLUE MIND MAGAZINE - SITE CONFIG
// ============================================

export const siteConfig: SiteConfig = {
  name: "Blue Mind Magazine",
  tagline: "From surfers, to surfers",
  url: "https://bluemindmag.com",
  email: "info@bluemindmag.com",
  defaultLocale: "en",
  locales: ["en", "pt"] as const,
};

// ============================================
// NAVIGATION LINKS
// ============================================

export const mainNavLinks: NavLink[] = [
  { key: "home", href: "/" },
  { key: "issues", href: "/issues" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

export const footerNavLinks: NavLink[] = [
  { key: "newsletter", href: "/newsletter" },
  { key: "privacy", href: "/privacy" },
  { key: "cookies", href: "/cookies" },
  { key: "terms", href: "/terms" },
];

// ============================================
// SOCIAL LINKS
// Edit directly here
// ============================================

export const socialLinks: SocialLink[] = [
  {
    platform: "instagram",
    url: "https://www.instagram.com/bluemindmag/",
    label: "Instagram",
  },
  {
    platform: "linkedin",
    url: "https://www.linkedin.com/in/pedro-seixas-31934230/",
    label: "LinkedIn",
  },
];

// ============================================
// EXTERNAL LINKS
// Only links used in code (schema.ts, llms.txt)
// Other links are in MDX files for easy editing
// ============================================

export const externalLinks = {
  surfisio: "https://surfisio.pt", // Used in JSON-LD schema
};
