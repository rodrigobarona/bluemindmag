// ============================================
// BLUE MIND MAGAZINE - ISSUES DATA
// Re-exports from MDX (single source of truth)
// ============================================

// Re-export everything from MDX utilities
export {
  getIssueBySlug,
  getAllIssues,
  getCurrentIssue,
  getIssueById,
  getIssueCount,
  getIssueTranslations,
  // MDX-specific exports (for advanced usage)
  getIssueBySlugMDX,
  getAllIssuesMDX,
  getCurrentIssueMDX,
  getIssueSlugs,
} from '@/lib/mdx';

// Re-export types
export type { ParsedIssue } from '@/lib/mdx';
