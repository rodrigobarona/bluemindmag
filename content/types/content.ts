// ============================================
// BLUE MIND MAGAZINE - CONTENT TYPES
// ============================================

export type Locale = 'en' | 'pt';

// ============================================
// ISSUE TYPES
// ============================================

export interface IssueHighlight {
  id: string;
  page: number;
  image: string;
}

export interface Issue {
  id: string;
  slug: string;
  issueNumber: number;
  date: string;
  accentColor: string;
  cover: string;
  flipbook: {
    en: string;
    pt: string;
  };
  sponsors: string[];
  highlights: IssueHighlight[];
  sections: string[];
  isCurrent?: boolean;
}

export interface IssueHighlightTranslation {
  title: string;
  author: string;
  excerpt: string;
}

export interface IssueTranslation {
  title: string;
  subtitle: string;
  description: string;
  sections: string[];
  highlights: Record<string, IssueHighlightTranslation>;
}

// ============================================
// SPONSOR/SUPPORTER TYPES
// ============================================

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  url: string;
  tier: 'main' | 'supporting' | 'community';
}

// ============================================
// TEAM TYPES
// ============================================

export interface TeamMember {
  id: string;
  role: 'editor' | 'publisher' | 'contributor';
  image?: string;
  social: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

export interface TeamMemberTranslation {
  name: string;
  title: string;
  bio: string;
}

// ============================================
// NAVIGATION TYPES
// ============================================

export interface NavLink {
  key: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  platform: 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'youtube';
  url: string;
  label: string;
}

// ============================================
// PAGE CONTENT TYPES
// ============================================

export interface AboutSection {
  id: string;
}

export interface AboutSectionTranslation {
  title: string;
  description: string;
}

export interface LegalPage {
  id: string;
  slug: string;
}

export interface LegalPageTranslation {
  title: string;
  lastUpdated: string;
  content: string;
}

// ============================================
// METADATA TYPES
// ============================================

export interface SiteConfig {
  name: string;
  tagline: string;
  url: string;
  email: string;
  defaultLocale: Locale;
  locales: readonly Locale[];
}

