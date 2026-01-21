import type { Issue, IssueTranslation } from '@/content/types/content';
import { siteConfig, socialLinks, externalLinks } from '@/content/data/navigation';
import { getEditor, getPublisher } from '@/content/data/team';

// ============================================
// JSON-LD SCHEMA.ORG STRUCTURED DATA GENERATORS
// ============================================
// Note: Nested schemas must NOT include @context.
// Only top-level schemas (used directly in <script type="application/ld+json">)
// should have @context. Internal helpers are prefixed with underscore.
//
// References:
// - https://schema.org/Organization
// - https://schema.org/Periodical
// - https://schema.org/PublicationIssue
// - https://developers.google.com/search/docs/appearance/structured-data

/**
 * Get social links URLs for sameAs property (from centralized content)
 */
function _getSocialUrls(): string[] {
  return socialLinks.map(link => link.url);
}

/**
 * Publisher organization (Surfisio) - for embedding only
 * Uses centralized externalLinks
 */
function _publisherOrganization() {
  const publisher = getPublisher();
  return {
    '@type': 'Organization',
    name: 'Surfisio',
    url: externalLinks.surfisio,
    sameAs: publisher?.social ? [
      publisher.social.website,
      publisher.social.linkedin,
      publisher.social.instagram,
    ].filter(Boolean) : [externalLinks.surfisio],
  };
}

/**
 * Blue Mind Magazine organization - for embedding only (no @context)
 * Uses centralized siteConfig and socialLinks
 */
function _organizationData() {
  return {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    email: siteConfig.email,
    sameAs: _getSocialUrls(),
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
 * Follows schema.org WebSite with SearchAction pattern
 * @see https://schema.org/WebSite
 * @see https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: `${siteConfig.tagline}. Surf Science: Where surf and science meet.`,
    inLanguage: ['en', 'pt'],
    publisher: _organizationData(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/issues?q={search_term_string}`,
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
 * Uses centralized team data from content/data/team.ts
 */
export function generatePersonSchema() {
  const editor = getEditor();
  const editorSocialLinks = editor?.social ? [
    editor.social.linkedin,
    editor.social.instagram,
  ].filter(Boolean) : [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Pedro Seixas',
    jobTitle: 'Chief Editor',
    image: editor?.image ? `${siteConfig.url}${editor.image}` : undefined,
    affiliation: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    worksFor: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    sameAs: editorSocialLinks,
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
 * Note: ListItem uses either 'url' OR 'item', not both (mutually exclusive)
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

