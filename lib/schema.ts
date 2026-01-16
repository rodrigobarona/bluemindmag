import type { Issue, IssueTranslation } from '@/content/types/content';
import { siteConfig } from '@/content/data/navigation';

// ============================================
// JSON-LD SCHEMA.ORG STRUCTURED DATA GENERATORS
// ============================================

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    email: siteConfig.email,
    sameAs: [
      'https://www.instagram.com/bluemindmag/',
      'https://www.linkedin.com/company/bluemindmag/',
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Surfisio',
      url: 'https://surfisio.pt',
    },
  };
}

/**
 * Generate WebSite schema for homepage
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: 'Surf Science: Where surf and science meet.',
    inLanguage: ['en', 'pt'],
    publisher: generateOrganizationSchema(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/issues?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Periodical schema for the magazine
 */
export function generatePeriodicalSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Periodical',
    name: siteConfig.name,
    url: siteConfig.url,
    description: 'Surf Science: Where surf and science meet. From surfers, to surfers.',
    publisher: {
      '@type': 'Organization',
      name: 'Surfisio',
      url: 'https://surfisio.pt',
    },
    about: ['Surfing', 'Sports Science', 'Ocean Health', 'Surf Medicine'],
  };
}

/**
 * Generate PublicationIssue schema for an issue page
 */
export function generateIssueSchema(
  issue: Issue,
  translation: IssueTranslation,
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'PublicationIssue',
    issueNumber: issue.issueNumber.toString(),
    datePublished: issue.date,
    name: translation.title,
    description: translation.description,
    url: `${siteConfig.url}${locale === 'pt' ? '/pt' : ''}/issues/${issue.slug}`,
    image: `${siteConfig.url}${issue.cover}`,
    inLanguage: locale,
    isPartOf: generatePeriodicalSchema(),
    about: [
      'Surfing',
      'Sports Science',
      'Ocean Health',
      'Surf Medicine',
      'Blue Mind',
    ],
  };
}

/**
 * Generate Person schema for Chief Editor
 */
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Pedro Seixas',
    jobTitle: 'Chief Editor',
    affiliation: {
      '@type': 'Organization',
      name: 'Blue Mind Magazine',
    },
    sameAs: [
      'https://www.linkedin.com/in/pedro-seixas-31934230/',
      'https://www.instagram.com/seixasbay/',
    ],
  };
}

/**
 * Generate AboutPage schema
 */
export function generateAboutPageSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Blue Mind Magazine',
    url: `${siteConfig.url}${locale === 'pt' ? '/pt' : ''}/about`,
    description:
      'Learn about Blue Mind Magazine, our mission, and the team behind the publication.',
    mainEntity: generateOrganizationSchema(),
  };
}

/**
 * Generate ContactPage schema
 */
export function generateContactPageSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Blue Mind Magazine',
    url: `${siteConfig.url}${locale === 'pt' ? '/pt' : ''}/contact`,
    description: 'Get in touch with Blue Mind Magazine.',
    mainEntity: {
      '@type': 'Organization',
      name: siteConfig.name,
      email: siteConfig.email,
      url: siteConfig.url,
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

