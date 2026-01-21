import { NextResponse } from 'next/server';
import { getAllIssues, getIssueTranslations } from '@/content/data/issues';
import { siteConfig } from '@/content/data/navigation';

/**
 * RSS Feed Route - Generates an RSS 2.0 feed for magazine issues
 * URL: /feed.xml
 */
export async function GET() {
  const issues = getAllIssues();
  const enTranslations = getIssueTranslations('en');
  const baseUrl = siteConfig.url;

  // Generate RSS items for each issue
  const items = issues
    .map((issue) => {
      const translation = enTranslations[issue.id];
      const pubDate = new Date(issue.date).toUTCString();
      const issueUrl = `${baseUrl}/issues/${issue.slug}`;
      const readUrl = `${baseUrl}/read/${issue.slug}`;

      return `
    <item>
      <title>${escapeXml(translation?.title || `Issue ${issue.issueNumber}`)}</title>
      <link>${issueUrl}</link>
      <guid isPermaLink="true">${issueUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(translation?.description || '')}</description>
      <enclosure url="${baseUrl}${issue.cover}" type="image/png" />
      <content:encoded><![CDATA[
        <p>${escapeXml(translation?.description || '')}</p>
        <p><a href="${readUrl}">Read the full issue online</a></p>
        <h3>In This Issue:</h3>
        <ul>
          ${issue.highlights
            .map((h) => {
              const highlightTranslation = translation?.highlights[h.id];
              return `<li><strong>Page ${h.page}:</strong> ${escapeXml(highlightTranslation?.title || 'Untitled')} - ${escapeXml(highlightTranslation?.excerpt || '')}</li>`;
            })
            .join('\n          ')}
        </ul>
      ]]></content:encoded>
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteConfig.tagline)}. Surf Science: Where surf and science meet.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/images/logo/blue-mind-logo.png</url>
      <title>${escapeXml(siteConfig.name)}</title>
      <link>${baseUrl}</link>
    </image>
    <managingEditor>${siteConfig.email} (Blue Mind Magazine)</managingEditor>
    <webMaster>${siteConfig.email} (Blue Mind Magazine)</webMaster>
    <copyright>© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.</copyright>
    <category>Science</category>
    <category>Surfing</category>
    <category>Ocean</category>
    <category>Health</category>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

