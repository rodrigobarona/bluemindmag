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

// ============================================
// MDX FRONTMATTER TYPES
// ============================================

interface MDXHighlight {
  id: string;
  page: number;
  image: string;
  title: string;
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
