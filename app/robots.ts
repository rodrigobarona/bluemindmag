import type { MetadataRoute } from 'next';
import { siteConfig } from '@/content/data/navigation';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/og'],  // Allow OG image generation for social media
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
        userAgent: 'PerplexityBot',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Cohere-AI',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'YouBot',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/api/og'],  // Allow OG image generation
        disallow: ['/api/', '/_next/', '/private/'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/api/og'],  // Allow OG image generation
        disallow: ['/api/', '/_next/', '/private/'],
      },
      // Social media crawlers need OG images
      {
        userAgent: 'Twitterbot',
        allow: ['/', '/api/og'],
        disallow: [],
      },
      {
        userAgent: 'facebookexternalhit',
        allow: ['/', '/api/og'],
        disallow: [],
      },
      {
        userAgent: 'LinkedInBot',
        allow: ['/', '/api/og'],
        disallow: [],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
