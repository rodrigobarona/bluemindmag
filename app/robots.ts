import type { MetadataRoute } from 'next';
import { siteConfig } from '@/content/data/navigation';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/'],
      },
      // AI/LLM crawler specific rules - allow access to content
      {
        userAgent: 'GPTBot',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Anthropic-AI',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
