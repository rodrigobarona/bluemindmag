import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ============================================
// MDX CONTENT UTILITIES
// ============================================

const ISSUES_DIR = path.join(process.cwd(), 'content/issues');

export interface IssueFrontmatter {
  id: string;
  slug: string;
  issueNumber: number;
  title: string;
  subtitle: string;
  date: string;
  accentColor: string;
  cover: string;
  flipbookUrl: string;
  isCurrent: boolean;
  sponsors: string[];
}

export interface IssueContent {
  frontmatter: IssueFrontmatter;
  content: string;
  sections: IssueSection[];
}

export interface IssueSection {
  id: string;
  title: string;
  author?: string;
  content: string;
}

/**
 * Get all issue slugs for a locale
 */
export function getIssueSlugs(locale: string): string[] {
  const localeDir = path.join(ISSUES_DIR, locale);
  
  if (!fs.existsSync(localeDir)) {
    return [];
  }
  
  return fs.readdirSync(localeDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace('.mdx', ''));
}

/**
 * Get issue content by slug and locale
 */
export function getIssueBySlug(slug: string, locale: string): IssueContent | null {
  const filePath = path.join(ISSUES_DIR, locale, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Parse sections from content
  const sections = parseSections(content);
  
  return {
    frontmatter: data as IssueFrontmatter,
    content,
    sections,
  };
}

/**
 * Get all issues for a locale, sorted by date (newest first)
 */
export function getAllIssues(locale: string): IssueContent[] {
  const slugs = getIssueSlugs(locale);
  
  const issues = slugs
    .map(slug => getIssueBySlug(slug, locale))
    .filter((issue): issue is IssueContent => issue !== null)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();
      return dateB - dateA;
    });
  
  return issues;
}

/**
 * Get the current/latest issue for a locale
 */
export function getCurrentIssue(locale: string): IssueContent | null {
  const issues = getAllIssues(locale);
  return issues.find(issue => issue.frontmatter.isCurrent) || issues[0] || null;
}

/**
 * Parse MDX content into sections based on ## headings
 */
function parseSections(content: string): IssueSection[] {
  const sections: IssueSection[] = [];
  
  // Split by ## headings
  const parts = content.split(/^## /gm);
  
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const lines = part.trim().split('\n');
    
    if (lines.length === 0) continue;
    
    const title = lines[0].trim();
    const id = slugify(title);
    
    // Find author line (starts with **By)
    let author: string | undefined;
    let contentLines = lines.slice(1);
    
    const authorLineIndex = contentLines.findIndex(line => 
      line.trim().startsWith('**By ') || line.trim().startsWith('**Por ')
    );
    
    if (authorLineIndex !== -1) {
      const authorLine = contentLines[authorLineIndex];
      author = authorLine.replace(/^\*\*(?:By|Por)\s+/, '').replace(/\*\*$/, '').trim();
      contentLines = [
        ...contentLines.slice(0, authorLineIndex),
        ...contentLines.slice(authorLineIndex + 1)
      ];
    }
    
    const sectionContent = contentLines.join('\n').trim();
    
    // Skip "In This Issue" section (it's a list, not a real section)
    if (title.toLowerCase().includes('in this issue') || 
        title.toLowerCase().includes('nesta edição')) {
      continue;
    }
    
    sections.push({
      id,
      title,
      author,
      content: sectionContent,
    });
  }
  
  return sections;
}

/**
 * Convert string to URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get issue description (first paragraph after frontmatter)
 */
export function getIssueDescription(content: string): string {
  const lines = content.trim().split('\n');
  const descriptionLines: string[] = [];
  
  for (const line of lines) {
    // Stop at first heading or horizontal rule
    if (line.startsWith('#') || line.startsWith('---')) {
      break;
    }
    if (line.trim()) {
      descriptionLines.push(line.trim());
    }
  }
  
  return descriptionLines.join(' ');
}

