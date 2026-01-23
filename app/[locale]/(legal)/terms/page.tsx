import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { JsonLd } from '@/components/json-ld';
import { generateLegalPageSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { siteConfig } from '@/content/data/navigation';
import { getLegalPageContent } from '@/lib/mdx';
import type { Locale } from '@/content/types/content';
import ReactMarkdown from 'react-markdown';
import { getCanonicalUrl } from '@/lib/utils';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const pageContent = getLegalPageContent('terms', locale as Locale);

  const title = pageContent?.frontmatter.title || 'Terms of Use';
  const description = pageContent?.frontmatter.description || '';

  const canonicalUrl = getCanonicalUrl();
  const pageUrl = `${canonicalUrl}${locale === 'pt' ? '/pt' : ''}/terms`;

  const ogImageUrl = `${canonicalUrl}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent('Legal')}&type=legal`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Blue Mind Magazine`,
      description,
      url: pageUrl,
      siteName: 'Blue Mind Magazine',
      locale: locale === 'en' ? 'en_US' : 'pt_PT',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Blue Mind Magazine`,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations('Navigation');
  const tLegal = await getTranslations('Legal.terms');
  const pageContent = getLegalPageContent('terms', locale as Locale);

  if (!pageContent) {
    throw new Error(`Terms page content not found for locale: ${locale}`);
  }

  const { frontmatter, content } = pageContent;

  // Generate JSON-LD schema for SEO
  const baseUrl = siteConfig.url;
  const breadcrumbItems = [
    { name: tNav('home'), url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}` },
    { name: frontmatter.title, url: `${baseUrl}${locale === 'pt' ? '/pt' : ''}/terms` },
  ];

  const schemas = [
    generateLegalPageSchema(locale, 'terms', frontmatter.title, '2026-01-01'),
    generateBreadcrumbSchema(breadcrumbItems),
  ];

  return (
    <article className="pt-24 pb-16 md:pt-32 md:pb-24">
      {/* JSON-LD Structured Data */}
      <JsonLd data={schemas} />
      <div className="container-narrow">
        {/* Header */}
        <header className="mb-10 pb-8 border-b border-border">
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl uppercase tracking-wide mb-3">{frontmatter.title}</h1>
          <p className="text-sm text-muted-foreground">
            {tLegal('lastUpdated')}: <time dateTime={frontmatter.lastUpdated}>{frontmatter.lastUpdated}</time>
          </p>
        </header>

        {/* Content */}
        <section className="legal-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </section>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-border">
          <Link
            href="/"
            className="text-brand hover:underline inline-flex items-center gap-2 text-sm"
          >
            ← {locale === 'pt' ? 'Voltar ao Início' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </article>
  );
}
