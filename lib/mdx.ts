import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { 
  Issue, 
  IssueHighlight, 
  IssueTranslation, 
  IssueHighlightTranslation,
  Locale,
  Sponsor 
} from '@/content/types/content';

// ============================================
// MDX CONTENT UTILITIES
// Single source of truth for issue content
// ============================================

const ISSUES_DIR = path.join(process.cwd(), 'content/issues');
const SPONSORS_FILE = path.join(process.cwd(), 'content/sponsors/sponsors.mdx');
const PAGES_DIR = path.join(process.cwd(), 'content/pages');

// ============================================
// MDX FRONTMATTER TYPES
// ============================================

interface MDXHighlight {
  id: string;
  page: number;
  image: string;
  title: string;
  headline?: string;
  author: string;
  excerpt: string;
}

interface MDXIssueFrontmatter {
  // Shared metadata
  id: string;
  slug: string;
  issueNumber: number;
  date: string;
  accentColor: string;
  cover: string;
  isCurrent?: boolean;
  // Locale-specific
  title: string;
  subtitle: string;
  description: string;
  flipbookUrl: string;
  sections: string[];
  highlights: MDXHighlight[];
}

// ============================================
// PARSED ISSUE DATA (combines data + translations)
// ============================================

export interface ParsedIssue {
  // Issue data (for Issue type)
  issue: Issue;
  // Translation data (for IssueTranslation type)
  translation: IssueTranslation;
  // Raw MDX content
  content: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get MDX files for a locale
 */
function getMDXFiles(locale: string): string[] {
  const localeDir = path.join(ISSUES_DIR, locale);
  
  if (!fs.existsSync(localeDir)) {
    return [];
  }
  
  return fs.readdirSync(localeDir)
    .filter(file => file.endsWith('.mdx'));
}

/**
 * Parse MDX frontmatter and content
 */
function parseMDXFile(filePath: string): { frontmatter: MDXIssueFrontmatter; content: string } | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    frontmatter: data as MDXIssueFrontmatter,
    content,
  };
}

/**
 * Convert MDX frontmatter to Issue data type
 * @param frontmatter - The current locale's frontmatter
 * @param enFrontmatter - English frontmatter (for getting EN flipbook URL)
 * @param ptFrontmatter - Portuguese frontmatter (for getting PT flipbook URL)
 */
function toIssueData(
  frontmatter: MDXIssueFrontmatter, 
  enFrontmatter?: MDXIssueFrontmatter,
  ptFrontmatter?: MDXIssueFrontmatter
): Issue {
  // For flipbook, we need both locale URLs from their respective MDX files
  const flipbook = {
    en: enFrontmatter?.flipbookUrl || frontmatter.flipbookUrl,
    pt: ptFrontmatter?.flipbookUrl || frontmatter.flipbookUrl,
  };
  
  // Extract highlight data (without translations)
  const highlights: IssueHighlight[] = frontmatter.highlights.map(h => ({
    id: h.id,
    page: h.page,
    image: h.image,
  }));
  
  // For sections, use English as default (shared across locales for Issue type)
  const sections = enFrontmatter?.sections || frontmatter.sections;
  
  return {
    id: frontmatter.id,
    slug: frontmatter.slug,
    issueNumber: frontmatter.issueNumber,
    date: frontmatter.date,
    accentColor: frontmatter.accentColor,
    cover: frontmatter.cover,
    flipbook,
    highlights,
    sections,
    isCurrent: frontmatter.isCurrent,
  };
}

/**
 * Convert MDX frontmatter to IssueTranslation type
 */
function toIssueTranslation(frontmatter: MDXIssueFrontmatter): IssueTranslation {
  // Convert highlights to translation format
  const highlights: Record<string, IssueHighlightTranslation> = {};
  
  for (const h of frontmatter.highlights) {
    highlights[h.id] = {
      title: h.title,
      headline: h.headline,
      author: h.author,
      excerpt: h.excerpt,
    };
  }
  
  return {
    title: frontmatter.title,
    subtitle: frontmatter.subtitle,
    description: frontmatter.description,
    sections: frontmatter.sections,
    highlights,
  };
}

// ============================================
// PUBLIC API - READ FROM MDX
// ============================================

/**
 * Get all issue slugs (from English files as source of truth)
 */
export function getIssueSlugs(): string[] {
  const files = getMDXFiles('en');
  return files.map(file => file.replace('.mdx', ''));
}

/**
 * Helper to find PT MDX file by slug (since PT filename may differ)
 */
function findPTFileBySlug(slug: string): string | null {
  const ptFiles = getMDXFiles('pt');
  for (const file of ptFiles) {
    const ptPath = path.join(ISSUES_DIR, 'pt', file);
    const parsed = parseMDXFile(ptPath);
    if (parsed && parsed.frontmatter.slug === slug) {
      return ptPath;
    }
  }
  return null;
}

/**
 * Get parsed issue by slug for a specific locale
 */
export function getIssueBySlugMDX(slug: string, locale: Locale = 'en'): ParsedIssue | null {
  // Try locale-specific file first
  let filePath = path.join(ISSUES_DIR, locale, `${slug}.mdx`);
  
  // For Portuguese, the filename might be different (e.g., issue-0-janeiro-2026.mdx)
  if (!fs.existsSync(filePath) && locale === 'pt') {
    const ptPath = findPTFileBySlug(slug);
    if (ptPath) {
      filePath = ptPath;
    }
  }
  
  const parsed = parseMDXFile(filePath);
  if (!parsed) {
    return null;
  }
  
  // Always get both EN and PT frontmatter to build correct flipbook URLs
  let enFrontmatter: MDXIssueFrontmatter | undefined;
  let ptFrontmatter: MDXIssueFrontmatter | undefined;
  
  // Get English frontmatter
  const enPath = path.join(ISSUES_DIR, 'en', `${slug}.mdx`);
  if (fs.existsSync(enPath)) {
    const enParsed = parseMDXFile(enPath);
    enFrontmatter = enParsed?.frontmatter;
  }
  
  // Get Portuguese frontmatter
  const ptPath = findPTFileBySlug(slug);
  if (ptPath) {
    const ptParsed = parseMDXFile(ptPath);
    ptFrontmatter = ptParsed?.frontmatter;
  }
  
  return {
    issue: toIssueData(parsed.frontmatter, enFrontmatter, ptFrontmatter),
    translation: toIssueTranslation(parsed.frontmatter),
    content: parsed.content,
  };
}

/**
 * Get all issues for a locale, sorted by date (newest first)
 */
export function getAllIssuesMDX(locale: Locale = 'en'): ParsedIssue[] {
  const slugs = getIssueSlugs();
  
  const issues = slugs
    .map(slug => getIssueBySlugMDX(slug, locale))
    .filter((issue): issue is ParsedIssue => issue !== null)
    .sort((a, b) => {
      const dateA = new Date(a.issue.date).getTime();
      const dateB = new Date(b.issue.date).getTime();
      return dateB - dateA;
    });
  
  return issues;
}

/**
 * Get the current/latest issue for a locale
 */
export function getCurrentIssueMDX(locale: Locale = 'en'): ParsedIssue | null {
  const issues = getAllIssuesMDX(locale);
  return issues.find(i => i.issue.isCurrent) || issues[0] || null;
}

// ============================================
// COMPATIBILITY LAYER
// These functions return data in the OLD format for backward compatibility
// ============================================

/**
 * Get issue by slug (returns Issue type only, for backward compatibility)
 */
export function getIssueBySlug(slug: string): Issue | undefined {
  const parsed = getIssueBySlugMDX(slug, 'en');
  return parsed?.issue;
}

/**
 * Get all issues (returns Issue[] only, for backward compatibility)
 */
export function getAllIssues(): Issue[] {
  return getAllIssuesMDX('en').map(p => p.issue);
}

/**
 * Get current issue (returns Issue only, for backward compatibility)
 */
export function getCurrentIssue(): Issue | undefined {
  return getCurrentIssueMDX('en')?.issue;
}

/**
 * Get issue by ID
 */
export function getIssueById(id: string): Issue | undefined {
  const issues = getAllIssues();
  return issues.find(issue => issue.id === id);
}

/**
 * Get issue count
 */
export function getIssueCount(): number {
  return getIssueSlugs().length;
}

/**
 * Get issue translations for a locale
 * Returns Record<issueId, IssueTranslation> for backward compatibility
 */
export function getIssueTranslations(locale: Locale = 'en'): Record<string, IssueTranslation> {
  const issues = getAllIssuesMDX(locale);
  const translations: Record<string, IssueTranslation> = {};
  
  for (const parsed of issues) {
    translations[parsed.issue.id] = parsed.translation;
  }
  
  return translations;
}

// ============================================
// SPONSORS MDX UTILITIES
// Single source of truth for sponsor content
// ============================================

interface MDXSponsorFrontmatter {
  sponsors: Sponsor[];
}

// Cache for sponsors data
let sponsorsCache: Sponsor[] | null = null;

/**
 * Parse sponsors MDX file
 */
function parseSponsorsFile(): Sponsor[] {
  // Return cached data if available
  if (sponsorsCache !== null) {
    return sponsorsCache;
  }
  
  if (!fs.existsSync(SPONSORS_FILE)) {
    console.warn('Sponsors MDX file not found:', SPONSORS_FILE);
    return [];
  }
  
  const fileContents = fs.readFileSync(SPONSORS_FILE, 'utf8');
  const { data } = matter(fileContents);
  const frontmatter = data as MDXSponsorFrontmatter;
  
  // Cache the result
  sponsorsCache = frontmatter.sponsors || [];
  
  return sponsorsCache;
}

/**
 * Get all sponsors from MDX
 */
export function getAllSponsorsMDX(): Sponsor[] {
  return parseSponsorsFile();
}

/**
 * Get sponsor by ID from MDX
 */
export function getSponsorByIdMDX(id: string): Sponsor | undefined {
  const sponsors = parseSponsorsFile();
  return sponsors.find(sponsor => sponsor.id === id);
}

/**
 * Get sponsors by IDs from MDX
 */
export function getSponsorsByIdsMDX(ids: string[]): Sponsor[] {
  const sponsors = parseSponsorsFile();
  return ids
    .map(id => sponsors.find(sponsor => sponsor.id === id))
    .filter((sponsor): sponsor is Sponsor => sponsor !== undefined);
}

/**
 * Get sponsors by tier from MDX
 */
export function getSponsorsByTierMDX(tier: Sponsor['tier']): Sponsor[] {
  const sponsors = parseSponsorsFile();
  return sponsors.filter(sponsor => sponsor.tier === tier);
}

// ============================================
// PAGE CONTENT MDX UTILITIES
// Single source of truth for page content
// ============================================

// Cache for page content
const pageContentCache: Record<string, Record<string, unknown>> = {};

/**
 * Generic function to parse any page MDX file
 */
function parsePageFile(
  pageName: string,
  locale: Locale
): { frontmatter: Record<string, unknown>; content: string } | null {
  const cacheKey = `${locale}:${pageName}`;
  
  const filePath = path.join(PAGES_DIR, locale, `${pageName}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`Page MDX file not found: ${filePath}`);
    return null;
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Cache the frontmatter
  pageContentCache[cacheKey] = data;
  
  return {
    frontmatter: data,
    content,
  };
}

// ============================================
// ABOUT PAGE CONTENT
// ============================================

export interface AboutPageContent {
  title: string;
  subtitle: string;
  description: string;
  theMagazine: string;
  missionLabel: string;
  heroDescription: string;
  magazine: {
    title: string;
    description: string;
  };
  mission: {
    title: string;
    description: string;
  };
  editor: {
    title: string;
    name: string;
    credentials: string;
    bio: string;
  };
  publisher: {
    title: string;
    name: string;
    description: string;
  };
  supporters: {
    title: string;
    smi: {
      name: string;
      description: string;
      description2?: string;
      url: string;
      cta: string;
    };
  };
  collaboration: {
    title: string;
    headline: string;
    description: string;
    description2?: string;
    cta: string;
  };
  vision: {
    description: string;
  };
}

/**
 * Get About page content for a locale
 */
export function getAboutPageContent(locale: Locale = 'en'): AboutPageContent | null {
  const parsed = parsePageFile('about', locale);
  if (!parsed) return null;
  return parsed.frontmatter as unknown as AboutPageContent;
}

// ============================================
// CONTACT PAGE CONTENT
// ============================================

export interface ContactPageContent {
  title: string;
  subtitle: string;
  description: string;
  hero: {
    label: string;
    greeting: string;
    tagline: string;
  };
  ways: {
    email: {
      label: string;
      description: string;
    };
    response: {
      label: string;
      description: string;
    };
  };
  chat: {
    label: string;
    book: string;
    duration: string;
  };
  social: {
    follow: string;
    description: string;
  };
  contribute: {
    title: string;
    description: string;
    guidelines: string;
    cta: string;
    emailSubject: string;
  };
  info: {
    email: string;
    response: string;
  };
  links: {
    calcom: string;
  };
}

/**
 * Get Contact page content for a locale
 */
export function getContactPageContent(locale: Locale = 'en'): ContactPageContent | null {
  const parsed = parsePageFile('contact', locale);
  if (!parsed) return null;
  return parsed.frontmatter as unknown as ContactPageContent;
}

// ============================================
// NEWSLETTER PAGE CONTENT
// ============================================

export interface NewsletterPageContent {
  title: string;
  subtitle: string;
  description: string;
  freeNewsletter: string;
  formTitle: string;
  cta: string;
  whatYouGet: string;
  benefits: {
    newIssues: {
      title: string;
      description: string;
    };
    exclusive: {
      title: string;
      description: string;
    };
    community: {
      title: string;
      description: string;
    };
    earlyAccess: {
      title: string;
      description: string;
    };
  };
  features: {
    title: string;
    items: string[];
  };
  founder: {
    role: string;
  };
  notSure: {
    title: string;
    description: string;
    cta: string;
  };
  readFirst: {
    title: string;
    description: string;
    cta: string;
  };
  privacyNote: string;
}

/**
 * Get Newsletter page content for a locale
 */
export function getNewsletterPageContent(locale: Locale = 'en'): NewsletterPageContent | null {
  const parsed = parsePageFile('newsletter', locale);
  if (!parsed) return null;
  return parsed.frontmatter as unknown as NewsletterPageContent;
}

// ============================================
// LEGAL PAGE CONTENT (Privacy, Terms, Cookies)
// ============================================

export interface LegalPageContent {
  title: string;
  lastUpdated: string;
  description: string;
  cookieTypes?: Array<{
    name: string;
    description: string;
  }>;
}

export interface ParsedLegalPage {
  frontmatter: LegalPageContent;
  content: string;
}

/**
 * Get Legal page content for a locale (privacy, terms, or cookies)
 */
export function getLegalPageContent(
  page: 'privacy' | 'terms' | 'cookies',
  locale: Locale = 'en'
): ParsedLegalPage | null {
  const parsed = parsePageFile(page, locale);
  if (!parsed) return null;
  
  return {
    frontmatter: parsed.frontmatter as unknown as LegalPageContent,
    content: parsed.content,
  };
}

// ============================================
// HOME PAGE CONTENT
// ============================================

export interface HomePageContent {
  hero: {
    title: string;
    subtitle: string;
    tagline: string;
    description: string;
    cta: string;
    secondary: string;
  };
  currentIssue: {
    label: string;
    readNow: string;
    preview: string;
  };
  archive: {
    label: string;
    title: string;
    viewAll: string;
  };
  newsletter: {
    title: string;
    description: string;
    cta: string;
  };
  about: {
    label: string;
    title: string;
    description: string;
  };
  quote: {
    text: string;
    attribution: string;
  };
}

/**
 * Get Home page content for a locale
 */
export function getHomePageContent(locale: Locale = 'en'): HomePageContent | null {
  const parsed = parsePageFile('home', locale);
  if (!parsed) return null;
  return parsed.frontmatter as unknown as HomePageContent;
}

