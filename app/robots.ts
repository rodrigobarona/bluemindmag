import type { MetadataRoute } from 'next';
import { siteConfig } from '@/content/data/navigation';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/og/*'],  // Explicitly allow OG image generation
        disallow: ['/api/contact', '/api/subscribe', '/_next/', '/private/'],  // Disallow specific API routes, not all
      },
      // AI/LLM crawler specific rules - allow access to content
      {
        userAgent: 'GPTBot',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/contact', '/api/subscribe', '/_next/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/contact', '/api/subscribe', '/_next/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/contact', '/api/subscribe', '/_next/'],
      },
      {
        userAgent: 'Anthropic-AI',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/contact', '/api/subscribe', '/_next/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/contact', '/api/subscribe', '/_next/'],
      },
      {
        userAgent: 'Cohere-AI',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/contact', '/api/subscribe', '/_next/'],
      },
      {
        userAgent: 'YouBot',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/contact', '/api/subscribe', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/api/og/*'],  // Allow OG image generation
        disallow: ['/api/contact', '/api/subscribe', '/_next/', '/private/'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/api/og/*'],  // Allow OG image generation
        disallow: ['/api/contact', '/api/subscribe', '/_next/', '/private/'],
      },
      // Social media crawlers need OG images - NO RESTRICTIONS
      {
        userAgent: 'Twitterbot',
        allow: ['/'],
        disallow: [],
      },
      {
        userAgent: 'facebookexternalhit',
        allow: ['/'],
        disallow: [],
      },
      {
        userAgent: 'LinkedInBot',
        allow: ['/'],
        disallow: [],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
