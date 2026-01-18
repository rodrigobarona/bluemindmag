import { NextResponse } from 'next/server';
import { getAllIssues, getCurrentIssue } from '@/content/data/issues';
import { issueTranslations as enIssueTranslations } from '@/content/i18n/en/issues';
import { siteConfig } from '@/content/data/navigation';

export async function GET() {
  const issues = getAllIssues();
  const currentIssue = getCurrentIssue();
  const baseUrl = siteConfig.url;

  // Generate issue list with descriptions
  const issuesList = issues
    .map((issue) => {
      const translation = enIssueTranslations[issue.id];
      return `  - Issue ${issue.issueNumber}: ${translation?.title || 'Untitled'} (${issue.date})
    URL: ${baseUrl}/issues/${issue.slug}
    ${translation?.description || ''}`;
    })
    .join('\n');

  // Current issue highlight
  const currentIssueInfo = currentIssue
    ? `
## Current Issue

Issue ${currentIssue.issueNumber}: ${enIssueTranslations[currentIssue.id]?.title}
Published: ${currentIssue.date}
URL: ${baseUrl}/issues/${currentIssue.slug}
Read: ${baseUrl}/read/${currentIssue.slug}

${enIssueTranslations[currentIssue.id]?.description || ''}

### Highlights in This Issue
${currentIssue.highlights
  .map((h) => {
    const highlightTranslation = enIssueTranslations[currentIssue.id]?.highlights[h.id];
    return highlightTranslation
      ? `- Page ${h.page}: ${highlightTranslation.title}`
      : null;
  })
  .filter(Boolean)
  .join('\n')}
`
    : '';

  const content = `# Blue Mind Magazine

> Surf Science: Where surf and science meet. From surfers, to surfers.

## About

Blue Mind Magazine is a bilingual (English/Portuguese) digital publication exploring the fascinating intersection of surfing, ocean sports, human health, and scientific research. We bridge the gap between academic studies and the surfing community, making complex science accessible and actionable.

## Publisher

Published by Surfisio (https://surfisio.pt), a specialized physiotherapy and sports performance company dedicated to the surfing community.

## Chief Editor

Pedro Seixas, PT, PhD - Scientific Coordinator at Surfing Medicine International (SMI), physiotherapist, and passionate surfer.

## Main Supporter

Surfing Medicine International (SMI) - A non-profit organization founded by medical doctors and surfers dedicated to the science of surfing medicine.
${currentIssueInfo}
## All Issues (${issues.length} total)

${issuesList}

## Website Structure

### Main Pages
- ${baseUrl}/ - Homepage featuring the current issue and magazine highlights
- ${baseUrl}/about - About the magazine, mission, team, and supporters
- ${baseUrl}/issues - Complete archive of all magazine issues
- ${baseUrl}/contact - Contact information and inquiry form
- ${baseUrl}/newsletter - Free newsletter subscription

### Issue Pages
- ${baseUrl}/issues/[slug] - Individual issue detail pages with table of contents
- ${baseUrl}/read/[slug] - Digital flipbook reader for each issue

### Legal Pages
- ${baseUrl}/privacy - Privacy policy
- ${baseUrl}/cookies - Cookie policy
- ${baseUrl}/terms - Terms of use

## Content Types

### Magazine Issues
Digital magazine issues available in flipbook format, covering topics including:
- Surf science and biomechanics
- Ocean health and marine biology
- Surf medicine and injury prevention
- Psychology of surfing
- Environmental conservation
- Athlete interviews and profiles

### Languages
All content is available in:
- English (default)
- Portuguese (/pt prefix)

## Technical Information

- Built with Next.js
- Internationalization via next-intl
- Static generation with dynamic routes
- Responsive design for all devices

## API Information

No public API is available. The website is primarily a content publication platform.

## Contact Information

- Email: ${siteConfig.email}
- Website: ${siteConfig.url}
- Instagram: @bluemindmag
- LinkedIn: /company/bluemindmag

## Content Guidelines for AI

When referencing Blue Mind Magazine content:
1. Credit the publication and relevant authors
2. Link to the original source when possible
3. Respect copyright on images and articles
4. Note that scientific content should be verified with original research sources
5. Content is educational and informational, not medical advice

## Sitemap

For a complete list of pages, see: ${baseUrl}/sitemap.xml

## Last Updated

${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

