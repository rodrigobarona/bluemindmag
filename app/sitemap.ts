import type { MetadataRoute } from 'next';
import { getAllIssues } from '@/content/data/issues';
import { siteConfig } from '@/content/data/navigation';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const issues = getAllIssues();
  const locales = ['en', 'pt'] as const;

  // Static pages
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/issues', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/newsletter', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  // Generate sitemap entries for static pages
  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((page) => {
    return locales.map((locale) => {
      const url =
        locale === 'en'
          ? `${baseUrl}${page.path}`
          : `${baseUrl}/${locale}${page.path}`;

      return {
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            en: `${baseUrl}${page.path}`,
            pt: `${baseUrl}/pt${page.path}`,
          },
        },
      };
    });
  });

  // Generate sitemap entries for issue detail pages
  const issueEntries: MetadataRoute.Sitemap = issues.flatMap((issue) => {
    return locales.map((locale) => {
      const url =
        locale === 'en'
          ? `${baseUrl}/issues/${issue.slug}`
          : `${baseUrl}/${locale}/issues/${issue.slug}`;

      return {
        url,
        lastModified: new Date(issue.date),
        changeFrequency: 'monthly' as const,
        priority: issue.isCurrent ? 0.9 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/issues/${issue.slug}`,
            pt: `${baseUrl}/pt/issues/${issue.slug}`,
          },
        },
      };
    });
  });

  // Generate sitemap entries for issue reader pages (flipbook)
  const readerEntries: MetadataRoute.Sitemap = issues.flatMap((issue) => {
    return locales.map((locale) => {
      const url =
        locale === 'en'
          ? `${baseUrl}/read/${issue.slug}`
          : `${baseUrl}/${locale}/read/${issue.slug}`;

      return {
        url,
        lastModified: new Date(issue.date),
        changeFrequency: 'monthly' as const,
        priority: issue.isCurrent ? 0.8 : 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/read/${issue.slug}`,
            pt: `${baseUrl}/pt/read/${issue.slug}`,
          },
        },
      };
    });
  });

  return [...staticEntries, ...issueEntries, ...readerEntries];
}

