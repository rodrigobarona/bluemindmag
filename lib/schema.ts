import type { Issue, IssueTranslation } from '@/content/types/content';
import { siteConfig } from '@/content/data/navigation';

// ============================================
// JSON-LD SCHEMA.ORG STRUCTURED DATA GENERATORS
// ============================================
// Note: Nested schemas must NOT include @context.
// Only top-level schemas (used directly in <script type="application/ld+json">)
// should have @context. Internal helpers are prefixed with underscore.

/**
 * Publisher organization (Surfisio) - for embedding only
 */
function _publisherOrganization() {
  return {
    '@type': 'Organization',
    name: 'Surfisio',
    url: 'https://surfisio.pt',
  };
}

/**
 * Blue Mind Magazine organization - for embedding only (no @context)
 * Note: Organizations don't have publishers - removed to fix validation
 */
function _organizationData() {
  return {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    email: siteConfig.email,
    sameAs: [
      'https://www.instagram.com/bluemindmag/',
      'https://www.linkedin.com/company/bluemindmag/',
    ],
    // Note: parentOrganization could be used if needed, but publisher is for creative works only
  };
}

/**
 * Periodical data - for embedding only (no @context)
 */
function _periodicalData() {
  return {
    '@type': 'Periodical',
    name: siteConfig.name,
    url: siteConfig.url,
    description: 'Surf Science: Where surf and science meet. From surfers, to surfers.',
    publisher: _publisherOrganization(),
    about: ['Surfing', 'Sports Science', 'Ocean Health', 'Surf Medicine'],
  };
}

/**
 * Generate Organization schema (standalone with @context)
 * Includes parentOrganization for Surfisio relationship
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    ..._organizationData(),
    parentOrganization: _publisherOrganization(),
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
    publisher: _organizationData(),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/issues?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Periodical schema for the magazine (standalone with @context)
 */
export function generatePeriodicalSchema() {
  return {
    '@context': 'https://schema.org',
    ..._periodicalData(),
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
    isPartOf: _periodicalData(),
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
    mainEntity: _organizationData(),
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

/**
 * Generate CollectionPage schema for issues archive
 */
export function generateCollectionPageSchema(
  locale: string,
  title: string,
  description: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description,
    url: `${siteConfig.url}${locale === 'pt' ? '/pt' : ''}/issues`,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: {
      '@type': 'Periodical',
      name: siteConfig.name,
    },
  };
}

/**
 * Generate ItemList schema for listing issues
 */
export function generateIssueListSchema(
  issues: Issue[],
  translations: Record<string, IssueTranslation>,
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${siteConfig.name} Issues`,
    numberOfItems: issues.length,
    itemListElement: issues.map((issue, index) => {
      const itemUrl = `${siteConfig.url}${locale === 'pt' ? '/pt' : ''}/issues/${issue.slug}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: itemUrl,
        item: {
          '@type': 'PublicationIssue',
          '@id': itemUrl,
          issueNumber: issue.issueNumber.toString(),
          name: translations[issue.id]?.title || `Issue ${issue.issueNumber}`,
          url: itemUrl,
          image: `${siteConfig.url}${issue.cover}`,
          datePublished: issue.date,
        },
      };
    }),
  };
}

/**
 * Generate WebPage schema for generic pages
 */
export function generateWebPageSchema(
  locale: string,
  name: string,
  description: string,
  path: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: name,
    description: description,
    url: `${siteConfig.url}${locale === 'pt' ? '/pt' : ''}${path}`,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

/**
 * Generate NewsletterPage schema with subscription action
 */
export function generateNewsletterPageSchema(
  locale: string,
  title: string,
  description: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: `${siteConfig.url}${locale === 'pt' ? '/pt' : ''}/newsletter`,
    inLanguage: locale,
    mainEntity: {
      '@type': 'Service',
      name: `${siteConfig.name} Newsletter`,
      description: 'Free newsletter about surf science and ocean health',
      provider: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
      },
      serviceType: 'Newsletter subscription',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
    potentialAction: {
      '@type': 'SubscribeAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}${locale === 'pt' ? '/pt' : ''}/newsletter`,
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
    },
  };
}

/**
 * Generate ReadAction schema for flipbook reader
 */
export function generateReadIssueSchema(
  issue: Issue,
  translation: IssueTranslation,
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Read ${translation.title}`,
    description: `Read Blue Mind Magazine Issue ${issue.issueNumber} in our digital flipbook reader.`,
    url: `${siteConfig.url}${locale === 'pt' ? '/pt' : ''}/read/${issue.slug}`,
    inLanguage: locale,
    mainEntity: {
      '@type': 'PublicationIssue',
      issueNumber: issue.issueNumber.toString(),
      name: translation.title,
      description: translation.description,
      datePublished: issue.date,
      image: `${siteConfig.url}${issue.cover}`,
      isPartOf: {
        '@type': 'Periodical',
        name: siteConfig.name,
      },
    },
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}${locale === 'pt' ? '/pt' : ''}/read/${issue.slug}`,
      },
    },
  };
}

/**
 * Generate FAQ schema for legal pages
 */
export function generateLegalPageSchema(
  locale: string,
  pageType: 'privacy' | 'cookies' | 'terms',
  title: string,
  lastUpdated: string = '2026-01-01'
) {
  const descriptions = {
    privacy: 'Privacy policy explaining how Blue Mind Magazine collects, uses, and protects your personal information.',
    cookies: 'Cookie policy explaining how Blue Mind Magazine uses cookies and similar technologies.',
    terms: 'Terms of use for Blue Mind Magazine website and services.',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: descriptions[pageType],
    url: `${siteConfig.url}${locale === 'pt' ? '/pt' : ''}/${pageType}`,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: {
      '@type': 'Thing',
      name: pageType === 'privacy' ? 'Privacy Policy' : pageType === 'cookies' ? 'Cookie Policy' : 'Terms of Service',
    },
    lastReviewed: lastUpdated,
  };
}

